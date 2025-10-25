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
