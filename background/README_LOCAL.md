Local bridge server for frontend development

Purpose:
- Provide a simple local HTTP bridge so the frontend can call analysis and image-generation logic during development without calling external AI providers.

Quick start (Windows / PowerShell):
1. Create a Python virtual environment and install requirements:
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt

2. Run the server from the repository root (or inside background):
   python background\server.py

3. The server listens on http://0.0.0.0:8000 by default. Frontend will try http://127.0.0.1:8000/analyze and /generate_image.

Notes:
- The server attempts to invoke existing scripts in this folder (story_segmenter.py and generate_images_from_scenes.py). If those scripts are not available or fail, the server returns a conservative simulated result.
- For real image generation, configure API keys inside `generate_images_from_scenes.py` or update the script to read environment variables.

Forwarding model parameters from frontend
- The bridge server accepts model/API parameters sent from the frontend and forwards them to the backend scripts so the backend uses the same model settings as the UI.
   - `/analyze` accepts fields like `api_key` or `apiKey`, `api_url` or `apiUrl`, `model`, and `provider`. These are passed to `story_segmenter` as CLI args or module kwargs.
   - `/generate_image` accepts `image_api_key`/`imageApiKey`, `image_api_url`/`imageApiUrl`, `image_model`/`imageModel`, `image_size`/`imageSize`, etc. These are injected into environment variables (`IMAGE_API_KEY`, `IMAGE_API_URL`, `IMAGE_MODEL`, `IMAGE_SIZE`) before invoking `generate_images_from_scenes.py`.

Example payloads (JSON):
- Analyze:
   {
      "text": "...story text...",
      "apiKey": "sk-...",
      "apiUrl": "https://api.openai.com/v1",
      "model": "gpt-4"
   }

- Generate image:
   {
      "prompt": "a cinematic illustration of...",
      "imageApiKey": "sk-...",
      "imageApiUrl": "https://api.svc.example/v1/images",
      "imageModel": "sd-xl-1.0",
      "imageSize": "1024x1024"
   }

   Simulation mode (useful for UI development without upstream AI):
   - You can instruct the bridge to return deterministic simulated responses by either:
     - Adding a query param: `http://127.0.0.1:8000/analyze?simulate=1` or `http://127.0.0.1:8000/generate_image?simulate=1`
     - Sending `"simulate": true` in the JSON body of the POST request.

   Examples:
    - Analyze (simulate):
       POST http://127.0.0.1:8000/analyze?simulate=1
       Body: { "text": "..." }

    - Generate image (simulate):
       POST http://127.0.0.1:8000/generate_image?simulate=1
       Body: { "prompt": "..." }

   When simulate is enabled:
   - `/analyze` returns a small sample `segments` array and `suggested_illustrations` so the frontend can render the analysis UI.
   - `/generate_image` returns a predictable `files` array (filenames) that the frontend will map to `http://127.0.0.1:8000/static/generated_images/<name>` for local testing.
