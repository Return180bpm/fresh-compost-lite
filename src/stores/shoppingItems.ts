import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface Item {
  id: number
  text: string
  isChecked: boolean
  pictureURL: string
}
export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items = useLocalStorage('shopping-items', [
    {
      id: 0,
      text: 'tomatos',
      isChecked: false,
      pictureURL: 'foo',
    },
    {
      id: 1,
      text: 'tomatoes',
      isChecked: false,
      pictureURL: 'foo',
    },
    {
      id: 2,
      text: 'ketchup',
      isChecked: false,
      pictureURL: 'foo',
    },
  ])
  const lastId = ref(Math.max(...items.value.map(item => item.id)))

  function nextId() {
    return ++lastId.value
  }
  const indexOfItem = (id: number) => items.value.findIndex((item: Item) => item.id === id)
  const checkedItemsIds = computed(() => items.value.filter(item => item.isChecked === true).map(item => String(item.id)))

  function addItem(text: string) {
    items.value.unshift({
      id: nextId(),
      text,
      isChecked: false,
      pictureURL: 'foo',
    })
  }
  function removeItem(id: number) {
    const i = indexOfItem(id)
    if (i > -1)
      items.value.splice(i, 1)
  }
  function updateItem(id: number) {
    // console.log(`id is ${id}`)

    const i = indexOfItem(id)
    if (i > -1)
      items.value[i].isChecked = !items.value[i].isChecked
  }

  return { items, checkedItemsIds, addItem, removeItem, updateItem }
})
