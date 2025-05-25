import { ref } from 'vue'
import { generateUUID } from '@/utils/format.js'

export const useTopicTOC = () => {
  const headings = ref([])
  const activeId = ref('')
  let observer = null

  const refreshTOC = () => {
    if (observer) {
      observer.disconnect()
    }

    const elements = Array.from(
      document.querySelectorAll(
        '.milkdown div h1 ,.milkdown div h2 ,.milkdown div h3 ,.milkdown div h4 ,.milkdown div h5 ,.milkdown div h6'
      )
    )

    headings.value = elements.map((element) => {
      element.id = generateUUID()
      return {
        id: element.id,
        text: element.textContent || '',
        level: Number(element.tagName.charAt(1))
      }
    })

    observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) activeId.value = visibleEntry.target.id
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    elements.forEach((element) => observer?.observe(element))
  }

  onMounted(() => {
    refreshTOC()
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    headings,
    activeId,
    refreshTOC
  }
}
