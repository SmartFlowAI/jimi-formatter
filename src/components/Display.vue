<template>
  <div class="button-container" v-show="!VITE_SINGLE_FILE_RENDER">
    <button v-if="show_copy_button !== false" @click="selectContent" class="btn"
      :style="{ color: display_copy_success ? 'rgb(0, 146, 0)' : 'black' }">
      {{ display_copy_success ? "复制成功" : "一键复制" }}
    </button>
    <button v-if="show_embed_button !== false" @click="goToEmbed" class="btn embed-btn">
      嵌入模式
    </button>
  </div>
  <div v-html="parsed_markdown" class="markdown md"></div>
  <div v-html="inject_css"></div>
</template>

<script setup lang="ts">
import content, { replace_image_bed, user_css } from "../content.ts";
import style_sheets from "../styles/style.ts";
import markdownit from "markdown-it";
import mathjax from "markdown-it-mathjax3";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.min.css";
import { computed, ref, watchEffect } from "vue";
import { encode } from "js-base64";
import router from "@/router/index.ts";

const VITE_SINGLE_FILE_RENDER = import.meta.env.VITE_SINGLE_FILE_RENDER == "True";

const props = defineProps<{
  show_copy_button?: boolean;
  show_embed_button?: boolean;
}>();

const { show_copy_button, show_embed_button } = props;

const md = markdownit({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (__) { }
    }
    return "";
  }
}).use(mathjax);

interface ReferenceType {
  href: string;
  title: string;
  explain: string;
  index: number;
}

const parsed_markdown = ref<string>("");

const link_white_list = [
  "mp.weixin.qq.com",
];

const parse_a_title = (title: string) => {
  const regexp = /\s"((?:[^"\\]|\\["\\])*)"$/g;
  const matches = title.match(regexp);
  if (matches) {
    return [title.replace(matches[0], ""), matches[0].slice(2, -1)];
  } else {
    return [title, title];
  }
};

watchEffect(async () => {
  const parsed = md.render(replace_image_bed(content.value));

  const dom = document.createElement("div");
  dom.innerHTML = parsed;

  // 找出所有的img标签，将alt属性的值转换为figcaption标签
  const all_images: NodeListOf<HTMLImageElement> = dom.querySelectorAll("img");
  all_images.forEach((image) => {

    if ((image.getAttribute("alt") || "") === "") {
      return;
    }

    // 如果在p标签中，转换为figure标签
    if (image.parentElement?.tagName === "P") {
      const figure = document.createElement("figure");
      figure.classList.add("image");
      figure.innerHTML = image.outerHTML;

      // 添加figcaption标签
      const figcaption = document.createElement("figcaption");
      figcaption.innerHTML = image.getAttribute("alt") || "";
      figure.appendChild(figcaption);

      image.parentElement.replaceWith(figure);
      return;
    }

    // 转换为figure标签
    const figure = document.createElement("figure");
    figure.classList.add("image");
    figure.innerHTML = image.outerHTML;

    // 添加figcaption标签
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = image.getAttribute("alt") || "";
    figure.appendChild(figcaption);

    image.replaceWith(figure);
  });

  // 找出所有mjx-container标签，仅保留svg，其余的删除
  const all_mathjax: NodeListOf<HTMLElement> = dom.querySelectorAll("mjx-container");
  all_mathjax.forEach((mathjax) => {
    const svg = mathjax.querySelector("svg");
    if (svg) {

      if (mathjax.getAttribute("display") === "true") {

        const width = svg.getAttribute("width");
        if (width) {
          svg.style.width = `${parseFloat(width.replace("ex", "")) / 2}em`;
        }

        const height = svg.getAttribute("height");
        if (height) {
          svg.style.height = `${parseFloat(height.replace("ex", "")) / 2}em`;
        }
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        const display = document.createElement("p");
        display.classList.add("mathjax-display");
        display.classList.add("jimi-");
        display.innerHTML = svg.outerHTML;
        mathjax.insertAdjacentElement("afterend", display);
        mathjax.remove();
      } else {
        mathjax.insertAdjacentElement("afterend", svg);
        mathjax.remove();
      }
    } else {
      mathjax.remove();
    }
  });

  // 将u标签转换为span标签
  const all_underline: NodeListOf<HTMLElement> = dom.querySelectorAll("u");
  all_underline.forEach((underline) => {
    const span = document.createElement("span");
    span.innerHTML = underline.innerHTML;
    span.classList.add("underline");

    // 处理attr
    const attrs = underline.attributes;
    for (let i = 0; i < attrs.length; i++) {
      span.setAttribute(attrs[i].name, attrs[i].value);
    }

    underline.replaceWith(span);
  });

  // 找出所有的a标签
  const all_links: NodeListOf<HTMLAnchorElement> = dom.querySelectorAll("a");

  const reference: ReferenceType[] = [];

  const links: HTMLAnchorElement[] = [];

  // 过滤掉在白名单中的链接
  all_links.forEach((link) => {
    if (link_white_list.some((white) => link.href.includes(white))) {
      link.setAttribute("target", "_blank");
      return;
    }

    links.push(link);
  });

  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const title = link.innerText;

    // 检查是否已经存在
    for (const item of reference) {
      if (item.href === href) {
        const sup = document.createElement("sup");
        sup.innerHTML = `<span class="link" href="${href}" target="_blank">[${item.index}]</span>`;
        link.insertAdjacentElement("afterend", sup);
        return;
      }
    }

    const index = reference.length + 1;

    const [title_, expain] = parse_a_title(title);

    reference.push({
      href: href,
      title: title_,
      explain: expain,
      index: index
    });

    link.innerText = title_;

    link.removeAttribute("href");

    // 在原标签后加入<sup>标签
    const sup = document.createElement("sup");
    sup.innerHTML = `<span class="link" href="${href}" target="_blank">[${index}]</span>`;
    link.insertAdjacentElement("afterend", sup);
  });

  // 将所有的a标签转换为span标签
  links.forEach((link) => {
    const span = document.createElement("span");
    span.innerHTML = link.innerHTML;

    // 处理attr
    const attrs = link.attributes;
    for (let i = 0; i < attrs.length; i++) {
      span.setAttribute(attrs[i].name, attrs[i].value);
    }

    span.classList.add("link");

    link.replaceWith(span);
  });

  // console.log(reference);

  // 转换为引用格式
  const reference_str = reference
    .map((item) => [
      `<span class="reference-container"><span class="reference-index">[${item.index}]</span>`,
      `<p class="reference-title">${item.explain}：`,
      `<span class="reference-href link">${item.href}</span></p></span>`
    ].join("")).join("\n");

  parsed_markdown.value = `${dom.innerHTML}` + (reference_str.length > 0 ? `<h1>参考资料</h1><section>${reference_str}</section>` : "");

  // console.log(parsed_markdown.value);

  const reference_dom = document.createElement("div");
  reference_dom.innerHTML = parsed_markdown.value;

  // console.log(parsed_markdown.value);
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

const display_copy_success = ref<number>(0);

const goToEmbed = () => {
  try {
    // 使用 js-base64 进行 UTF-8 安全的 base64 编码
    const encodedContent = encode(content.value);
    // 将当前样式也进行 base64 编码，避免 URL 编码问题
    const encodedStyle = encode(user_css.value);

    const urlProps = new URLSearchParams();
    urlProps.set("content", encodedContent);
    urlProps.set("style", encodedStyle);

    // 构建 embed 页面 URL
    const embedUrl = router.resolve({ name: "embed", query: Object.fromEntries(urlProps) }).href;

    // 在新窗口中打开 embed 页面
    window.open(embedUrl, "_blank");
  } catch (error) {
    console.error("Error encoding content for embed:", error);
    alert("编码内容时出错，请检查内容是否包含特殊字符");
  }
};

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
    display_copy_success.value = 2000;
  }
};

setInterval(() => {
  if (display_copy_success.value > 0) {
    display_copy_success.value -= 100;
  } else {
    display_copy_success.value = 0;
  }
}, 100);
</script>

<style scoped>
.markdown {
  overflow: auto;
  overflow-x: hidden;
  width: calc(100% - var(--global-padding) * 2);
  height: calc(100% - var(--global-padding) * 2);
  padding: var(--global-padding);
  padding-right: calc(var(--global-padding) * 0.8);
}

.button-container {
  position: absolute;
  display: flex;
  right: 30px;
  gap: 10px;
  z-index: 10;
}

.btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

/* .embed-btn {
  color: #0066cc;
} */
</style>
