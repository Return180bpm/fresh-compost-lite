import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'
import { useFetchUnsplashSearch } from '~/composables/fetch'

interface Item {
  id: number
  text: string
  isChecked: boolean
  pictureURL: string | null
}
export const useShoppingItemsStore = defineStore('shoppingItems', () => {
  const items: Ref<Item[]> = useLocalStorage('shopping-items', [
    {
      id: 0,
      text: 'tomatos',
      isChecked: false,
      pictureURL: 'https://images.unsplash.com/photo-1617130094141-532436117aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNTA3MjR8MHwxfHNlYXJjaHwxfHxwb3RhdG98ZW58MHwyfHx8MTY1OTEwODU4NQ&ixlib=rb-1.2.1&q=80&w=200',
    },
    {
      id: 1,
      text: 'tomatoes',
      isChecked: false,
      pictureURL: null,
    },
    {
      id: 2,
      text: 'ketchup',
      isChecked: false,
      pictureURL: null,
    },
  ])
  const lastId = ref(Math.max(...items.value.map(item => item.id)))
  function nextId() {
    return ++lastId.value
  }
  const indexOfItem = (id: number) => items.value.findIndex((item: Item) => item.id === id)
  const checkedItemsIds = computed(() => items.value.filter(item => item.isChecked === true).map(item => String(item.id)))
  const unsplashResponse: Ref<string | null> = ref(null)

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
    urls: object
    user: object
    width: number
  }
  interface UnsplashResponse {
    results: []
    total: number
    total_pages: number
  }

  function addItem(text: string) {
    const { data }: { data: Ref<UnsplashResponse | null> } = useFetchUnsplashSearch(`photos?per_page=1&orientation=squarish&query=${text}`, {
      async afterFetch(ctx) {
        let myUrl
        if (ctx.data.results.length === 0) {
          // This doesn't work and I hate debugging this
          // const { data }: { data: any } = useFetchUnsplashRandom('random?per_page=1&orientation=squarish').json()
          // myUrl = data.value.urls.thumb
          myUrl = undefined
        }
        else { myUrl = ctx.data.results[0].urls.thumb }

        // should this be in afterFetch?
        // Ideally, I would like the item to be visibly added to the list right away and the image appearing whenever
        items.value.unshift({
          id: nextId(),
          text,
          isChecked: false,
          pictureURL: myUrl,
        })
        return ctx
      },
    }).json()

    // First attempt. I don't know anything anymore
    // const dataParsed = computed(() => {
    //   try {
    //     return JSON.parse(data.value as string)
    //   }
    //   catch (e) {
    //     return null
    //   }
    // })
    // const getPictureURL = () => {
    //   if (dataParsed === null)
    //     return undefined
    //   else return dataParsed.results[0].urls.thumb
    // }
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
