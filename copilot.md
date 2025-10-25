## 快速目标
此文件为仓库内 AI 编码代理的快速上手指南（精简版），覆盖项目结构、关键文件、运行命令、PRD 关键点与首轮可执行任务。

## 项目要点（一句话）
移动端跨平台 Expo + TypeScript 项目，使用 `expo-router` 的 file-based routing；现在 `app/` 已被移动到仓库根（`./app`），UI 参考放在 `UIexample/`。

## 关键位置（打开文件即看）
- 路由与入口：`app/_layout.tsx`，`app/*.tsx`（以 `p-` 前缀命名为页面路由）
- 页面实现：`screens/*/index.tsx` 与 `screens/*/styles.ts`
- 重要组件示例：`screens/p-works_list/components/WorkCard`、`FilterDropdown`
- 依赖与脚本：`app/package.json`（在仓库根的 `app` 目录下运行 npm）

## 立刻可运行的 PowerShell 命令（在仓库根的 `app` 目录）
```powershell
cd 'e:\A\大二上\HKS\app'
nvm use 18.16.0   # 如果使用 nvm
npm install
npm run lint
npm run test
npm run start
```

## PRD 摘要（对自动实现很重要）
- 产品流：文本输入 -> 故事结构分析 -> 插图定位 -> AI 生成多候选 -> 用户选择 -> 嵌入并保存。
- 关键页面映射：`p-works_list`、`p-new_work`、`p-work_edit`、`p-illustration_select`、`p-reading_view`。
- 最小数据模型：Work, Illustration, IllustrationLocation（见 `.github/copilot-instructions.md` 中简表）。

## 首轮可执行任务（优先级 & 说明）
1) types + mock + 抽组件（推荐，回报最高）
   - 新增 `app/types.ts`（Work, Illustration, Location）
   - 新增 `app/services/mockWorks.ts`（1-2 个示例作品）
   - 将 `WorkCard`（或其他 UI 小组件）抽出到 `app/components/` 并修改 `p-works_list` 引用
2) 最小方案：仅新增 `types.ts`（最小改动）

实施注意
- 每次移动/重命名后运行 `npm run lint` 和 `npm run test` 并修复错误（最多三次快速迭代）。
- 不要立即更改 Expo 原生依赖（如需改动，先在 PR 中说明并安排 dev build）。

## 要求与输入输出（短合同）
- 输入：确认要做的方案（A/B/C）、提供 `npm install` / `lint` / `test` 的输出（若报错）。
- 输出：新增文件清单（types/mock/components）、通过 lint/test（或列出剩余问题）的变更 PR。

## 下一步（请用户执行）
1. 在本机运行上方的 PowerShell 引导命令并把 `npm install`、`npm run lint`、`npm run test` 的输出粘回。
2. 选择首轮方案：回复 A（推荐）/B/C，以及是否写入 `.nvmrc`（建议 `18.16.0`）。

—— 结束
