#!/bin/bash

# 初始化变量
CONTENT_FILE=""
STYLE_FILE=""

# 解析命令行参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --content|-c)
      CONTENT_FILE="$2"
      shift 2
      ;;
    --style|-s)
      STYLE_FILE="$2"
      shift 2
      ;;
    *)
      echo "未知参数: $1"
      exit 1
      ;;
  esac
done

# 检查是否提供了必要的文件
if [[ -z "$CONTENT_FILE" ]]; then
  echo "错误: 未指定内容文件。使用 --content 或 -c 参数指定。"
  exit 1
fi

if [[ -z "$STYLE_FILE" ]]; then
  echo "错误: 未指定样式文件。使用 --style 或 -s 参数指定。"
  exit 1
fi

# 检查文件是否存在
if [[ ! -f "$CONTENT_FILE" ]]; then
  echo "错误: 内容文件 '$CONTENT_FILE' 不存在。"
  exit 1
fi

if [[ ! -f "$STYLE_FILE" ]]; then
  echo "错误: 样式文件 '$STYLE_FILE' 不存在。"
  exit 1
fi

# 读取文件内容到环境变量
export VITE_JIMI_CONTENT=$(cat "$CONTENT_FILE")
export VITE_JIMI_STYLE=$(cat "$STYLE_FILE")
export VITE_SINGLE_FILE_RENDER=True

# 显示确认信息
echo "已设置环境变量:"
echo "- VITE_JIMI_CONTENT: 从文件 '$CONTENT_FILE' 读取"
echo "- VITE_JIMI_STYLE: 从文件 '$STYLE_FILE' 读取"

# 运行构建命令
echo "正在运行 pnpm dev..."
pnpm dev
