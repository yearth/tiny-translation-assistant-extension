/**
 * 内容脚本 - 选中文本后显示浮动按钮
 */
import {
  computePosition,
  // autoPlacement,
  offset,
  shift,
  flip,
  size,
} from "@floating-ui/dom";
import React from "react";
import * as ReactDOM from "react-dom/client";
import Toolbar from "./components/Toolbar";

// 导入 Tailwind CSS 样式
import "./content.css";

// 定义可能的段落或逻辑部分的块级元素标签
const BLOCK_ELEMENTS = [
  "P",
  "DIV",
  "LI",
  "BLOCKQUOTE",
  "ARTICLE",
  "SECTION",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
];

/**
 * 查找包含选择文本的上下文段落
 * @param node 选择的起始节点
 * @returns 上下文段落元素
 */
function findContextElement(node: Node | null): HTMLElement | null {
  if (!node) return null;

  // 如果是文本节点，获取其父元素
  let element: HTMLElement | null =
    node.nodeType === Node.TEXT_NODE
      ? node.parentElement
      : (node as HTMLElement);

  // 向上遍历DOM树，直到找到块级元素或达到body
  while (element && element.tagName !== "BODY") {
    if (BLOCK_ELEMENTS.includes(element.tagName)) {
      return element;
    }
    element = element.parentElement;
  }

  // 如果没有找到合适的块级元素，返回body
  return document.body;
}

// 管理浮动UI的类
class FloatingUI {
  private hostElement: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private reactRoot: any = null; // ReactDOM.Root 类型
  private isVisible: boolean = false;
  private selectedText: string = "";

  constructor() {
    this.initialize();
  }

  // 初始化UI元素
  private initialize(): void {
    // 创建宿主元素
    this.hostElement = document.createElement("div");
    this.hostElement.id = "translation-assistant-host";
    this.hostElement.className = "translation-popup";
    this.hostElement.style.position = "absolute"; // 确保绝对定位
    this.hostElement.style.zIndex = "2147483647"; // 最高层级
    this.hostElement.style.backgroundColor = "transparent";
    this.hostElement.style.border = "none";
    this.hostElement.style.padding = "0";
    this.hostElement.style.display = "none";
    document.body.appendChild(this.hostElement);

    // 创建Shadow DOM
    this.shadowRoot = this.hostElement.attachShadow({ mode: "open" });

    // 创建样式元素 - 从外部加载预编译的 CSS
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    // 使用 browser API 或 chrome API 获取扩展资源 URL
    const extensionURL = chrome.runtime.getURL("shadow-dom.css");
    style.setAttribute("href", extensionURL);

    // 添加备用内联样式，以防外部样式加载失败
    const fallbackStyle = document.createElement("style");
    fallbackStyle.textContent = `
      /* 基础 CSS 变量 - 仅作为备用 */
      :host {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;
        --primary: 221.2 83.2% 53.3%;
        --primary-foreground: 210 40% 98%;
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;
        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;
        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;
        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
        --ring: 221.2 83.2% 53.3%;
        --radius: 0.5rem;
      }
      
      /* 基础样式 */
      .bg-background { background-color: hsl(var(--background)); }
      .text-foreground { color: hsl(var(--foreground)); }
      .border-border { border-color: hsl(var(--border)); }
      
      /* 按钮样式 */
      .inline-flex { display: inline-flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .whitespace-nowrap { white-space: nowrap; }
      .rounded-md { border-radius: calc(var(--radius) - 2px); }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .font-medium { font-weight: 500; }
      .ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
      .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .focus-visible\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
      .focus-visible\:ring-2:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
      .focus-visible\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }
      .focus-visible\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
      .disabled\:pointer-events-none:disabled { pointer-events: none; }
      .disabled\:opacity-50:disabled { opacity: 0.5; }
      
      /* 按钮变体 */
      .bg-primary { background-color: hsl(var(--primary)); }
      .text-primary-foreground { color: hsl(var(--primary-foreground)); }
      .hover\:bg-primary\/90:hover { background-color: hsl(var(--primary) / 0.9); }
      
      .bg-secondary { background-color: hsl(var(--secondary)); }
      .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
      .hover\:bg-secondary\/80:hover { background-color: hsl(var(--secondary) / 0.8); }
      
      .border { border-width: 1px; }
      .border-input { border-color: hsl(var(--input)); }
      .bg-background { background-color: hsl(var(--background)); }
      .hover\:bg-accent:hover { background-color: hsl(var(--accent)); }
      .hover\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
      
      /* 布局样式 */
      .flex { display: flex; }
      .items-center { align-items: center; }
      .space-x-2 > * + * { margin-left: 0.5rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .mr-1 { margin-right: 0.25rem; }
      .ml-auto { margin-left: auto; }
      .min-w-\[300px\] { min-width: 300px; }
      .p-2 { padding: 0.5rem; }
      
      /* 颜色和背景 */
      .bg-white { background-color: white; }
      .text-gray-800 { color: #1f2937; }
      .hover\:bg-gray-100:hover { background-color: #f3f4f6; }
      .border-gray-200 { border-color: #e5e7eb; }
      
      /* 边框和阴影 */
      .rounded { border-radius: 0.25rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .border { border-width: 1px; border-style: solid; }
      
      /* 交互 */
      .cursor-pointer { cursor: pointer; }
      .flex-col { flex-direction: column; }
      .flex-row { flex-direction: row; }
      .gap-2 { gap: 0.5rem; }
      .justify-end { justify-content: flex-end; }
      .mb-1 { margin-bottom: 0.25rem; }
      .p-3 { padding: 0.75rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      
      /* 其他样式 */
      .min-w-\[200px\] { min-width: 200px; }
      .rounded-lg { border-radius: var(--radius); }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      
      /* 按钮尺寸 */
      .h-9 { height: 2.25rem; }
      .h-10 { height: 2.5rem; }
      .h-11 { height: 2.75rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .px-8 { padding-left: 2rem; padding-right: 2rem; }
      .w-10 { width: 2.5rem; }
    `;
    // 将外部样式和备用样式添加到 Shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(fallbackStyle);

    // 创建React根元素
    const reactContainer = document.createElement("div");
    reactContainer.id = "react-root";
    this.shadowRoot.appendChild(reactContainer);

    // 创建React根
    this.reactRoot = ReactDOM.createRoot(reactContainer);
  }

  // 处理翻译按钮点击
  private handleTranslate(): void {
    console.log("翻译按钮点击，选中的文本是:", this.selectedText);
    
    // 从chrome.storage.local中检索API密钥
    chrome.storage.local.get(['openRouterApiKey'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('获取API密钥时出错:', chrome.runtime.lastError);
      } else {
        console.log('用于翻译的API密钥:', result.openRouterApiKey);
        // 这里可以添加使用API密钥进行翻译的逻辑
        if (!result.openRouterApiKey) {
          console.warn('未设置API密钥，请在扩展选项页中设置API密钥');
        }
      }
    });
  }

  // 处理朗读按钮点击
  private handleReadAloud(): void {
    console.log("朗读按钮点击，选中的文本是:", this.selectedText);
    // 这里可以添加朗读逻辑
  }

  // 处理添加到单词本按钮点击
  private handleAddToWordbook(): void {
    console.log("添加到单词本按钮点击，选中的文本是:", this.selectedText);
    // 这里可以添加添加到单词本的逻辑
  }

  // 显示浮动按钮
  public show(range: Range, selectedText: string): void {
    console.log(
      "🔍 ~ show ~ src/content/index.ts ~ selectedText:", // (保留你的日志)
      selectedText
    );
    if (!this.hostElement || !this.reactRoot) return;

    // 保存选中的文本
    this.selectedText = selectedText;

    // --- 关键改动：先让 hostElement 可见 ---
    // 设置为 block，以便浏览器计算其尺寸。
    // 位置暂时不重要，后面 computePosition 会覆盖 left/top
    this.hostElement.style.display = "block";
    // ---------------------------------------

    // 渲染 React 组件
    this.reactRoot.render(
      React.createElement(Toolbar, {
        selectedText: this.selectedText,
        onTranslate: this.handleTranslate.bind(this),
        onReadAloud: this.handleReadAloud.bind(this),
        onAddToWordbook: this.handleAddToWordbook.bind(this),
      } as any)
    );

    // 创建虚拟元素作为参考点
    const virtualRef = {
      // 改个名字，更清晰
      getBoundingClientRect: () => range.getBoundingClientRect(),
      // Floating UI 可能需要 getClientRects 来处理多行选区，虽然不总是必须，但加上更稳健
      getClientRects: () => range.getClientRects(),
    };

    // 计算位置
    computePosition(virtualRef, this.hostElement, {
      placement: "top", // 依然优先尝试顶部
      middleware: [
        // 1. Offset: 提供基础间隙
        offset(8), // 可以先恢复到一个较小的值，比如 8px 或 10px

        // 2. Flip: 处理空间不足时的翻转
        flip({
          fallbackPlacements: ["bottom"],
          padding: 5,
        }),

        // 3. Shift: 防止视口溢出 (主要是水平)
        shift({ padding: 5 }),

        // 4. Size: 确保计算时考虑浮动元素自身尺寸 (非常重要!)
        size({
          apply({ availableWidth, availableHeight, elements }) {
            console.log("Size Middleware apply - Available Space:", {
              availableWidth,
              availableHeight,
              elements,
            });
          },
          padding: 5, // 建议与 flip/shift 的 padding 保持一致
        }),
      ],
    }).then(({ x, y, placement }) => {
      // 可以获取最终的 placement
      // 应用计算出的位置
      if (this.hostElement) {
        console.log(`最终放置位置: ${placement}, x: ${x}, y: ${y}`); // 添加日志，方便调试
        this.hostElement.style.left = `${x}px`;
        this.hostElement.style.top = `${y}px`;
        this.isVisible = true;
      }
    });
  }

  // 隐藏浮动按钮
  public hide(): void {
    if (this.hostElement && this.isVisible) {
      this.hostElement.style.display = "none";
      this.isVisible = false;
    }
  }

  // 检查是否可见
  public isCurrentlyVisible(): boolean {
    return this.isVisible;
  }
}

// 创建FloatingUI实例
const floatingUI = new FloatingUI();

/**
 * 处理文本选择事件
 */
function handleTextSelection(event: MouseEvent): void {
  console.log(
    "🔍 ~ handleTextSelection ~ src/content/index.ts:176 ~ event:",
    event
  );
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() || "";

  // 如果有选中文本
  if (selectedText.length > 0) {
    console.log("选中文本:", selectedText);

    // 查找上下文段落
    const contextElement = findContextElement(selection?.anchorNode || null);
    if (contextElement) {
      const contextText = contextElement.textContent?.trim();
      console.log("上下文段落:", contextText);
    }

    // 显示浮动按钮
    const range = selection?.getRangeAt(0);
    if (range) {
      floatingUI.show(range, selectedText);
    }
  }
}

/**
 * 处理鼠标按下事件
 */
function handleMouseDown(event: MouseEvent): void {
  // 检查点击是否发生在浮动按钮外部
  const hostElement = document.getElementById("translation-assistant-host");
  if (hostElement && !hostElement.contains(event.target as Node)) {
    // 如果点击发生在浮动按钮外部，隐藏它
    floatingUI.hide();
  }
}

// 添加事件监听器
document.addEventListener("mouseup", handleTextSelection);
document.addEventListener("mousedown", handleMouseDown);

// 在控制台输出初始化信息
console.log("Tiny Translation Assistant - React 版本内容脚本已加载");
