// 流式响应工具

export const createStreamResponse = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  return {
    send: (data) => {
      try {
        res.write(`data: ${JSON.stringify(data)}

`);
      } catch (error) {
        console.error('流式发送错误:', error);
      }
    },
    end: () => {
      try {
        res.write('event: end\ndata: {"done": true}\n\n');
        res.end();
      } catch (error) {
        console.error('流式结束错误:', error);
      }
    },
    error: (message) => {
      try {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.end();
      } catch (error) {
        console.error('流式错误发送错误:', error);
      }
    }
  };
};

// 分块处理JSON数据，用于流式输出
export const chunkJSON = (data, chunkSize = 1024) => {
  const jsonStr = JSON.stringify(data);
  const chunks = [];

  for (let i = 0; i < jsonStr.length; i += chunkSize) {
    chunks.push(jsonStr.substring(i, i + chunkSize));
  }

  return chunks;
};
