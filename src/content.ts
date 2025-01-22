import { ref } from "vue";

const content = ref<string>(`# 这是大标题

## 这是二级标题

这是一段文字，这里**加粗**了，这里*倾斜*了。

这是一张图片：

![](https://github-readme-stats.vercel.app/api?username=vansin&show_icons=true)

你可以直接黏贴图片进来，它们会以形如 \`smartflow://image/xxx\` 的特殊协议存储。

众所周知，[Jimi Formatter](https://github.com/SmartFlowAI/jimi-formatter) 会自动在下方添加参考资料。

你可以自定义格式：

<div class="custom">自定义文字格式</div>`);

export const content_cursor_position = ref<number>(0);

export const image_bed = new Map();

export const user_css = ref<string>(`/* 通过宏直接引入你需要的格式包 */
@import(default, weekly)

/* 这里你可以自定义CSS */
.md .custom {
    background: linear-gradient(170deg, blue, pink);
    color: white;
    width: max-content
}`);

export const replace_image_bed = (content: string) => {
  for (const [url, base64] of image_bed) {
    content = content.replace(url, base64);
  }

  return content;
};

export default content;
