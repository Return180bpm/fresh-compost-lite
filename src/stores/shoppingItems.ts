import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'

interface Item {
  id: number
  name: string
  isChecked: boolean
}
export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items: Ref<Item[]> = useLocalStorage('shopping-items', [
    {
      id: 0,
      name: 'tomatos',
      isChecked: false,
      pictureURL: '',
    },
    {
      id: 1,
      name: 'tomatoes',
      isChecked: false,
      pictureURL: '',
    },
    {
      id: 2,
      name: 'ketchup',
      isChecked: false,
      pictureURL: '',
    },
  ])
  const lastId = ref(Math.max(...items.value.map(item => item.id)))
  function nextId() {
    return ++lastId.value
  }
  const indexOfItem = (id: number) => items.value.findIndex((item: Item) => item.id === id)
  const checkedItemsIds = computed(() => items.value.filter(item => item.isChecked === true).map(item => String(item.id)))

  function addItem(name: string) {
    items.value.unshift({
      id: nextId(),
      name,
      isChecked: false,
    })
  }
  function removeItem(id: number) {
    const i = indexOfItem(id)
    if (i > -1)
      items.value.splice(i, 1)
  }
  function updateItem(id: number) {
    const i = indexOfItem(id)
    if (i > -1)
      items.value[i].isChecked = !items.value[i].isChecked
  }

  return { items, checkedItemsIds, addItem, removeItem, updateItem }
})
