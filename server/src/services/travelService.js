import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

class TravelService {
  constructor() {
    this.llm = null;
    this.initLLM();
  }

  initLLM() {
    const provider = process.env.MODEL_PROVIDER || 'siliconflow';

    let apiKey, baseURL, model;

    if (provider === 'deepseek') {
      apiKey = process.env.DEEPSEEK_API_KEY;
      baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
      model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    } else {
      apiKey = process.env.SILICONFLOW_API_KEY;
      baseURL = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
      model = process.env.SILICONFLOW_MODEL || 'Pro/zai-org/GLM-4.7';
    }
    this.llm = new ChatOpenAI({
      apiKey,
      model,
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL
      }
    })
  }

  getTravelPrompt(city, budget, days) {
    return [
      new SystemMessage(`你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。

请根据以下信息为用户生成一份详细的旅游规划：
- 目的地城市：${city}
- 预算：${budget}元
- 旅行天数：${days}天

要求：
1. 每天的行程安排（上午、下午、晚上）
2. 每个景点的详细介绍
3. 交通建议
4. 预算分配明细
5. 注意事项

请以JSON格式输出，结构如下：
{
  "success": true,
  "city": "城市名",
  "days": 天数,
  "totalBudget": 总预算,
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "afternoon": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "evening": {
        "spot": "活动名称",
        "duration": "活动时长",
        "ticket": "费用",
        "transportation": "交通方式",
        "description": "活动介绍"
      }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 住宿费用,
    "food": 餐饮费用,
    "transportation": 交通费用,
    "tickets": 门票费用,
    "other": 其他费用
  },
  "tips": ["提示1", "提示2", "提示3"],
  "warnings": ["注意事项1", "注意事项2"]
}

请确保JSON格式正确，可以被解析。`),
      new HumanMessage(`请为我生成一份${days}天的${city}旅游规划，预算${budget}元。`)
    ];
  }

  async recommend(city, budget, days) {
    if (!city || !budget || !days) {
      throw new Error('请提供完整的旅游信息：城市、预算、天数');
    }

    if (budget < 100 || days < 1 || days > 30) {
      throw new Error('预算不能低于100元，天数必须在1-30天之间');
    }

    try {
      const messages = this.getTravelPrompt(city, budget, days);
      
      // 使用 invoke 方法获取完整响应，而不是 stream
      const response = await this.llm.invoke(messages);
      const fullResponse = response.content || '';

      // 解析JSON
      let jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
                      fullResponse.match(/```\n([\s\S]*?)\n```/) ||
                      fullResponse.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        try {
          const parsed = JSON.parse(jsonStr);
          return parsed;
        } catch (parseError) {
          console.error('JSON解析错误:', parseError);
          return {
            success: false,
            error: '生成的规划格式错误',
            rawResponse: fullResponse
          };
        }
      }

      return {
        success: false,
        error: '无法提取有效的规划内容',
        rawResponse: fullResponse
      };
    } catch (error) {
      console.error('AI推荐服务错误:', error);
      throw error;
    }
  }

  async chat(message, streamCallback) {
    try {
      const messages = [
        new SystemMessage('你是一个友好的旅游助手，请用中文回答用户关于旅游的问题。'),
        new HumanMessage(message)
      ];

      const stream = await this.llm.stream(messages);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        const content = chunk.content || '';
        if (content.trim() === '') {
            continue
          }
        fullResponse += content;
        
        if (streamCallback) {
          streamCallback(content);
        }
      }

      return {
        success: true,
        reply: fullResponse
      };
    } catch (error) {
      console.error('AI对话服务错误:', error);
      throw error;
    }
  }
}

export default new TravelService();