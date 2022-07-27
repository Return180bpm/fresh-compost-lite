<script setup lang="ts">
const props = defineProps<{
  id: number
  text: string
}>()

const checked = $ref(false)
</script>

<template>
  <div class="flex px-6 py-10 text-2xl bg-gray-100">
    <label class="flex gap-4 items-baseline">
      <input id="'' + props.id" v-model="checked" type="checkbox" :value="props.id" class="w-6 h-6">
      <span>{{ text }}</span>
    </label>
    <!-- {{ text }} -->
  </div>
</template>
