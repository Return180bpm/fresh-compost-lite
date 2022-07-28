<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useShoppingItemsStore } from '~/stores/shoppingItems'
const shoppingItemsStore = useShoppingItemsStore()
const { items } = storeToRefs(shoppingItemsStore)

// const router = useRouter()
// const go = () => {
//   if (name)
//     router.push(`/hi/${encodeURIComponent(name)}`)
// }
</script>

<template>
  <!-- <input v-model="item" placeholder="I need to get..." class="px-6 py-10 text-3xl bg-light-300 rounded-3xl"> -->

  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.text }} {{ item.id }} {{ item.isChecked }}
      <!-- <TodoItem :id="{item.id}" text="item.text" /> -->
    </li>
  </ul>
</template>
