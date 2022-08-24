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
      <input v-model="newItem" placeholder="I need to get..." class="h-full px-6 text-3xl bg-light-200 rounded-2xl border-1 border-stone-400" @keyup.enter="addItem">
      <button
        type="button"
        class="h-full w-32 text-2xl text-stone-6 bg-lime-200 rounded-2xl"
        @click="addItem"
      >
        Add
      </button>
      <mcw-button raised>
        click me
      </mcw-button>
    </div>
    <TransitionGroup tag="ul" name="list" class="flex flex-col gap-4">
      <!-- <Transition name="placeholder">
        <li v-if="isFetchingImage" class="h-24 w-full bg-white">
          Fetching image
        </li>
      </Transition> -->
      <li v-for="item in items" :key="item.id" class="h-24 w-full flex items-center p-4 gap-6 text-3xl">
        <img v-if="item.pictureURL" :src="item.pictureURL" :alt="`A random picture of a ${item.text}`" class="w-12 h-12 rounded-xl">
        <div v-else class="w-12 h12 opacity-0" />
        <input v-model="checkedItemsIds" :value="item.id" type="checkbox" class="w-12 h-12 rounded-2xl" @click="shoppingItemsStore.updateItem(item.id)">
        <span class="text-gray-500">
          {{ item.text }}
        </span>
        <button
          type="button"
          class="grid place-items-center ml-auto w-16 h-16 rounded-full text-stone-6 bg-rose-1"
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

<style lang="scss">
@use "../styles";

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
