# 前端 travel-h5

智能旅游助手前端部分，Vue 3 + Vite + Vant 4。

完整项目说明（含启动方式、API 文档）请查看**仓库根目录的 README.md**。

## 开发

```bash
npm install
npm run dev
```

## 技术要点

- Vant 4 移动端组件库，Pinia 状态管理，Vue Router 4
- 基于 `fetch` + `ReadableStream` 手写 SSE 流式解析（带跨分片缓冲）
- 聊天记录 localStorage 持久化
