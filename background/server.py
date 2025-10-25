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
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS

ROOT = Path(__file__).resolve().parent
APP = Flask(__name__)
# enable CORS so web frontends (running on different origin) can call this bridge during dev
CORS(APP)


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
    APP.logger.info('[/analyze] incoming payload: %s', json.dumps(payload, ensure_ascii=False))
    # allow quick local simulation via query param or payload flag
    simulate_q = request.args.get('simulate')
    simulate_flag = payload.get('simulate') if isinstance(payload, dict) else None
    simulate = False
    if simulate_q is not None:
        try:
            simulate = bool(int(simulate_q))
        except Exception:
            simulate = simulate_q.lower() in ('1', 'true', 'yes')
    if simulate_flag is not None:
        simulate = bool(simulate_flag)
    text = payload.get('text', '')
    mode = payload.get('mode', 'heuristic')
    density = float(payload.get('density', 0.5))
    if not text:
        return jsonify({'error': 'missing text'}), 400

    try:
        # If simulate mode requested, return a deterministic sample analysis
        if simulate:
            sample = {
                'segments': [
                    {'type': 'scene', 'start_sentence': 0, 'end_sentence': 4, 'text': text[:400], 'summary': '开场：介绍背景与主角'},
                    {'type': 'scene', 'start_sentence': 5, 'end_sentence': 12, 'text': text[400:1200], 'summary': '冲突展开：对立出现，目标明确'},
                    {'type': 'scene', 'start_sentence': 13, 'end_sentence': 24, 'text': text[1200:2400], 'summary': '高潮：决战与情感释放'}
                ],
                'suggested_illustrations': [
                    {'position': '段落 1-2', 'reason': '开场设定，视觉感强'},
                    {'position': '高潮段落', 'reason': '冲突顶点，情绪强烈'}
                ],
                'notes': '这是本地 simulate 模式下的示例分析，非真实模型输出'
            }
            return jsonify({'ok': True, 'result': sample})

        # collect ai params forwarded from frontend (optional)
        # Accept both snake_case and camelCase keys from frontend
        ai_key_map = {
            'api_key': ['api_key', 'apiKey', 'api_key'],
            'api_url': ['api_url', 'apiUrl', 'api_url'],
            'model': ['model', 'model'],
            'provider': ['provider', 'provider']
        }
        ai_kwargs = {}
        for out_key, candidates in ai_key_map.items():
            for c in candidates:
                if c in payload and payload.get(c) is not None:
                    ai_kwargs[out_key] = payload.get(c)
                    break

        APP.logger.info('[/analyze] forwarding ai_kwargs: %s', json.dumps(ai_kwargs, ensure_ascii=False))
        res = run_story_segmenter(text, mode=mode, density=density, ai_kwargs=ai_kwargs if ai_kwargs else None)
        return jsonify({'ok': True, 'result': res})
    except Exception as e:
        APP.logger.exception('analyze failed')
        return jsonify({'ok': False, 'error': str(e)}), 500


@APP.route('/generate_image', methods=['POST'])
def generate_image():
    payload = request.get_json(force=True)
    prompt = payload.get('prompt', '')
    APP.logger.info('[/generate_image] incoming payload: %s', json.dumps(payload, ensure_ascii=False))
    if not prompt:
        return jsonify({'error': 'missing prompt'}), 400

    # support simulation via ?simulate=1 or payload.simulate = true
    simulate_q = request.args.get('simulate')
    simulate_flag = payload.get('simulate') if isinstance(payload, dict) else None
    simulate = False
    if simulate_q is not None:
        try:
            simulate = bool(int(simulate_q))
        except Exception:
            simulate = simulate_q.lower() in ('1', 'true', 'yes')
    if simulate_flag is not None:
        simulate = bool(simulate_flag)

    if simulate:
        # return a predictable set of filenames that frontend can map to static URLs
        sample_files = [
            'sim_illustration_1.png',
            'sim_illustration_2.png'
        ]
        return jsonify({'ok': True, 'simulated': True, 'files': sample_files, 'note': 'simulate mode'})

    gen_script = ROOT / 'generate_images_from_scenes.py'
    # If the generator script exists and seems configured, attempt to invoke it with a tiny payload
    if gen_script.exists():
        # The generator expects a segments JSON file. We'll create a minimal segments file and call it.
        with tempfile.TemporaryDirectory() as td:
            seg_path = Path(td) / 'segments.json'
            # minimal structure expected by script
            # If frontend supplied segments, prefer them. Accept either:
            # - payload['segments'] as a dict {'segments': [...]}
            # - payload['segments'] as a list [...]
            if 'segments' in payload and payload.get('segments'):
                seg_payload = payload.get('segments')
                if isinstance(seg_payload, list):
                    seg_data = {'segments': seg_payload}
                else:
                    seg_data = seg_payload
            else:
                seg_data = {'segments': [{'type': 'scene', 'text': prompt, 'summary': prompt[:160]}]}

            seg_path.write_text(json.dumps(seg_data, ensure_ascii=False), encoding='utf-8')
            cmd = [sys.executable, str(gen_script), '--segments', str(seg_path)]
            # If image ai params provided, pass them via environment variables so the script can pick them up
            env = os.environ.copy()
            # accept both snake_case and camelCase from frontend
            image_key_map = {
                'IMAGE_API_KEY': ['image_api_key', 'imageApiKey', 'image_api_key'],
                'IMAGE_API_URL': ['image_api_url', 'imageApiUrl', 'image_api_url'],
                'IMAGE_MODEL': ['image_model', 'imageModel', 'image_model'],
                'IMAGE_OUTPUT_DIR': ['image_output_dir', 'imageOutputDir', 'image_output_dir'],
                'IMAGE_SIZE': ['image_size', 'imageSize', 'image_size']
            }
            for env_name, candidates in image_key_map.items():
                for c in candidates:
                    if c in payload and payload.get(c) is not None:
                        env[env_name] = str(payload.get(c))
                        break
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


@APP.route('/static/generated_images/<path:filename>', methods=['GET'])
def serve_generated_image(filename: str):
    """Serve generated images from background/generated_images (if present).
    This is a simple convenience for local testing and should not be used as-is in production
    without proper security controls.
    """
    out_dir = ROOT / 'generated_images'
    if not out_dir.exists():
        abort(404)
    return send_from_directory(directory=str(out_dir), path=filename)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    APP.run(host='0.0.0.0', port=port, debug=True)
