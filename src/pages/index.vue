<script setup lang="ts">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useFuse } from '@vueuse/integrations/useFuse'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { useShoppingItemsStore } from '~/stores/shoppingItems'
import type { Item } from '~/types'

const shoppingItemsStore = useShoppingItemsStore()
const { checkedItems, uncheckedItems } = storeToRefs(shoppingItemsStore)
const inputText = ref('')
const input = ref<HTMLInputElement | null>(null)
const { focused: inputFocus } = useFocus(input)

function addItem() {
  if (!inputText.value)
    return

  shoppingItemsStore.addItem(inputText.value)
  inputText.value = ''

  input.value?.focus()
}

const autocompleteOptions = computed<UseFuseOptions<Item>>(() => ({
  fuseOptions: {
    keys: ['name'],
    isCaseSensitive: false,
    threshold: 0.4,
    minMatchCharLength: 2,
  },

  matchAllWhenSearchEmpty: false,
}))
const allItems = computed<Item[]>(() => [...checkedItems.value, ...uncheckedItems.value])
const { results } = useFuse(inputText, allItems, autocompleteOptions)
// const resTEST = results.value.map(fuseResult => fuseResult.item)
const resultsClean = computed(() => [...new Map(results.value.map(fuseResult =>
  [fuseResult.item.name, fuseResult.item])).values()])
</script>

<template>
  <div class="flex flex-col gap-16 max-w-screen-sm">
    <div class="flex justify-center items-end gap-2 h-20 sm:h-36 p-0">
      <div class="relative h-full">
        <input ref="input" :value="inputText" placeholder="I need to get..." class="h-full px-6 pt-8  leading-snug text-xl sm:text-3xl border-b-10 border-b-soft-green" @input="event => inputText = (event!.target! as HTMLInputElement).value" @keyup.enter="addItem">
        <div v-if="inputFocus" class="absolute left-0 w-full p-4 flex bg-white border-1">
          <p v-if="inputText.length === 0" class="foo">
            Start typing to see suggestions
          </p>
          <ul v-else class="w-full">
            <li v-for="result in resultsClean" :key="result.id" class=" w-full flex justify-between items-center px-6">
              <span class="">
                {{ result.name }}
              </span>
              <span v-if="result.isChecked === true" class="foo">
                ✓
              </span>
              <span v-else class="foo">
                ⃝
              </span>
            </li>
          </ul>
        </div>
      </div>
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
