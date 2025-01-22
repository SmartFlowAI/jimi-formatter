<template>
  <textarea
    class="textarea"
    placeholder="这里输入CSS"
    v-model="user_css"
  ></textarea>
</template>

<script setup lang="ts">
import { user_css } from "../content.ts";
</script>

<style scoped>
.textarea {
  width: calc(100% - var(--global-padding) * 2);
  height: calc(50% - var(--global-padding) * 3);
  padding: var(--global-padding);
  padding-right: calc(var(--global-padding) * 0.8);
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  background-color: transparent;
  color: var(--text-color);
  transition: all 0.3s;
}
</style>
