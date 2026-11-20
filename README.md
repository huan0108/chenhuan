# 完整动态作品集网站模板

中文零基础用户请优先打开：[使用说明-请先看.md](使用说明-请先看.md)

这是一套可直接替换内容并上线的完整作品集网站源码，不是单页截图或静态 HTML。项目包含响应式页面、作品分类与详情、图片/视频展示、动态效果，以及本地开发和生产构建配置。

如果你完全不会编程，请先阅读：

- [零基础安装与上线](docs/零基础安装与上线.md)
- [AI 提示词包](docs/AI提示词包.md)
- [常见问题](docs/常见问题.md)
- [授权模板](LICENSE-TEMPLATE.md)

## 系统要求

- Windows 10/11，或较新的 macOS
- Node.js 22 LTS（推荐；最低使用 Node.js 20.19）
- npm（安装 Node.js 时会一起安装）
- Cursor、VS Code，或其他可打开文件夹的代码编辑器
- 约 2 GB 可用磁盘空间；素材较多时需要更多空间

## 5 分钟快速开始

推荐做法：用 Codex/Cursor Agent 打开本项目，把 [AI 提示词包](docs/AI提示词包.md) 中的“让 Codex 接管首次安装”整段发给它。AI 会代你检查环境、安装依赖并启动网站。

Windows 用户也可以直接双击 `open-dev.cmd`，首次运行会自动安装依赖并打开网站。

也可以在项目文件夹中打开终端，依次运行：

```bash
npm install
npm run dev
```

终端出现 `Local:` 地址（通常是 `http://localhost:5173/`）后，在浏览器打开该地址。停止运行时，在终端按 `Ctrl + C`。

## 普通用户只改这些地方

1. `src/content/siteConfig.ts`：姓名、品牌、简介、联系方式、社交链接等全站信息。
2. `src/content/homeConfig.ts`：首页文字、轮播和首页展示内容。
3. `src/content/showcases.ts`：作品分类、作品封面和详情媒体。
4. `public/assets/`：图片、视频、Logo 等素材。建议保留原目录结构和文件名；如果改名，要同步修改配置里的素材路径。

不要随意修改 `src/components/`、动画组件、路由或构建配置。需要 AI 帮忙时，先复制 [AI 提示词包](docs/AI提示词包.md) 中的限制说明。

## 常用命令

```bash
npm run dev              # 启动本地预览
npm run template:check   # 检查配置、素材引用和交付完整性
npm run build            # 生成可上线文件到 dist/
npm run preview          # 在本机预览构建结果
```

`npm run template:prepare` 是卖家制作干净交付包时使用的整理命令，普通买家不要运行，除非交付说明明确要求。

上线前请确保 `npm run template:check` 和 `npm run build` 都成功完成。最省事的上线方式是将项目推送到 GitHub，再导入 Vercel；完整动作见安装与上线教程。

## 使用提醒

- 首次运行必须执行 `npm install`，以后通常不用重复执行。
- 不要删除 `package.json`、`package-lock.json`、`src/` 或 `public/`。
- 图片适合使用 WebP/JPG/PNG，视频优先使用 MP4；素材越小，网页打开越快。
- 源码授权范围以卖家实际附带并签署/确认的许可文本为准。
