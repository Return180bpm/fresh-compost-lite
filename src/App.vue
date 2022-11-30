<template>
  <main p="x-4 y-10" text="center" class="grow-1 w-full container mx-auto flex flex-col items-center justify-start">
    <router-view />
  </main>
  <hr class="w-full h-2 text-soft-grey">
  <div class="justify-self-end w-full flex justify-center py-8">
    <a href="https://github.com/Return180bpm/off-the-dome" class="i-carbon-logo-github w-18 h-18 text-soft-grey">
      <!-- <span class="i-carbon-logo-github w-24 h-24 text-" /> -->
    </a>
  </div>
</template>
