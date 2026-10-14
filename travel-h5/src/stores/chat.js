import { defineStore } from 'pinia'

const STORAGE_KEY = 'chat-messages'

export const useChatStore = defineStore('chat', {
  state: () => {
    let saved = []
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch (e) {
      saved = []
    }
    return {
      messages: saved,
      isLoading: false,
      streaming: false,
      currentMessage: ''
    }
  },

  actions: {
    addMessage(message) {
      this.messages.push(message)
      this.saveMessages()
    },

    clearMessages() {
      this.messages = []
      localStorage.removeItem(STORAGE_KEY)
    },

    saveMessages() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages))
    },

    setLoading(loading) {
      this.isLoading = loading
    },

    setStreaming(streaming) {
      this.streaming = streaming
    },

    setCurrentMessage(message) {
      this.currentMessage = message
    }
  }
})
