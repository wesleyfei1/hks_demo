#!/usr/bin/env python3
# coding: utf-8
"""
insert_images_into_md.py
将 txt 文件中形如 {seg 001} 的标记替换为对应图片（generated_images/scene_001.png）
并输出为 Markdown 文件。

用法示例：
python insert_images_into_md.py story.txt
"""

import os
import re
import glob
import shutil
import argparse

DEFAULT_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
SEG_RE = re.compile(r'\{seg\s*0*([0-9]+)\}', re.IGNORECASE)
IMAGES_DIR = 'generated_images'  # 固定图片目录名


def find_image_for_number(num_str, prefix='scene_', exts=DEFAULT_EXTS):
    """在 generated_images 目录中寻找 scene_###.png 等文件"""
    n = int(num_str)
    # 尝试不同位数的编号匹配
    for pad in (3, 2, 1, 4):
        base = f"{prefix}{n:0{pad}d}"
        for ext in exts:
            path = os.path.join(IMAGES_DIR, base + ext)
            if os.path.isfile(path):
                return os.path.abspath(path)

    # 模糊匹配：包含数字的文件名
    for ext in exts:
        pattern = os.path.join(IMAGES_DIR, f"*{num_str}*{ext}")
        matches = glob.glob(pattern)
        if matches:
            return os.path.abspath(matches[0])
    return None


def make_rel_path(target_path, base_dir):
    rel = os.path.relpath(target_path, start=base_dir)
    return rel.replace(os.path.sep, '/')


def process_text(content, output_dir, copy_images=False):
    """替换 {seg xxx} 标记为 Markdown 图片语法"""
    not_found = []

    def repl(m):
        num = m.group(1)
        found = find_image_for_number(num)
        original_marker = m.group(0)
        if not found:
            not_found.append(num)
            return f"{original_marker}\n\n<!-- ⚠️ 未找到对应图片 scene_{num}.png -->\n"
        if copy_images:
            img_outdir = os.path.join(output_dir, 'images')
            os.makedirs(img_outdir, exist_ok=True)
            dest_name = os.path.basename(found)
            dest_path = os.path.join(img_outdir, dest_name)
            if os.path.abspath(found) != os.path.abspath(dest_path):
                shutil.copy2(found, dest_path)
            rel = make_rel_path(dest_path, output_dir)
            return f"<!-- {original_marker} -->\n\n![]({rel})\n"
        else:
            rel = make_rel_path(found, output_dir)
            return f"<!-- {original_marker} -->\n\n![]({rel})\n"

    new_content = SEG_RE.sub(repl, content)
    return new_content, not_found


def main():
    parser = argparse.ArgumentParser(description="在 txt 文件中插入 generated_images/scene_###.png 图片并生成 Markdown。")
    parser.add_argument("txt", help="输入 txt 文件")
    parser.add_argument("--out-md", "-o", default=None, help="输出 Markdown 文件名（默认 story_with_images.md）")
    parser.add_argument("--copy-images", action="store_true", help="是否复制图片到输出目录的 images/ 子文件夹")
    args = parser.parse_args()

    txt_path = args.txt
    if not os.path.isfile(txt_path):
        print(f"❌ 找不到输入文件：{txt_path}")
        return
    if not os.path.isdir(IMAGES_DIR):
        print(f"❌ 找不到图片目录：{IMAGES_DIR}")
        return

    with open(txt_path, "r", encoding="utf-8") as f:
        content = f.read()

    out_md = args.out_md or os.path.splitext(txt_path)[0] + "_with_images.md"
    output_dir = os.path.abspath(os.path.dirname(out_md)) or os.getcwd()

    new_content, not_found = process_text(content, output_dir, copy_images=args.copy_images)
    with open(out_md, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ 已生成 Markdown 文件：{out_md}")
    if args.copy_images:
        print(f"📁 图片已复制到：{os.path.join(os.path.dirname(out_md), 'images')}")
    if not_found:
        print(f"⚠️ 未找到以下图片编号：{', '.join(not_found)}")
    else:
        print("✅ 所有图片均已成功匹配。")


if __name__ == "__main__":
    main()

# python insert_images_into_md.py input_story.txt.annotated.txt
