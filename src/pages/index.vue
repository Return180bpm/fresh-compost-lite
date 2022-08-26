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
      <input v-model="newItem" placeholder="I need to get..." class="grow-1 h-full px-6 border-box text-xl sm:text-3xl border-b-20 border-b-softgreen" @keyup.enter="addItem">
      <button
        class="h-full min-w-20 sm:w-36 text-5xl sm:text-6xl text-softgreen font-900 border-4 border-softgreen rounded-full"
        @click="addItem"
      >
        +
      </button>
    </div>
    <TransitionGroup tag="ul" name="list" class="flex flex-col gap-4">
      <!-- <Transition name="placeholder">
        <li v-if="isFetchingImage" class="h-24 w-full bg-white">
          Fetching image
        </li>
      </Transition> -->
      <li v-for="item in items" :key="item.id" class="h-24 w-full flex items-center p-4 gap-6 text-xl sm:text-2xl">
        <input v-model="checkedItemsIds" :value="item.id" type="checkbox" class="w-12 h-12 rounded-2xl" @click="shoppingItemsStore.updateItem(item.id)">
        <span class="text-gray-500">
          {{ item.text }}
        </span>
        <button
          type="button"
          class="grid place-items-center ml-auto min-w-16 w-16 h-16 rounded-full text-stone-6 bg-rose-1"
          @click="shoppingItemsStore.removeItem(item.id)"
        >
          <span>
            x
          </span>
        </button>
        <!-- Why would I need components? -->
        <!-- <TodoItem :id="{item.id}" text="item.text" /> -->
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
