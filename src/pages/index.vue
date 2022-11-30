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
const selectedResultIndex = ref(-1)

function addItem(itemText: string) {
  if (!itemText)
    return

  shoppingItemsStore.addItem(itemText)
  inputText.value = ''

  input.value?.focus()
}

const autocompleteOptions: UseFuseOptions<Item> = {
  fuseOptions: {
    keys: ['name'],
    isCaseSensitive: false,
    threshold: 0.3,
    minMatchCharLength: 2,
  },
  matchAllWhenSearchEmpty: false,
}
const RESULT_LIMIT = 3
// const allItems = computed<Item[]>(() => [...checkedItems.value, ...uncheckedItems.value])
const { results: resultsUncheckedItems } = useFuse(inputText, uncheckedItems.value, autocompleteOptions)
const { results: resultsCheckedItems } = useFuse(inputText, checkedItems.value, autocompleteOptions)

const resultsUncheckedItemsUnique = computed(() => [...new Map(resultsUncheckedItems.value.map(fuseResult =>
  [fuseResult.item.name, fuseResult.item])).values()].slice(0, RESULT_LIMIT))
const resultsCheckedItemsUnique = computed(() => [...new Map(resultsCheckedItems.value.map(fuseResult =>
  [fuseResult.item.name, fuseResult.item])).values()].slice(0, RESULT_LIMIT))
const allResultsUnique = computed(() => [...resultsUncheckedItemsUnique.value, ...resultsCheckedItemsUnique.value])

watch(inputFocus, (currentFocus) => {
  if (currentFocus === false)
    selectedResultIndex.value = -1
})
watch(inputText, () => {
  selectedResultIndex.value = -1
})

onKeyStroke('ArrowDown', (e) => {
  if (!inputFocus.value)
    return

  e.preventDefault()

  if (inputText.value.length > 0)
    selectedResultIndex.value = (selectedResultIndex.value + 1) % (allResultsUnique.value.length + 1)
})
onKeyStroke('ArrowUp', (e) => {
  if (!inputFocus.value)
    return

  e.preventDefault()

  if (inputText.value.length > 0)
    selectedResultIndex.value--
  if (selectedResultIndex.value < 0)
    selectedResultIndex.value = allResultsUnique.value.length
})
onKeyStroke('Enter', (e) => {
  if (!inputFocus.value)
    return

  e.preventDefault()

  if (selectedResultIndex.value <= 0)
    addItem(inputText.value)
  else
    addItem(allResultsUnique.value[selectedResultIndex.value - 1].name)
})
</script>

<template>
  <div id="layoutWrapper" class="h-screen grid grid-rows-[auto_1fr] gap-8">
    <div id="inputAndButtonRow" class="w-full flex justify-center items-end gap-2 h-20 sm:h-36 p-0">
      <div id="inputWrapper" class="grow-1 relative w-full h-full">
        <input ref="input" :value="inputText" placeholder="I need to get..." class="w-full h-full px-6 pt-8  leading-snug text-xl sm:text-3xl border-b-10 border-b-soft-green" @input="event => inputText = (event!.target! as HTMLInputElement).value">
        <div v-if="inputFocus && inputText.length > 0" class="absolute left-0 w-full p-4 flex bg-white text-xl sm:text-2xl border-1">
          <!-- <p v-if="inputText.length === 0" class="text-soft-grey italic">
            Start typing to see suggestions
          </p> -->
          <ul class="w-full text-2xl">
            <li class="w-full h-20 flex justify-start items-center px-6 cursor-pointer hover:bg-soft-green" :class="{ 'bg-soft-green': selectedResultIndex === 0 }" @mousedown.stop.prevent @click="addItem(inputText)">
              Add <span class="font-bold">&nbsp;{{ inputText }}&nbsp; </span> to list
            </li>
            <li v-for="result, index in allResultsUnique" :key="result.id" class="w-full h-20 flex justify-between items-center px-6 cursor-pointer hover:bg-soft-green" :class="{ 'text-soft-grey': !result.isChecked, 'bg-soft-green': index === selectedResultIndex - 1 }" @mousedown.stop.prevent @click="addItem(result.name)">
              <span class="">
                {{ result.name }}
              </span>
              <span v-if="result.isChecked === true" class="foo">
                ✓
              </span>
              <span v-else class="">
                ⃝
              </span>
            </li>
          </ul>
        </div>
      </div>
      <button
        class="min-w-20 sm:min-w-36 min-h-20 sm:min-h-36 text-5xl sm:text-6xl text-soft-green font-bold border-4 border-soft-green rounded-full"
        @click="addItem(inputText)"
      >
        +
      </button>
    </div>

    <div v-if="uncheckedItems.length === 0" class="grid place-items-center  rounded-3xl text-soft-grey">
      <div id="contentWrapper" class="flex flex-col items-center gap-2 w-full px-16">
        <p class="text-8xl sm:text-9xl">
          🦧
        </p>
        <hr class="w-full border-1 text-soft-grey">
        <p class="text-xl sm:text-2xl mt-8">
          <!-- <span class="text-6xl">🦧</span> -->
          Nothing to see here
        </p>
      </div>
    </div>

    <ul v-else tag="ul" name="list" class="w-full flex flex-col items-center gap-2 text-xl sm:text-2xl">
      <li v-for="item in uncheckedItems" :key="item.id" class="h-24 w-full flex justify-between items-center px-6 gap-6 ">
        <span class="">
          {{ item.name }}
        </span>
        <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12" @click="() => { shoppingItemsStore.checkItem(item.id) }">
      </li>
    </ul>
  </div>

  <ul v-if="checkedItems.length > 0" class="w-full flex flex-col items-center text-xl sm:text-2xl">
    <hr class="w-full text-soft-grey my-16">
    <li v-for="item in checkedItems" :key="item.id" class="h-24 w-full flex justify-between items-center px-6 gap-6 ">
      <span class="">
        {{ item.name }}
      </span>
      <input v-model="item.isChecked" :value="item.id" type="checkbox" class="w-12 h-12" @click="() => { shoppingItemsStore.uncheckItem(item.id) }">
    </li>
  </ul>
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
