## 快速目标
将仓库内的关键上下文、最近的工程变更和本地开发/调试要点浓缩成一个便于 AI 辅助编码代理（以及新来开发者）快速上手的说明文档。

下面是与本仓库当前状态匹配的精简说明（中文），包含项目概要、最近加入的本地后端桥接与 simulate 开发模式、关键文件位置、快速启动命令与常见调试步骤、以及下一步建议。

## 一句话概览
这是一个基于 Expo + TypeScript 的移动/跨平台项目（使用 `expo-router` 的 file-based routing）。近期新增了一个本地 Python 后端桥接（Flask），用于本地调试 AI 文本分析与图像生成，前端默认优先调用本地桥接（支持 simulate 模式以离线开发）。

## 关键位置（高频查看）
- 项目根：`package.json`, `tsconfig.json`, `eslint.config.mjs`
- 前端路由/入口：`app/_layout.tsx` 与 `app/*.tsx`（页面以 `p-` 前缀命名）
- 页面实现：`screens/*/index.tsx` 与 `screens/*/styles.ts`（复杂页面的逻辑与样式通常在这里）
- 分页组件示例：`screens/p-works_list/components/WorkCard`、`FilterDropdown`
- 本地后端桥接：`background/server.py`（Flask），和辅助脚本 `background/generate_images_from_scenes.py`、`background/story_segmenter.py`
- 后端依赖：`background/requirements.txt`

## 最近重要变更（摘要）
- 增加本地 Python 桥接服务 `background/server.py`：提供 `/analyze` 与 `/generate_image` 接口，支持 CORS、模拟模式（simulate），并能把前端传来的 `segments` 写入临时文件供图像脚本使用，同时暴露 `/static/generated_images/<filename>` 来读取生成后的图片。
- 前端改动（主要在 `screens/p-new_work` 与 `screens/p-analysis_result`）：前端会把用户配置（文本/图片模型、API key、URL、size 等）以 camelCase 与 snake_case 两种形式同时发送到桥接，支持在本地开发时走 `?simulate=1` 以快速查看 UI；分析结果页面增加按段位生成图与批量生成（并发控制）、生成结果缓存与保存/取消编辑逻辑；新建页增加自动保存草稿与恢复功能。
- 图像生成脚本已修改为从环境变量读取 IMAGE_* 配置，以便桥接在运行时注入。

## 快速本地运行（Windows PowerShell）
1) 启动本地 Python 桥接（建议在虚拟环境中执行）：
```powershell
cd background
python -m venv .venv ; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python server.py
```
默认监听 0.0.0.0:8000，测试 simulate 模式示例：POST `http://127.0.0.1:8000/analyze?simulate=1`。

2) 启动前端（项目根的 `app` 目录）：
```powershell
cd app
npm install
npm run start
```
在开发阶段，前端会优先请求 `http://127.0.0.1:8000`（本地桥接）。

## 常见调试与验证点
- 如果出现 upstream provider 的 403（例如模型需要付费或余额不足），优先查看 `background/server.py` 的日志，确认桥接是否正确转发了 `apiKey` 与 `model` 字段。
- 使用 simulate 模式可以完全离线验证 UI（`?simulate=1` 或 body 中 `"simulate": true`）。
- 生成图片后，桥接会把图片放在 `background/static/generated_images/` 并通过静态路由提供访问，前端将把这些 URL 缓存到 AsyncStorage（键名如 `@analysis_images_<workId>`）。

## 快速契约（对要修改的模块说明，便于自动化代理）
- 局部输入/输出契约示例：
  - `/analyze` 输入：{ text, userSettings?, simulate? } 输出：{ ok: true, result: { segments: [...], suggested_illustrations: [...] } }
  - `/generate_image` 输入：{ prompt, segments, image_model?, image_size?, api_key? } 输出：{ ok: true, files: ["imgA.png", ...] }

## 小心事项与安全
- 不要将真实生产 API keys 写进前端或公开仓库；本地调试可在桥接进程注入或使用临时开发 key。
- 修改 `expo` 原生依赖或底层 native 插件前请说明并在 CI/团队中确认（可能需要 dev build）。

## 建议的下一步（小步可回滚）
1. 添加 `types/` 中的共享 TypeScript 类型（Work, Illustration, Segment），并在 `screens/*` 引用。
2. 将复用组件（WorkCard、FilterDropdown）提升到 `app/components/` 或 `screens/_shared/`，减少重复实现。
3. 为桥接增添更详细的请求/响应日志与失败重试策略，或把模拟数据放到 `background/mock/` 目录以便维护。

---
如果你希望我把这份摘要进一步调整为更短的快速入口（例如 1 层要点或贡献者 checklist），或直接把本地后端的运行脚本自动加入到 `README.md`，回复“简化为一页要点”或“把后端运行脚本写入 README”。
