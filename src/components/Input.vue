<template>
  <textarea
    class="textarea"
    placeholder="这里输入文章内容"
    v-model="content"
    @click="updateCursor"
    @select="updateCursor"
    spellcheck="false"
  ></textarea>
</template>

<script setup lang="ts">
import content, { content_cursor_position } from "../content.ts";

const updateCursor = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  content_cursor_position.value = target.selectionStart;
};
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
