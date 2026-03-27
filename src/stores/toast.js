import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 0

  /**
   * 显示提示消息
   * @param {string} message - 消息内容
   * @param {'success'|'error'|'warning'|'info'} type - 消息类型
   * @param {number} duration - 显示时长(ms)
   */
  function show(message, type = 'info', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type, visible: true })

    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  /**
   * 关闭指定提示
   */
  function dismiss(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].visible = false
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }
  }

  return {
    toasts,
    show,
    dismiss
  }
})
