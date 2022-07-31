<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useShoppingItemsStore } from '~/stores/shoppingItems'

const shoppingItemsStore = useShoppingItemsStore()
const { items, checkedItemsIds, isFetchingImage } = storeToRefs(shoppingItemsStore)
const newItem = ref('')
function addItem() {
  if (!newItem.value)
    return

  shoppingItemsStore.addItem(newItem.value)
  newItem.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-16 max-w-screen-sm">
    <div class="flex justify-center gap-2 h-36 p-0">
      <input v-model="newItem" placeholder="I need to get..." class="h-full px-6 text-3xl bg-light-300 rounded-2xl" @keyup.enter="addItem">
      <button
        type="button"
        class="h-full w-32 text-2xl text-gray-500 bg-lime-200 rounded-2xl"
        @click="addItem"
      >
        Add
      </button>
    </div>
    <ul class="flex flex-col gap-4">
      <li v-if="isFetchingImage" class="h-24 w-full bg-white" />
      <li v-for="item in items" :key="item.id" class="h-24 flex items-center p-4 gap-6 text-3xl">
        <img v-if="item.pictureURL" :src="item.pictureURL" :alt="`A random picture of a ${item.text}`" class="w-12 h-12">
        <div v-else class="w-12 h12 opacity-0" />
        <input v-model="checkedItemsIds" :value="item.id" type="checkbox" class="w-12 h-12 rounded-2xl" @click="shoppingItemsStore.updateItem(item.id)">
        <span class="text-gray-500">
          {{ item.text }}
        </span>
        <button
          type="button"
          class="ml-auto px-6 py-4 rounded-2xl bg-light-200"
          @click="shoppingItemsStore.removeItem(item.id)"
        >
          x
        </button>
        <!-- <TodoItem :id="{item.id}" text="item.text" /> -->
      </li>
    </ul>
  </div>
</template>
