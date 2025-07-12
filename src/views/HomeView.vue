<script setup lang="ts">
import Input from "../components/Input.vue";
import Display from "../components/Display.vue";
import CSSEditor from "../components/CSSEditor.vue";

const VITE_SINGLE_FILE_RENDER = import.meta.env.VITE_SINGLE_FILE_RENDER == "True";
</script>

<template>
  <div class="container">
    <!-- Edit Panel -->
    <div class="flex" v-show="!VITE_SINGLE_FILE_RENDER">
      <Input />
      <hr />
      <CSSEditor />
    </div>

    <!-- Display Panel -->
    <div class="flex">
      <Display :show_copy_button="true" :show_embed_button="true" :embed_mode="false" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--global-padding) * 1);
  padding: v-bind('VITE_SINGLE_FILE_RENDER ? "none" : "var(--global-padding)"');
  height: v-bind('VITE_SINGLE_FILE_RENDER ? "100vh" : "calc(100vh - var(--global-padding) * 2)"');
}

.flex {
  flex: 1;
  border: v-bind('VITE_SINGLE_FILE_RENDER ? "none" : "1px solid #0003"');
  border-radius: v-bind('VITE_SINGLE_FILE_RENDER ? "none" : "calc(var(--global-padding) * 1.5)"');
  height: 100%;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.flex:hover {
  border-color: v-bind('VITE_SINGLE_FILE_RENDER ? "none" : "#0005"');
  box-shadow: v-bind('VITE_SINGLE_FILE_RENDER ? "none" : "0 0 30px #0002"');
}
</style>
