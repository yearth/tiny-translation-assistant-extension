import React from "react";

interface TranslationPanelProps {
  meaning: string;
  contextualMeaning: string;
  dictionaryDefinition: string;
  exampleSentence: string;
  isLoading?: boolean;
  onSave: () => void;
  onClose: () => void;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({
  meaning,
  contextualMeaning,
  dictionaryDefinition,
  exampleSentence,
  isLoading = false,
  onSave,
  onClose,
}) => {
  console.log("TranslationPanel props:", {
    meaning,
    contextualMeaning,
    dictionaryDefinition,
    exampleSentence,
  });

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px] text-black">
      {/* 主要术语 */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-bold text-black ">{meaning}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent rounded-full"
          aria-label="关闭"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 1.5L6.5 6.5"
              stroke="currentColor"
              strokeLinecap="round"
            ></path>
            <path
              d="M6.5 1.5L1.5 6.5"
              stroke="currentColor"
              strokeLinecap="round"
            ></path>
          </svg>
        </button>
      </div>

      {/* 上下文含义 */}
      <p className="text-sm text-gray-600 mb-3">
        {isLoading ? <LoadingDots /> : contextualMeaning}
      </p>

      {/* 词典定义部分 */}
      <div className="bg-muted p-3 rounded-md mb-3">
        <p className="text-sm text-gray-800">
          {isLoading ? <LoadingDots /> : dictionaryDefinition}
        </p>
      </div>

      {/* 示例句子 */}
      <div className="bg-secondary/30 p-3 rounded-md mb-4">
        <p className="text-sm text-gray-800">
          {isLoading ? <LoadingDots /> : exampleSentence}
        </p>
      </div>

      {/* 底部操作按钮 */}
      <div className="flex justify-between items-center">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium"
        >
          保存到笔记
        </button>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white px-3 py-1 rounded-md text-sm"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

// 加载动画组件
const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1 items-center">
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
    </div>
  );
};

export default TranslationPanel;
