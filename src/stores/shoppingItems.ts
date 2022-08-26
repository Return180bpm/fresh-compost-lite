import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'

interface Item {
  id: number
  name: string
  isChecked: boolean
}
const INIT_ITEMS = [
  {
    id: 0,
    name: 'tomatos',
    isChecked: true,
  },
  {
    id: 1,
    name: 'tomatoes',
    isChecked: false,
  },
  {
    id: 2,
    name: 'ketchup',
    isChecked: true,
  },
]
const INIT_LAST_ID = 2

export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items: Ref<Item[]> = useLocalStorage('offthedome-items', INIT_ITEMS)
  const lastId: Ref<number> = useLocalStorage('offthedome-lastId', INIT_LAST_ID)

  const indexOfItem = (id: number) => items.value.findIndex((item: Item) => item.id === id)
  const checkedItemsIds = computed(() => items.value.filter(item => item.isChecked === true).map(item => String(item.id)))

  function addItem(name: string) {
    items.value.unshift({
      id: ++lastId.value,
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
