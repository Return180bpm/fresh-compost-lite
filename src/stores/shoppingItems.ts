import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'
import type { Item } from '~/types'

// const INIT_ITEMS = [
//   {
//     id: 0,
//     name: 'tomatos',
//     isChecked: true,
//   },
//   {
//     id: 1,
//     name: 'tomatoes',
//     isChecked: false,
//   },
//   {
//     id: 2,
//     name: 'ketchup',
//     isChecked: true,
//   },
// ]
// const INIT_LAST_ID = 2

export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  // const itemsWithDefaults: Ref<Item[]> = useLocalStorage('offthedome-items', INIT_ITEMS)
  // const lastIdWithDefaults: Ref<number> = useLocalStorage('offthedome-lastId', INIT_LAST_ID)

  const checkedItems: Ref<Item[]> = useLocalStorage('offthedome-checkedItems', [])
  const uncheckedItems: Ref<Item[]> = useLocalStorage('offthedome-uncheckedItems', [])
  const lastId: Ref<number> = useLocalStorage('offthedome-lastId', 0)

  function addItem(name: string) {
    uncheckedItems.value.unshift({
      id: ++lastId.value,
      name,
      isChecked: false,
    })
  }
  // function removeItem(id: number) {
  // const i = indexOfItem(id)
  // if (i > -1)
  //   items.value.splice(i, 1)
  // }

  function checkItem(id: number) {
    const indexOfItem = uncheckedItems.value.findIndex((item: Item) => item.id === id)
    const _item = uncheckedItems.value[indexOfItem]

    if (indexOfItem > -1) {
      uncheckedItems.value[indexOfItem].isChecked = true
      uncheckedItems.value.splice(indexOfItem, 1)
      checkedItems.value.unshift(_item)
    }
  }
  function uncheckItem(id: number) {
    const indexOfItem = checkedItems.value.findIndex((item: Item) => item.id === id)
    const _item = checkedItems.value[indexOfItem]

    if (indexOfItem > -1) {
      checkedItems.value[indexOfItem].isChecked = false
      checkedItems.value.splice(indexOfItem, 1)
      uncheckedItems.value.unshift(_item)
    }
  }

  return { uncheckedItems, checkedItems, addItem, checkItem, uncheckItem }
})
