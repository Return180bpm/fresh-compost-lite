import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'
import { useFetchUnsplashSearch } from '~/composables/fetch'

interface Item {
  id: number
  text: string
  isChecked: boolean
  pictureURL: string
}
export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items: Ref<Item[]> = useLocalStorage('shopping-items', [
    {
      id: 0,
      text: 'tomatos',
      isChecked: false,
      pictureURL: '',
    },
    {
      id: 1,
      text: 'tomatoes',
      isChecked: false,
      pictureURL: '',
    },
    {
      id: 2,
      text: 'ketchup',
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

  interface UnsplashSingleResult {
    alt_description: string
    blur_hash: string
    categories: any[]
    color: string
    created_at: string
    current_user_collections: any[]
    description: any
    height: number
    id: string
    liked_by_user: boolean
    likes: number
    links: any
    promoted_at: string
    sponsorship: any
    tags: any[]
    topic_submissions: any
    updated_at: string
    urls: {
      thumb: string
    }
    user: object
    width: number
  }
  interface UnsplashResponse {
    results: UnsplashSingleResult[]
    total: number
    total_pages: number
  }

  const isFetchingImage = ref(false)
  async function addItem(text: string) {
    const { data, isFetching, execute }: { data: Ref<UnsplashResponse | null>; isFetching: Ref<boolean>; execute: () => Promise<any> } = useFetchUnsplashSearch(`photos?per_page=1&orientation=squarish&content_filter=high&query=${text}`, {
      immediate: false,
    },
    ).json()

    // Is there a simpler way to return isFetching from the store? Currying this function? (but then how do you pass in `text`?)
    syncRef(isFetching, isFetchingImage)
    await execute()

    // Can I do this whole thing with computed?
    let myUrl: string
    if (data.value !== null) {
      if (data.value.results.length === 0) {
        const { data, isFetching, execute }: { data: Ref<any | null>; isFetching: Ref<boolean>; execute: () => Promise<any> } = useFetchUnsplashRandom('random?per_page=1&orientation=squarish').json()
        syncRef(isFetching, isFetchingImage)
        await execute()

        myUrl = data!.value!.urls!.thumb
      }
      else {
        // not sure if requesting smaller width makes a difference in perf
        //
        // function spliceSlice(str: string, index: number, count: number, add: string) {
        //   // We cannot pass negative indexes directly to the 2nd slicing operation.
        //   if (index < 0) {
        //     index = str.length + index
        //     if (index < 0)
        //       index = 0
        //   }

        //   return str.slice(0, index) + (add || '') + str.slice(index + count)
        // }
        // myUrl = `${spliceSlice(data!.value!.results[0].urls.thumb, -3, 999, '60')}`
        myUrl = data!.value!.results[0].urls.thumb
      }
    }
    else {
      myUrl = ''
    }
    items.value.unshift({
      id: nextId(),
      text,
      isChecked: false,
      pictureURL: myUrl,
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

  return { items, checkedItemsIds, addItem, removeItem, updateItem, isFetchingImage }
})
