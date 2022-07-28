import { defineStore } from 'pinia'

interface Item {
  id: number
  text: string
  isChecked: boolean
  pictureURL: string
}
export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items = ref<Item[]>([
    {
      id: 0,
      text: 'tomatoes',
      isChecked: false,
      pictureURL: 'foo',
    },
    {
      id: 1,
      text: 'onions',
      isChecked: false,
      pictureURL: 'foo',
    },
    {
      id: 2,
      text: 'butter',
      isChecked: false,
      pictureURL: 'foo',
    },
  ])
  const lastId = ref(2)
  function nextId() {
    return ++lastId.value
  }
  function addItem(text: string) {
    items.value.push({
      id: nextId(),
      text,
      isChecked: false,
      pictureURL: 'foo',
    })
  }
  function removeItem(id: number) {
    const i = items.value.findIndex((item: Item) => item.id === id)
    if (i > -1)
      items.value.splice(i, 1)
  }

  return { items, addItem, removeItem }
})
