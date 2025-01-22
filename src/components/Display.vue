<template>
  <button @click="selectContent" class="btn">一键复制</button>
  <div v-html="parsed_markdown" class="markdown md"></div>
  <div v-html="inject_css"></div>
</template>

<script setup lang="ts">
import content, { replace_image_bed, user_css } from "../content.ts";
import style_sheets from "../styles/style.ts";
import { marked } from "marked";
import { computed, ref, watchEffect } from "vue";

interface ReferenceType {
  href: string;
  title: string;
  index: number;
}

const parsed_markdown = ref<string>("");

watchEffect(async () => {
  const parsed = await marked.parse(replace_image_bed(content.value));

  const dom = document.createElement("div");
  dom.innerHTML = parsed;

  // 找出所有的a标签
  const links = dom.querySelectorAll("a");

  const reference: ReferenceType[] = [];

  links.forEach((link) => {
    reference.push({
      href: link.getAttribute("href") || "",
      title: link.innerText,
      index: reference.length + 1
    });

    link.setAttribute("target", "_blank");

    // 在原标签后加入<sup>标签
    const sup = document.createElement("sup");
    sup.innerHTML = `<a href="${link.getAttribute("href") || ""}" target="_blank">[${reference.length}]</a>`;
    link.insertAdjacentElement("afterend", sup);
  });

  console.log(reference);

  // 转换为引用格式
  const reference_str = reference
    .map((item) => [
      `<span class="reference-container"><span class="reference-index">[${item.index}]</span>`,
      `<span class="reference-title">${item.title}：</span>`,
      `<i><a class="reference-href" href="${item.href}" target="_blank">${item.href}</a></i></span>`
    ].join(""))
    .join("\n");

  console.log(reference_str);

  parsed_markdown.value = `${dom.innerHTML}<h1>参考资料</h1><div>${reference_str}</div>`;
});

const css_regexp = /\@import\((.*?)\)/g;

const inject_css = computed(() => {
  let style = user_css.value;

  // 匹配所有@import语句
  const imports = style.match(css_regexp);
  if (imports) {
    imports.forEach((import_statement) => {
      const imported_style_sheets = import_statement
        .slice(8, -1)
        .split(",");
      style = style.replace(import_statement, imported_style_sheets.map((sheet) => style_sheets[sheet.trim()]).join(""));
    });
  }

  return `<style>${style}</style>`;
});

const selectContent = () => {
  const selection = window.getSelection();
  const range = document.createRange();
  const markdownElement = document.querySelector(".markdown");
  if (markdownElement) {
    range.selectNodeContents(markdownElement);
  }
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  }
};
</script>

<style scoped>
.markdown {
  overflow: auto;
  width: calc(100% - var(--global-padding) * 2);
  height: calc(100% - var(--global-padding) * 2);
  padding: var(--global-padding);
  padding-right: calc(var(--global-padding) * 0.8);
}

.btn {
  position: absolute;
}
</style>
