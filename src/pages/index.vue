<script setup lang="ts">
import { storeToRefs } from 'pinia'
import autoComplete from '@tarekraafat/autocomplete.js'
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

// eslint-disable-next-line new-cap
const autoCompleteJS = new autoComplete({
  selector: '#autoComplete',
  placeHolder: 'I need to get...',
  data: {
    src: ['Sauce - Thousand Island', 'Wild Boar - Tenderloin', 'Goat - Whole Cut'],
    cache: true,
  },
  resultsList: {
    element: (list, data) => {
      if (!data.results.length) {
        // Create "No Results" message element
        const message = document.createElement('div')
        // Add class to the created element
        message.setAttribute('class', 'no_result')
        // Add message text content
        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`
        // Append message element to the results list
        list.prepend(message)
      }
    },
    noResults: true,
  },
  resultItem: {
    highlight: true,
  },
})
</script>

<template>
  <div class="flex flex-col gap-16 max-w-screen-sm">
    <div class="flex justify-center gap-2 h-20 sm:h-36 p-0">
      <input id="autoComplete" ref="input" v-model="newItem" type="search" dir="ltr" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off" maxlength="200" tabindex="1" class="grow-1 px-6 pt-8  leading-snug text-xl sm:text-3xl border-b-10 border-b-soft-green" @keyup.enter="addItem">
      <button
        class="h-full min-w-20 sm:w-36 text-5xl sm:text-6xl text-soft-green font-900 border-4 border-soft-green rounded-full"
        @click="addItem"
      >
        +
      </button>
    </div>

    <div v-if="uncheckedItems.length === 0" class="p-8 rounded-3xl border-1 border-soft-grey text-soft-grey italic">
      <p class="mb-4">
        📜 Nothing on your list yet.
      </p>
      <p>Yummy things You could add: 🥬🥝🥑</p>
    </div>

    <ul v-else tag="ul" name="list" class="flex flex-col items-center gap-4 text-xl sm:text-2xl">
      <li v-for="item in uncheckedItems" :key="item.id" class="h-24 w-full flex justify-between items-center px-6 gap-6 ">
        <span class="">
          {{ item.name }}
        </span>
        <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12" @click="() => { shoppingItemsStore.checkItem(item.id) }">
      </li>
    </ul>

    <ul v-if="checkedItems.length > 0" class="flex flex-col items-center gap-4 text-xl sm:text-2xl">
      <hr class="w-50 text-soft-grey my-16">
      <li v-for="item in checkedItems" :key="item.id" class="h-24 w-full flex justify-between items-center px-6 gap-6 ">
        <span class="">
          {{ item.name }}
        </span>
        <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12" @click="() => { shoppingItemsStore.uncheckItem(item.id) }">
      </li>
    </ul>
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
  transform: translate(100px, 0);
}
.list-leave-active {
  position: absolute;
}
</style>
