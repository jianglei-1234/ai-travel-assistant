import axios from 'axios'

// 本地开发走 vite 代理（/api）；线上部署时通过环境变量 VITE_API_BASE_URL 指向后端地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)


export function post(url, data) {
  return request.post(url, data)
}

export function get(url, params) {
  return request.get(url, { params })
}

// onChunk 收到数据块时的回调函数
// onComplete 请求完成时的回调函数
// onError 发生错误时的回调函数
export async function fetchStream(url, data, onChunk, onComplete, onError) {
  // 创建请求控制器,支持中断流式连接。
  const controller = new AbortController()

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: controller.signal // 关联取消信号
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 获取响应体的 可读流读取器
    const reader = response.body.getReader()
    // 将二进制数据解码为字符串
    const decoder = new TextDecoder()
    // 缓存不完整的行，防止一个 JSON 被拆到多个网络分片
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // 最后一行可能不完整，留到下次再拼
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        // 处理 SSE 格式：data: {"type": "chunk", ...}
        const jsonStr = trimmed.substring(6) // 去掉 "data: " 前缀
        let json
        try {
          json = JSON.parse(jsonStr)
        } catch (e) {
          console.warn('JSON parse error:', e)
          continue
        }

        if (json.type === 'chunk') {
          onChunk(json.content) // 收到数据块
        } else if (json.done === true) {
          onComplete(json.data) // 请求完成
        } else if (json.error) {
          onError(json.error) // 发生错误
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Stream aborted')
    } else {
      onError(error.message || '请求失败')
    }
    throw error
  }
}


export default request