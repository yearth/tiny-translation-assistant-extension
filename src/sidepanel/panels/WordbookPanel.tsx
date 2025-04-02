import React from "react";

const WordbookPanel: React.FC = () => {
  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">单词本</h1>
      
      <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <p>单词本功能即将推出，敬请期待！</p>
        </div>
      </div>
    </div>
  );
};

export default WordbookPanel;
