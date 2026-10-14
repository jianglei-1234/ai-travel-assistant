import express from 'express';
import travelService from '../services/travelService.js';
import { createStreamResponse } from '../utils/streamUtils.js';

const router = express.Router();

router.post('/recommend', async (req, res) => {
  try {
    const { city, budget, days } = req.body;

    if (!city || !budget || !days) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：city, budget, days'
      });
    }

    try {
      const result = await travelService.recommend(city, budget, days);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } catch (error) {
    console.error('推荐接口错误:', error);
    res.status(500).json({
      success: false,
      error: `服务器错误: ${error.message}`
    });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: '请提供消息内容'
      });
    }

    const stream = createStreamResponse(res);
    
    try {
      const result = await travelService.chat(message, (chunk) => {
        stream.send({ type: 'chunk', content: chunk });
      });
      
      stream.send({ type: 'complete', data: result });
      stream.end();
    } catch (error) {
      stream.error(error.message);
    }
  } catch (error) {
    console.error('对话接口错误:', error);
    res.status(500).json({
      success: false,
      error: `服务器错误: ${error.message}`
    });
  }
});

export default router;
