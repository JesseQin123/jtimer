# JTimer - 运动计时器

一个专为平板支撑训练设计的 PWA 计时器应用。

## 灵感来源

这个项目的灵感来自这个 [YouTube 视频](https://www.youtube.com/watch?v=Ea0fUDES1Hc)。

在做平板支撑时，我采用了一个"分段意念法"：

- **前半段（意念阶段）**：纯粹靠意志力坚持，专注于呼吸和核心肌群
- **后半段（分散注意力阶段）**：通过看视频、玩游戏等方式分散注意力，让时间过得更快

这种方法让原本难以坚持的平板支撑变得更容易完成。

## 功能特点

- **累计时间追踪**：显示历史以来所有的平板支撑总时间
- **HIIT 训练模式**：支持间歇训练，可自定义工作/休息时间和轮数
- **训练统计**：查看每周训练量、消耗卡路里、连续训练天数
- **历史记录**：浏览所有训练记录，按日期分组
- **PWA 支持**：可安装到手机主屏幕，离线使用

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase（身份验证 + 数据库）
- Workbox（PWA 支持）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 环境变量

在 `.env` 文件中配置：

```
VITE_SUPABASE_URL=你的Supabase URL
VITE_SUPABASE_ANON_KEY=你的Supabase Anon Key
```

## 许可证

MIT
