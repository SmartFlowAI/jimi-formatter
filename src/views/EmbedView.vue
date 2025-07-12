<script setup lang="ts">
import Display from "../components/Display.vue";
import content, { user_css } from "../content.ts";
import { onMounted } from "vue";
import { decode } from "js-base64";

onMounted(() => {
  // 解析 URL 参数
  const params = new URLSearchParams(window.location.search);

  // 解析 content 参数（base64 编码）
  const contentParam = params.get("content");
  if (contentParam) {
    try {
      // 使用 js-base64 进行 UTF-8 安全的 base64 解码
      const decodedContent = decode(contentParam);
      content.value = decodedContent;
    } catch (error) {
      console.error("Error decoding content parameter:", error);
      console.error("Content param:", contentParam);
    }
  }

  // 解析 style 参数
  const styleParam = params.get("style");
  if (styleParam) {
    try {
      // 使用 js-base64 进行 UTF-8 安全的 base64 解码
      user_css.value = decode(styleParam);
    } catch (error) {
      console.error("Error decoding style parameter:", error);
      console.error("Style param:", styleParam);
      // 如果解码失败，尝试直接使用参数值
      user_css.value = styleParam;
    }
  }
});
</script>

<template>
  <div class="embed-container">
    <Display :embed_mode="true" />
  </div>
</template>

<style scoped>
.embed-container {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: auto;
}
</style>
