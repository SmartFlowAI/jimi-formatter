<script setup lang="ts">
import Input from "./components/Input.vue";
import Display from "./components/Display.vue";
import CSSEditor from "./components/CSSEditor.vue";
</script>

<template>
  <div class="container">
    <!-- Edit Panel -->
    <div class="flex">
      <Input />
      <hr />
      <CSSEditor />
    </div>

    <!-- Display Panel -->
    <div class="flex">
      <Display />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--global-padding) * 1);
  padding: var(--global-padding);
  height: calc(100vh - var(--global-padding) * 2);
}

.flex {
  flex: 1;
  border: 1px solid #0003;
  border-radius: calc(var(--global-padding) * 1.5);
  height: 100%;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.flex:hover {
  border-color: #0005;
  box-shadow: 0 0 30px #0002;
  /* background-color: rgba(0, 0, 0, 0.01); */
}
</style>
