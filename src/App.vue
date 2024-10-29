<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <RouterView />
</template>

<style></style>
