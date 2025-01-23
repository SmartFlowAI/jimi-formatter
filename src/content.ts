import { ref } from "vue";

const content = ref<string>(`# 这是大标题

## 这是二级标题

这是一段文字，这里**加粗**了，这里*倾斜*了，这里是***加粗斜体***，这里增加了<u>下划线</u>。

1. 没病走两步
2. 走出一个一日千里

+ 走出一个虎虎生风
+ 走出个恍如隔世

这是一张图片：

![这是一张样例图片，用来展示图片备注](https://smartflowai.github.io/jimi-formatter/example.png)

深度学习中，$x$ 通常表示输入，$y$ 通常表示输出，$w$ 通常表示权重，$b$ 通常表示偏置。

$$
\\text{Attention}(Q,K,V) = \\underset{\\text{seq}}{\\text{softmax}}\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right) V
$$

> 你可以直接黏贴图片进来，它们会以形如 \`smartflow://image/xxx\` 的特殊协议存储。

\`font-family: "PingFang SC", "system-ui", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;\`

\`\`\`js
links.forEach((link) => {
    reference.push({
        href: link.getAttribute("href") || "",
        title: link.innerText,
        index: reference.length + 1
    });

    link.setAttribute("target", "_blank");

    // 在原标签后加入<sup>标签
    const sup = document.createElement("sup");
    sup.innerHTML = \`<a href="$\{link.getAttribute("href") || ""}" target="_blank">[$\{reference.length}]</a>\`;
    link.insertAdjacentElement("afterend", sup);
});
\`\`\`

众所周知，[Jimi Formatter](https://github.com/SmartFlowAI/jimi-formatter) 会自动在下方添加参考资料。

你可以自定义格式：

<p class="custom">自定义文字格式</p>

# 论文推荐

[WF-VAE: Enhancing Video VAE by Wavelet-Driven Energy Flow for Latent Video Diffusion Model](https://arxiv.org/abs/2411.17459v2)

[HunyuanVideo: A Systematic Framework For Large Video Generative Models "混元视频大模型"](http://arxiv.org/abs/2412.03603)

# 文章分享

[免费 | 万人共学的书生大模型实战营公益课程来啦！](https://mp.weixin.qq.com/s/FaSnM79OrrBiY4HJvR0_gg)

[免费 "万人共学的书生大模型实战营公益课程来啦"](https://mp.weixin.qq.com/s/FaSnM79OrrBiY4HJvR0_gg)

<https://mp.weixin.qq.com/s/dXcxA2lt8_TTmkYYMWxbSA>`);

export const content_cursor_position = ref<number>(0);

export const image_bed = new Map();

export const user_css = ref<string>(`/* 通过宏直接引入你需要的格式包 */
@import(default, weekly)

/* 这里你可以自定义CSS */
.md .custom {
    background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
                linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
                linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
    color: linear-gradient(170deg, blue, pink);
    width: max-content
}`);

export const replace_image_bed = (content: string) => {
  for (const [url, base64] of image_bed) {
    content = content.replace(url, base64);
  }

  return content;
};

export default content;
