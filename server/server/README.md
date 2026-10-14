# 智能景点介绍系统

基于Node.js + Express + LangChain的智能景点介绍系统，支持用户输入预算和天数，生成详细的游玩推荐。系统对接硅基流动和DeepSeek大模型，提供流式响应接口。

## 技术栈
- Node.js 18+ (ESM模块)
- Express.js (最新版本)
- LangChain.js (最新版本)
  - @langchain/openai
  - @langchain/core
- 大模型接口：硅基流动、DeepSeek
- 流式响应

## 项目结构
```
server/
├── src/
│   ├── routes/
│   │   └── travel.js          # 旅游推荐API路由
│   ├── services/
│   │   └── travelService.js   # LangChain智能推荐服务
│   ├── utils/
│   │   └── streamUtils.js     # 流式响应工具
│   └── index.js               # 主入口文件
├── .env.example               # 环境变量配置示例
├── .env                       # 环境变量配置（需创建）
├── package.json              # 项目配置文件
└── README.md                 # 项目说明文档
```

## 快速开始

### 1. 安装依赖
```bash
cd server
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env`，并填写API密钥：
```bash
cp .env.example .env
```

### 3. 启动服务
```bash
npm start
```

## API接口

### 健康检查
```
GET /api/health
```

### 智能推荐（流式）
```
POST /api/travel/recommend
Content-Type: application/json

{
  "city": "北京",
  "budget": 3000,
  "days": 2
}
```

### AI对话（流式）
```
POST /api/travel/chat
Content-Type: application/json

{
  "message": "去北京旅游有什么推荐？"
}
```

## 支持的大模型

- **硅基流动** (Qwen2.5-7B-Instruct) - 免费额度
- **DeepSeek** (deepseek-chat)

配置 `MODEL_PROVIDER` 即可切换不同的AI提供商。

## 功能特点

1. **流式响应**：实时返回AI生成内容，提升用户体验
2. **智能推荐**：根据预算和天数生成详细的旅游规划
3. **多模型支持**：可切换不同的大模型提供商
4. **结构化输出**：返回详细的JSON格式旅游规划
5. **错误处理**：完善的错误处理和边界情况处理

## 响应格式

### 智能推荐响应
```json
{
  "success": true,
  "city": "北京",
  "days": 2,
  "totalBudget": 3000,
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "故宫博物院",
        "duration": "3小时",
        "ticket": "60元",
        "transportation": "地铁1号线天安门东站",
        "description": "中国明清两代的皇家宫殿..."
      },
      "afternoon": {
        "spot": "天安门广场",
        "duration": "2小时",
        "ticket": "免费",
        "transportation": "步行",
        "description": "世界上最大的城市广场..."
      },
      "evening": {
        "spot": "王府井步行街",
        "duration": "3小时",
        "ticket": "免费",
        "transportation": "地铁1号线王府井站",
        "description": "北京最著名的商业街..."
      }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 1200,
    "food": 600,
    "transportation": 300,
    "tickets": 400,
    "other": 500
  },
  "tips": ["建议提前预约故宫门票", "带好身份证", "穿着舒适的鞋子"],
  "warnings": ["注意天气变化", "保管好个人财物"]
}
```

### AI对话响应
```json
{
  "success": true,
  "reply": "北京是中国的首都，有许多著名的旅游景点..."
}
```
