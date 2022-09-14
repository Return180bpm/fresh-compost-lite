<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useShoppingItemsStore } from '~/stores/shoppingItems'

const shoppingItemsStore = useShoppingItemsStore()
const { checkedItems, uncheckedItems } = storeToRefs(shoppingItemsStore)
const newItem = ref('')
const input = ref<HTMLInputElement | null>(null)
function addItem() {
  if (!newItem.value)
    return

  shoppingItemsStore.addItem(newItem.value)
  newItem.value = ''

  input.value?.focus()
}
</script>

<template>
  <div class="flex flex-col items-center gap-16 max-w-screen-sm">
    <div class="flex justify-center gap-2 h-20 sm:h-36 p-0">
      <input ref="input" v-model="newItem" placeholder="I need to get..." class="grow-1 px-6 pt-8  leading-snug text-xl sm:text-3xl border-b-10 border-b-soft-green" @keyup.enter="addItem">
      <button
        class="h-full min-w-20 sm:w-36 text-5xl sm:text-6xl text-soft-green font-900 border-4 border-soft-green rounded-full"
        @click="addItem"
      >
        +
      </button>
    </div>
    <TransitionGroup tag="ul" name="unchecked-items" class="w-128 flex flex-col items-center gap-4 text-xl sm:text-2xl">
      <li v-if="uncheckedItems.length === 0" key="empty-list" class="w-128 p-8 rounded-3xl border-1 border-soft-grey text-soft-grey italic">
        <p class="mb-4">
          📜 Your list is empty.
        </p>
        <p>Yummy things You could add: 🥬🥝🥑</p>
      </li>
      <li v-for="item in uncheckedItems" v-else :key="item.id" class="w-128 h-24 flex justify-between items-center px-6 gap-6 ">
        <span class="">
          {{ item.name }}
        </span>
        <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12" @click="() => { shoppingItemsStore.checkItem(item.id) }">
      </li>
    </TransitionGroup>
    <hr v-if="checkedItems.length > 0" key="list-separator" class="w-50 text-soft-grey my-16">
    <ul class="w-128 flex flex-col items-center gap-4 text-xl sm:text-2xl">
      <li v-for="item in checkedItems" :key="item.id" class="w-128 h-24 flex justify-between items-center px-6 gap-6 ">
        <span class="">
          {{ item.name }}
        </span>
        <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12" @click="() => { shoppingItemsStore.uncheckItem(item.id) }">
      </li>
    </ul>
  </div>
</template>

<!-- Even this simple setup produces janky behavior: check the very bottom element in the unchecked list, and it seems to move upward   -->
<style>
.unchecked-items-move,
.unchecked-items-enter-active {
  transition: all 0.7s cubic-bezier(0.1, 0.8, 0.1, 1);
}
.unchecked-items-leave-active {
  transition: all 0.2s cubic-bezier(.05,.76,.03,.89);
  position: absolute;
}
.unchecked-items-enter-from {
  opacity: 0;
}
.unchecked-items-leave-to {
  opacity: 0;
}
</style>
