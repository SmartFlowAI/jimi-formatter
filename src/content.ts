import { ref } from "vue";

const content = ref<string>(`# 新闻资讯
## 1. DeepSeek R1 发布并开源，性能媲美 OpenAI-o1

[腾讯](https://www.tencent.com/)近日宣布，其混元3D生成大模型2.0正式发布并开源。这一升级版本不仅进一步优化了3D内容创作的能力，还同步推出了业界首个“一站式3D内容AI创作平台”——混元3D AI创作引擎。这一平台允许用户通过简单的文字或图片输入，快速生成高质量的3D模型，极大地简化了3D内容创作的流程。

2.0版本首次支持端到端生成低多边形（low-poly）模型，可根据物体的复杂程度自适应生成几百至数千面的三角网格（mesh）。这种优化在降低模型面数的同时，仍能保持较高的细节效果，非常适合游戏、动画等场景的引擎渲染。

腾讯[混元3D](https://github.com/tencent/Hunyuan3D-2)大模型系列在开源社区的表现非常亮眼。截至目前，腾讯混元3D模型在GitHub上获得了超过2500个星标，并成为Hugging Face下载增速最快的3D模型之一。
`);

export const content_cursor_position = ref<number>(0);

export const image_bed = new Map();

export const user_css = ref<string>("@import(default)");

export const replace_image_bed = (content: string) => {
  for (const [url, base64] of image_bed) {
    content = content.replace(url, base64);
  }

  return content;
};

export default content;
