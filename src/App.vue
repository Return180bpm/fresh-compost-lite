<template>
  <v-app>
    <v-main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200" class="container mx-auto flex flex-col items-center justify-center">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import 'node_modules/vuetify/lib/styles/settings';
</style>
