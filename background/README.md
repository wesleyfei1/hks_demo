HOW TO USE IT:

1.输入文本，input_story.txt 中；
2. AI 对文本进行分割；命令：python story_segmenter.py --mode heuristic --density 0.6 input_story.txt；在此目录下创建 json 文件。density为图像密度，由用户设定；同时生成标记后的文档input_story.txt.annotated.txt.
3. 根据分割后的主题生成图片，存在 generated_images 文件夹. 命令：python generate_images_from_scenes.py --segments input_story.txt.json
4. 将图片按编号插入 input_story.txt.annotated.txt 生成带图的md文档，存在 input_story.txt.annotated_with_images.md。

目前的目录结构：>generated_images
                    scene_000.png
                    scene_001.png
generate_images_from_scenes.py
input_story.txt
input_story.txt.annotated_with_images.md
input_story.txt.annotated.txt
input_story.txt.json
insert_images_into_md.py
story_segmenter.py