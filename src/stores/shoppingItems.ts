import { defineStore } from 'pinia'

export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items = ref([
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

  return { items }
})
