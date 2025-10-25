## 快速目标
为 AI 辅助编码代理提供可立即上手的仓库级别背景：架构要点、开发/运行命令、文件/路由约定、关键集成点与示例位置。

## 核心概览（一句话）
这是一个使用 Expo + TypeScript 的移动/跨平台项目（使用 expo-router 的 file-based routing），代码主要在 `app` 与 `screens` 下。

## 关键位置（可直接打开）
- 项目根脚本与依赖：`package.json`
- 运行/路由入口：`app/_layout.tsx`
- 页面（file-based routing）：`app/*.tsx`（例如 `p-works_list.tsx`）
- 传统/复用页面与样式：`screens/*/index.tsx` 与对应 `styles.ts`
- 页面内小组件：`screens/p-works_list/components/*`（例如 `FilterDropdown`, `WorkCard`）
- 静态资源：`assets/{fonts,images}`
- 配置：`eslint.config.mjs`, `tsconfig.json`, `metro.config.js`, `expo-env.d.ts`

## 立刻可用的开发命令（来自 package.json）
- 安装依赖：`npm install`
- 本地启动（Metro / Expo dev UI）：`npm run start` 或 `npx expo start`
- 在安卓模拟器：`npm run android`（等价 `expo start --android`）
- 在 iOS 模拟器：`npm run ios`
- 在 Web：`npm run web`
- 运行测试（Jest + jest-expo）：`npm run test`（watch 模式）
- Lint：`npm run lint`（封装了 `expo lint`）
- 重置 starter：`npm run reset-project`（会把 starter 移到 `app-example` 并创建空 `app`）

## 项目约定与模式（对自动修改/补全很重要）
- 文件路由约定：页面文件以 `p-` 前缀命名（如 `p-about_us.tsx`），放在 `app/` 下即可自动成为路由。
- 路由分组：使用括号目录（例如 `(tabs)`）表示路由分组/布局区域，参考 `app/(tabs)/` 下的 `_layout` 和页面。
- 双结构：`app/` 为路由入口并使用 file-based routing，同时 `screens/` 下保留了以页面为单元的实现和样式（`index.tsx` + `styles.ts`）。当修改页面时优先更新 `app/` 下对应路由文件；若页面逻辑复杂，查看/编辑 `screens/*` 中的实现。
- 组件位置：页面内部复用组件通常放在对应 `screens/<page>/components/` 目录。
- 类型与 lint：项目启用了 TypeScript 与 ESLint（参见 `tsconfig.json` 与 `eslint.config.mjs`），代码补全/重构时请保留类型签名并运行 lint 验证。

## 集成点与依赖（重要）
- Expo 平台依赖（`expo`, `expo-*` 插件），许多原生功能由 expo 包提供（camera, image-picker, splash, 等）。
- 路由：`expo-router`（file-based routing）
- 导航/UI：`@react-navigation/*`, `react-native-elements`, `@expo/vector-icons`
- 本地存储：`@react-native-async-storage/async-storage`
- 原生模块注意事项：添加/升级原生依赖（非纯 JS）可能需要重新构建开发客户端或使用 Expo dev build；在修改这些依赖前先确认 CI/本地是否能做 dev build。

## 示例：添加新页面 / 修改路由
1. 新页面（简单、路由立即生效）: 在 `app/` 下添加 `p-my_new_page.tsx`。
2. 复杂页面：在 `screens/p-my_new_page/index.tsx` 创建实现，样式放 `screens/p-my_new_page/styles.ts`，并在 `app/p-my_new_page.tsx` 中导入/包装（如果需要布局差异）。
3. 如果页面属于 tab 分组，放到 `app/(tabs)/p-...` 或在 `(tabs)` 文件夹中创建对应页面。

## 测试 / 验证小提示
- 单元/组件测试：使用 `jest`（配置在 package.json，preset 为 `jest-expo`）。建议新增测试时把 `react-test-renderer` 用于快照/渲染。
- 运行 lint 与测试作为 PR 前检查：`npm run lint`，`npm run test`

## 为什么这样组织（“为什么”）
- 使用 `expo-router` 的 file-based routing 让路由与文件结构一一对应，便于快速新增页面与本地预览；同时 `screens/` 目录保留原有页面结构，便于 UI 生成或从设计稿还原样式。

## 注意事项 / 禁区
- 避免直接改动 `app-example`（如果存在），那是 starter 备份。
- 修改原生或底层配置（`metro.config.js`、peer native deps）前请说明需要的本地/CI构建步骤。

如果你需要，我可以把本文件调整为包含更精确的：Node / npm 版本、CI 流程（如果有）、或者把常改位置列成 TODO Checklist（例如常改样式、常改图标位置）。请告诉我你还想补充的细节。 

## 来自 PRD 的关键补充（简明）
- 产品核心：AI 驱动的故事可视化（文本分析 -> 插图定位 -> AI 生成 -> 用户选择 -> 嵌入）。
- 关键页面（仓库中对应路由/文件名）：
	- `P-WORKS_LIST` -> `p-works_list.tsx`（作品列表）
	- `P-NEW_WORK` -> `p-new_work.tsx`（文本输入/新建）
	- `P-WORK_EDIT` -> `p-work_edit.tsx`（编辑/重新生成插图）
	- `P-ILLUSTRATION_SELECT` -> `p-illustration_select.tsx`（候选插图选择）
	- `P-READING_VIEW` -> `p-reading_view.tsx`（图文混排阅读）

## 核心数据模型（PRD 可发现的最小类型）
- Work: { work_id, user_id, title, author, original_text, processed_text, status, created_at }
- Illustration: { illustration_id, work_id, position_in_text, image_url, prompt_used, is_selected, style_tag }
- IllustrationLocation: { location_id, work_id, start_index, end_index, type, status }

## 首轮可执行重构建议（对 AI 代理的具体任务）
1. 抽出共享组件：把 `WorkCard`、`FilterDropdown` 等从页面子目录提升到 `app/components/` 或 `screens/_shared/components/`，保持现有导出接口，修改引用路径。
2. 添加类型文件：在 `app/` 根或 `types/` 中新增 `types.ts`，定义上面列出的最小类型并在页面/组件中引用。
3. 增加 mock 服务：创建 `app/services/mockWorks.ts`，包含 1-2 个基于 PRD 的示例作品，用于本地页面开发与快照测试。
4. 小步改动并验证：每次移动/重命名后运行 `npm run lint` 与 `npm run test`，修复导入或类型错误，保持可运行状态。
5. 不触及原生依赖：避免在短期内更改 `expo` 原生插件或版本；任何原生改动应在 PRD 审核后单独处理。

## 开发假设（如果需不同，请指出）
- 假设 A：将共享组件放置在 `app/components/`（或 `screens/_shared/`）是可接受的团队约定。
- 假设 B：初期只做前端结构与 mock 数据支持，不对接真实 AI/后端服务。
- 假设 C：重构按小步骤（可回滚）进行，避免一次性大规模重命名或删除文件。

## 快速运行/验证（Windows PowerShell）
```powershell
npm install
npm run start    # 或 npx expo start
npm run lint
npm run test
```

如果你确认这些补充内容无误，我会把首轮改动拆成小 PR（先做 types + mock + 一个组件迁移），实施后再运行 lint/tests 并提交变更。请回复“开始第一轮”或提出需要调整的点。
