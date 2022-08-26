<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useShoppingItemsStore } from '~/stores/shoppingItems'

const shoppingItemsStore = useShoppingItemsStore()
const { items, checkedItemsIds } = storeToRefs(shoppingItemsStore)
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
    <div class="flex justify-center gap-2 h-20 sm:h-36 p-0">
      <input v-model="newItem" placeholder="I need to get..." class="grow-1 px-6 pt-8  leading-snug text-xl sm:text-3xl border-b-10 border-b-soft-green" @keyup.enter="addItem">
      <button
        class="h-full min-w-20 sm:w-36 text-5xl sm:text-6xl text-soft-green font-900 border-4 border-soft-green rounded-full"
        @click="addItem"
      >
        +
      </button>
    </div>
    <TransitionGroup tag="ul" name="list" class="flex flex-col gap-4">
      <li v-for="item in items" :key="item.id" class="h-24 w-full flex justify-between items-center px-6 gap-6 text-xl sm:text-2xl">
        <span class="">
          {{ item.name }}
        </span>
        <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12 rounded-full" @click="shoppingItemsStore.updateItem(item.id)">
      </li>
    </TransitionGroup>
  </div>
</template>

<style>
.list-move,
.list-enter-active
 {
  transition: all 0.4s cubic-bezier(0.1, 0.8, 0.1, 1);
}
.list-leave-active {
  transition: all 0.4s cubic-bezier(.05,.76,.03,.89)
}
.list-enter-from
 {
  opacity: 0;
  transform: translate(0, -100px);
}
.list-leave-to {
  opacity: 0;
  transform: translate(1000px, 0);
}
.list-leave-active {
  position: absolute;
}
</style>
