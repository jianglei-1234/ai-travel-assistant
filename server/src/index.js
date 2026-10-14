import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import travelRouter from './routes/travel.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 启用跨域资源共享(CORS)中间件
// 允许来自不同域名的客户端访问API，支持前后端分离架构
app.use(cors());

// 启用JSON解析中间件
// 自动解析请求体中的JSON数据，使得req.body可以直接访问JSON格式的数据
app.use(express.json());

// 启用URL编码解析中间件
// 解析请求体中的URL编码数据（如表单提交）
// extended: true 允许解析复杂的嵌套对象
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '智能景点介绍系统运行中',
    timestamp: new Date().toISOString(),
    modelProvider: process.env.MODEL_PROVIDER || 'siliconflow',
    version: '1.0.0'
  });
});

app.use('/api/travel', travelRouter);

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    error: `服务器内部错误: ${err.message}`
  });
});

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║        智能景点介绍系统 - Smart Travel Guide            ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  服务地址: http://localhost:${PORT}                          ║`);
  console.log(`║  模型提供商: ${(process.env.MODEL_PROVIDER || 'siliconflow').padEnd(14)}                        ║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  API接口:                                                 ║`);
  console.log(`║  - GET  /api/health     - 健康检查                        ║`);
  console.log(`║  - POST /api/travel/recommend - 智能推荐                  ║`);
  console.log(`║  - POST /api/travel/chat - AI对话（流式）                ║`);
  console.log(`╚══════════════════════════════════════════════════════════╝`);
  console.log(`  `);
  console.log(`  提示: 请在.env文件中配置API密钥后使用`);
  console.log(`  `);
});
