# 智能旅游助手（Smart Travel Guide）

基于 AI 大模型的**全栈**旅游规划应用：输入城市 / 预算 / 天数，AI 自动生成结构化行程规划；支持流式 AI 对话问答。

## 技术栈

| 端 | 技术 |
| --- | --- |
| 前端 | Vue 3 + Vite 5 + Vant 4 + Pinia + Vue Router 4 |
| 后端 | Node.js + Express + LangChain.js（`@langchain/openai`） |
| AI 能力 | 任意 OpenAI 兼容接口（示例：七牛云，也可换硅基流动 / DeepSeek） |

## 功能

- **智能行程规划**：选择城市 + 预算 + 天数，AI 生成按天分时段（上午/下午/晚上）的行程、景点详情、预算明细、温馨提示
- **AI 流式对话**：SSE 流式输出，逐字返回；支持快捷问题一键提问
- **聊天记录持久化**：localStorage 本地存储，刷新不丢失
- **移动端适配**：Vant 组件库，750px 容器，适配手机浏览器

## 目录结构

```
project_1/
├── server/
│   └── server/               # 后端（Express + LangChain）
│       ├── src/
│       │   ├── index.js      # 入口
│       │   ├── routes/       # 路由（recommend / chat）
│       │   ├── services/     # LangChain 大模型服务
│       │   └── utils/        # SSE 流式工具
│       ├── .env.example      # 环境变量模板（复制为 .env 后填写）
│       └── package.json
└── travel-h5/                # 前端（Vue 3）
    ├── src/
    │   ├── views/            # 页面（首页/详情/对话/我的）
    │   ├── components/       # 组件（聊天气泡/景点/预算表）
    │   ├── stores/           # Pinia 状态管理
    │   ├── router/           # 路由
    │   └── utils/            # 请求封装（含 SSE 流式）
    └── package.json
```

## 快速开始

### 1. 启动后端

```bash
cd server/server
npm install
cp .env.example .env    # 然后编辑 .env，填入你的 API Key
npm run dev
```

### 2. 启动前端

```bash
cd travel-h5
npm install
npm run dev
```

浏览器访问 **http://localhost:5173**

> 注意：前后端需**同时启动**。前端通过 vite 代理（`/api` → `http://127.0.0.1:3000`）访问后端。

## 配置说明

后端通过 `.env` 配置，支持**任何 OpenAI 兼容协议**的大模型服务：

```env
SILICONFLOW_API_KEY=你的key
SILICONFLOW_BASE_URL=https://api.qnaigc.com/v1   # 服务地址（含 /v1）
SILICONFLOW_MODEL=模型ID
```

> ⚠️ `.env` 已被 `.gitignore` 忽略，**绝不会上传**；请勿把真实 Key 提交到 Git。

## API 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 健康检查 |
| POST | `/api/travel/recommend` | 智能行程规划（`{city, budget, days}`） |
| POST | `/api/travel/chat` | AI 流式对话（SSE） |
