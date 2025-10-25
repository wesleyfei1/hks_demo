#!/usr/bin/env python3
"""
Simple local bridge server to expose backend tools to the frontend during development.

Endpoints:
- GET /health -> 200 OK
- POST /analyze -> { text, mode='heuristic', density=0.5 } -> returns JSON of segmentation/analysis
- POST /generate_image -> { prompt } -> attempts to run image generator (if configured) or returns simulated result

Run:
  python server.py

Requirements: flask, requests
"""
import os
import sys
import json
import tempfile
import subprocess
from pathlib import Path
from flask import Flask, request, jsonify

ROOT = Path(__file__).resolve().parent
APP = Flask(__name__)


def run_story_segmenter(text: str, mode: str = 'heuristic', density: float = 0.5, ai_kwargs: dict = None):
    """Try to run story_segmenter.py via CLI and return parsed JSON.
    Falls back to importing the module and calling segment_story if subprocess fails.
    """
    seg_script = ROOT / 'story_segmenter.py'
    if seg_script.exists():
        with tempfile.TemporaryDirectory() as td:
            in_path = Path(td) / 'input.txt'
            out_path = Path(td) / 'output.json'
            in_path.write_text(text, encoding='utf-8')
            cmd = [sys.executable, str(seg_script), str(in_path), '--output', str(out_path), '--mode', mode, '--density', str(density)]
            # append ai kwargs to CLI if provided
            if ai_kwargs:
                if ai_kwargs.get('api_key'):
                    cmd += ['--api_key', str(ai_kwargs.get('api_key'))]
                if ai_kwargs.get('api_url'):
                    cmd += ['--api_url', str(ai_kwargs.get('api_url'))]
                if ai_kwargs.get('model'):
                    cmd += ['--model', str(ai_kwargs.get('model'))]
                if ai_kwargs.get('provider'):
                    cmd += ['--provider', str(ai_kwargs.get('provider'))]
            try:
                proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                if proc.returncode != 0:
                    APP.logger.warning('story_segmenter CLI failed: %s %s', proc.returncode, proc.stderr)
                    raise RuntimeError('subprocess failed')
                if out_path.exists():
                    return json.loads(out_path.read_text(encoding='utf-8'))
            except Exception as e:
                APP.logger.warning('story_segmenter CLI invocation error: %s', e)

    # Fallback: try importing the module
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location('story_segmenter', str(seg_script))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        # call segment_story if available
        if hasattr(module, 'segment_story'):
            # pass ai kwargs through to the module call if supported
            if ai_kwargs:
                return module.segment_story(text, density=float(density), mode=mode, **ai_kwargs)
            return module.segment_story(text, density=float(density), mode=mode)
    except Exception as e:
        APP.logger.warning('Fallback import of story_segmenter failed: %s', e)

    # Final fallback: very small heuristic summary
    return {
        'segments': [
            {
                'type': 'scene',
                'start_sentence': 0,
                'end_sentence': 0,
                'text': text[:1000],
                'summary': (text[:160] + '...') if len(text) > 160 else text
            }
        ],
        'twists': []
    }


@APP.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@APP.route('/analyze', methods=['POST'])
def analyze():
    payload = request.get_json(force=True)
    text = payload.get('text', '')
    mode = payload.get('mode', 'heuristic')
    density = float(payload.get('density', 0.5))
    if not text:
        return jsonify({'error': 'missing text'}), 400

    try:
        # collect ai params forwarded from frontend (optional)
        ai_kwargs = {}
        for k in ('api_key', 'api_url', 'model', 'provider'):
            if k in payload:
                ai_kwargs[k] = payload.get(k)

        res = run_story_segmenter(text, mode=mode, density=density, ai_kwargs=ai_kwargs if ai_kwargs else None)
        return jsonify({'ok': True, 'result': res})
    except Exception as e:
        APP.logger.exception('analyze failed')
        return jsonify({'ok': False, 'error': str(e)}), 500


@APP.route('/generate_image', methods=['POST'])
def generate_image():
    payload = request.get_json(force=True)
    prompt = payload.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'missing prompt'}), 400

    gen_script = ROOT / 'generate_images_from_scenes.py'
    # If the generator script exists and seems configured, attempt to invoke it with a tiny payload
    if gen_script.exists():
        # The generator expects a segments JSON file. We'll create a minimal segments file and call it.
        with tempfile.TemporaryDirectory() as td:
            seg_path = Path(td) / 'segments.json'
            # minimal structure expected by script
            seg_data = {'segments': [{'type': 'scene', 'text': prompt, 'summary': prompt[:160]}]}
            seg_path.write_text(json.dumps(seg_data, ensure_ascii=False), encoding='utf-8')
            cmd = [sys.executable, str(gen_script), '--segments', str(seg_path)]
            # If image ai params provided, pass them via environment variables so the script can pick them up
            env = os.environ.copy()
            for k in ('image_api_key', 'image_api_url', 'image_model', 'image_output_dir', 'image_size'):
                if k in payload:
                    # map payload keys to expected env var names
                    if k == 'image_api_key':
                        env['IMAGE_API_KEY'] = str(payload.get(k))
                    if k == 'image_api_url':
                        env['IMAGE_API_URL'] = str(payload.get(k))
                    if k == 'image_model':
                        env['IMAGE_MODEL'] = str(payload.get(k))
                    if k == 'image_output_dir':
                        env['IMAGE_OUTPUT_DIR'] = str(payload.get(k))
                    if k == 'image_size':
                        env['IMAGE_SIZE'] = str(payload.get(k))
            try:
                proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120, env=env)
                if proc.returncode != 0:
                    APP.logger.warning('generate_images_from_scenes failed: %s', proc.stderr)
                    # Fall through to simulated response
                else:
                    # Look for generated_images dir
                    out_dir = ROOT / 'generated_images'
                    if out_dir.exists():
                        files = [str(p.name) for p in sorted(out_dir.iterdir()) if p.is_file()]
                        return jsonify({'ok': True, 'files': files})
            except Exception as e:
                APP.logger.warning('generate_images invocation error: %s', e)

    # Simulated response: return a placeholder URL (frontend can handle)
    return jsonify({'ok': True, 'simulated': True, 'url': 'http://localhost:8000/static/placeholder.png', 'note': 'simulated result; configure generate_images_from_scenes.py for real generation'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    APP.run(host='0.0.0.0', port=port, debug=True)
