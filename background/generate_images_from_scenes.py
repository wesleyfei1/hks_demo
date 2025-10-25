import os
import json
import requests
import shutil
from pathlib import Path

# ========== CONFIGURATION ==========
# Prefer environment variables for local bridge overrides. Fallback to file-local defaults.
API_URL = os.getenv('IMAGE_API_URL', "https://api.siliconflow.cn/v1/images/generations")
API_KEY = os.getenv('IMAGE_API_KEY', "sk-gyxfthqwngqqnfaghtrnnhtrhdumjjqlkgmipqhywjpoilho")
MODEL = os.getenv('IMAGE_MODEL', "Qwen/Qwen-Image")      # 可选: Qwen/Qwen-Image, Kwai-Kolors/Kolors 等
OUTPUT_DIR = os.getenv('IMAGE_OUTPUT_DIR', "generated_images")
IMAGE_SIZE = os.getenv('IMAGE_SIZE', "1024x1024")       # 推荐分辨率，可改为 "1472x1140" (4:3)
# ===================================

def create_prompt(scene_text: str, scene_summary: str) -> str:
    """
    构造图像生成提示词，可根据需要扩展（如风格、光线、情绪）
    """
    base_prompt = (
        f"{scene_summary}, cinematic lighting, soft focus, "
        f"high-quality digital illustration, realistic style"
    )
    return base_prompt


def generate_image(prompt: str, index: int):
    """
    调用 API 生成图片并保存
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL,
        "prompt": prompt,
        "image_size": IMAGE_SIZE
    }

    print(f"[{index}] 生成图像中... prompt: {prompt}")
    response = requests.post(API_URL, headers=headers, json=data)

    if response.status_code != 200:
        print(f"❌ API 错误 ({response.status_code}): {response.text}")
        return None

    resp_json = response.json()
    # 返回数据格式中通常包含 `data[0].url`
    image_url = resp_json["data"][0]["url"]

    # 下载图片
    img_data = requests.get(image_url).content
    filename = os.path.join(OUTPUT_DIR, f"scene_{index:03d}.png")
    with open(filename, "wb") as f:
        f.write(img_data)

    print(f"✅ 已保存图像 -> {filename}")
    return filename


def main(input_path: str):
    # Path(OUTPUT_DIR).mkdir(exist_ok=True)
    if os.path.exists(OUTPUT_DIR):
        print(f"🗑️ 检测到已有文件夹 {OUTPUT_DIR}，正在删除旧文件...")
        shutil.rmtree(OUTPUT_DIR)  # 删除整个文件夹及内容

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"📁 已创建新的输出文件夹: {OUTPUT_DIR}")
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    scenes = data.get("segments", [])
    for i, scene in enumerate(scenes):
        if scene.get("type") != "scene":
            continue
        prompt = create_prompt(scene["text"], scene["summary"])
        generate_image(prompt, i)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate images for story scenes.")
    parser.add_argument("--segments", required=True, help="Path to scene JSON file.")
    args = parser.parse_args()
    main(args.segments)


# python generate_images_from_scenes.py --segments input_story.txt.json
