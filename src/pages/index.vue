<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useShoppingItemsStore } from '~/stores/shoppingItems'
const shoppingItemsStore = useShoppingItemsStore()
const { items } = storeToRefs(shoppingItemsStore)
const newItem = ref('')
// const checked = ref([]o)
function addItem() {
  if (!newItem.value)
    return

  shoppingItemsStore.addItem(newItem.value)
  newItem.value = ''
}
// const router = useRouter()
// const go = () => {
//   if (name)
//     router.push(`/hi/${encodeURIComponent(name)}`)
// }
</script>

<template>
  <input v-model="newItem" placeholder="I need to get..." class="px-6 py-10 text-3xl bg-light-300 rounded-3xl">
  <button
    type="button"
    @click="addItem"
  >
    Add
  </button>

  <ul>
    <li v-for="item in items" :key="item.id">
      <input id="item.id" type="checkbox" :value="item.isChecked" :checked="item.isChecked" class="w-6 h-6" @click="shoppingItemsStore.updateItem(item.id)">
      {{ item.text }} {{ item.id }} {{ item.isChecked }}
      <button
        type="button"
        class="px-6 py-4  bg-light-50"
        @click="shoppingItemsStore.removeItem(item.id)"
      >
        Remove
      </button>
      <!-- <TodoItem :id="{item.id}" text="item.text" /> -->
    </li>
  </ul>
</template>
