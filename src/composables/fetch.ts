import { createFetch } from '@vueuse/core'

const MY_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_PUBLIC_KEY

export const useFetchUnsplashSearch = createFetch({
  baseUrl: 'https://api.unsplash.com/search',
  options: {
    beforeFetch({ options }) {
      options.headers = { Authorization: `Client-ID ${MY_ACCESS_KEY}` }
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
export const useFetchUnsplashRandom = createFetch({
  baseUrl: 'https://api.unsplash.com/photos',
  options: {
    beforeFetch({ options }) {
      options.headers = { Authorization: `Client-ID ${MY_ACCESS_KEY}` }
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
