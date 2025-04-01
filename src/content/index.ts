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
  private buttonElement: HTMLButtonElement | null = null;
  private isVisible: boolean = false;

  constructor() {
    this.initialize();
  }

  // 初始化UI元素
  private initialize(): void {
    // 创建宿主元素
    this.hostElement = document.createElement("div");
    this.hostElement.id = "translation-assistant-host";
    this.hostElement.className = "translation-popup";
    this.hostElement.style.position = "absolute"; // <--- CHANGE/ADD THIS
    this.hostElement.style.zIndex = "2147483647";
    this.hostElement.style.display = "none";
    document.body.appendChild(this.hostElement);

    // 创建Shadow DOM
    this.shadowRoot = this.hostElement.attachShadow({ mode: "open" });

    // 创建样式元素
    const style = document.createElement("style");
    style.textContent = `
      /* 内容脚本的基本样式 */
      .translation-popup-container {
        font-family: system-ui, -apple-system, sans-serif;
        background-color: white;
        border-radius: 0.5rem;
        padding: 0.75rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        max-width: 20rem;
      }
      
      .translation-popup-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      
      .translation-popup-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
      }
      
      .translation-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      
      .translation-btn {
        border-radius: 0.375rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 500;
        transition: background-color 0.2s;
        cursor: pointer;
        border: none;
      }
      
      .translation-btn-primary {
        background-color: #3b82f6;
        color: white;
      }
      
      .translation-btn-primary:hover {
        background-color: #2563eb;
      }
    `;
    this.shadowRoot.appendChild(style);

    // 创建容器
    const container = document.createElement("div");
    container.className = "translation-popup-container";

    // 创建头部
    const header = document.createElement("div");
    header.className = "translation-popup-header";

    // 创建标题
    const title = document.createElement("div");
    title.className = "translation-popup-title";
    title.textContent = "翻译助手";
    header.appendChild(title);

    // 添加头部到容器
    container.appendChild(header);

    // 创建按钮
    this.buttonElement = document.createElement("button");
    this.buttonElement.className = "translation-btn translation-btn-primary";
    this.buttonElement.textContent = "翻译";
    this.buttonElement.addEventListener(
      "click",
      this.handleButtonClick.bind(this)
    );

    // 创建按钮容器
    const actions = document.createElement("div");
    actions.className = "translation-actions";
    actions.appendChild(this.buttonElement);

    // 添加按钮容器到主容器
    container.appendChild(actions);

    // 添加容器到 Shadow DOM
    this.shadowRoot.appendChild(container);
  }

  // 处理按钮点击
  private handleButtonClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || "";
    console.log("用户点击了按钮，选中的文本是:", selectedText);

    // 这里可以添加翻译或其他操作逻辑

    // 点击后隐藏按钮
    this.hide();
  }

  // 显示浮动按钮
  public show(range: Range, selectedText: string): void {
    console.log(
      "🔍 ~ show ~ src/content/index.ts ~ selectedText:", // (保留你的日志)
      selectedText
    );
    if (!this.hostElement) return;

    // --- 关键改动：先让 hostElement 可见 ---
    // 设置为 block，以便浏览器计算其尺寸。
    // 位置暂时不重要，后面 computePosition 会覆盖 left/top
    this.hostElement.style.display = "block";
    // ---------------------------------------

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
console.log("Tiny Translation Assistant - 内容脚本已加载 222");
