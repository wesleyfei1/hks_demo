背景工程整合说明

目标：把收到的后端工程 `OTHER-BACKGROUND` 移动为仓库内 `background/`，并提供一套本地运行/串联前端（移动端/Expo）与后端（Python）的小说明。

注意事项（重要）
- 本次自动化步骤在仓库内创建了 `background/` 代码副本（文本代码/脚本/README 等）。因为工具对二进制文件处理有限，`generated_images/` 中的二进制图片没有自动复制。
- 为了保证后端工程完整（含图片等生成产物），建议在本地运行提供的 PowerShell 脚本 `scripts/move-backend.ps1`，该脚本会把原始 `OTHER-BACKGROUND` 整体安全移动到 `background/`（或将其内容合并到已存在的 `background/`），保留二进制文件。

推荐本地操作（PowerShell）：
1. 在仓库根运行（确保工作目录是 e:\A\大二上\HKS）：

```powershell
# 运行脚本（会移动或合并 OTHER-BACKGROUND 到 background）
.\scripts\move-backend.ps1
```

2. 验证移动结果：检查 `background/` 是否包含：
- `story_segmenter.py`
- `generate_images_from_scenes.py`
- `insert_images_into_md.py`
- `input_story.txt`、`input_story.txt.json` 等
- `generated_images/`（如果你选择了移动/合并，图片将一并被移动）

如何在本地同时运行前端和后端（示例）

- 后端（Python）：
  - 建议新建虚拟环境并安装依赖：
    ```powershell
    cd background
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirement.txt
    # 运行示例脚本（分段）
    python story_segmenter.py --mode heuristic --density 0.6 input_story.txt
    # 生成图片（如果配置了 API）：
    python generate_images_from_scenes.py --segments input_story.txt.json
    ```

- 前端（Expo）：
  - 前端位于 `download-APP_GENERATION/app_495320945922`（或仓库内其他 app/ 入口），在该目录下：
    ```powershell
    cd download-APP_GENERATION\app_495320945922
    npm install
    npm start
    ```

- 同时启动（提示）：可以在两个终端分别运行上面的命令，或使用 VS Code 的多终端分组。

为什么没直接在代理上移动图片？
- 编辑器对二进制文件的操作受限。为了不破坏图片内容，我在仓库中复制了后端的文本文件并添加了脚本，建议你在本地运行 `scripts\move-backend.ps1` 来完成完整的移动（包含二进制）。

后续我可以帮你：
- 如果同意，我可以删除我已复制到 `background/` 的文件（避免重复），并建议你在本地通过脚本直接移动原目录（更安全）。
- 或者，我可以把前端的 AI 请求默认 API 地址指向 `http://localhost:5000`（或你希望的后端端口），并在 `background/` 中添加一个简单 Flask/HTTP wrapper（不会修改后端现有文件，只会新增一个桥接文件），方便前端直接调用后端分析接口。请告诉我你想要哪种方式。