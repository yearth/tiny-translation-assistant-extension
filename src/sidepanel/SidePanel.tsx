import React, { useState } from "react";
import { SettingsIcon, BookIcon } from "./icons";
import SettingsPanel from "./panels/SettingsPanel";
import WordbookPanel from "./panels/WordbookPanel";

// 定义侧边导航项
interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  component: React.ReactNode;
}

const SidePanel: React.FC = () => {
  // 定义导航项
  const navItems: NavItem[] = [
    {
      id: "settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      label: "设置",
      component: <SettingsPanel />,
    },
    {
      id: "wordbook",
      icon: <BookIcon className="w-5 h-5" />,
      label: "单词本",
      component: <WordbookPanel />,
    },
  ];

  // 当前激活的导航项
  const [activeNavItem, setActiveNavItem] = useState<string>("settings");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* 左侧导航栏 - 固定宽度，只显示图标 */}
      <div className="w-12 bg-gray-900 h-full flex flex-col items-center py-4">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`relative flex justify-center items-center w-10 h-10 rounded-md mb-2 cursor-pointer hover:bg-gray-700 group ${
              activeNavItem === item.id ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveNavItem(item.id)}
          >
            {/* 图标 */}
            <div className={`text-${activeNavItem === item.id ? "primary" : "gray-300"}`}>
              {item.icon}
            </div>
            
            {/* 悬停提示 */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 bg-white dark:bg-gray-800 overflow-auto">
        {navItems.find((item) => item.id === activeNavItem)?.component}
      </div>
    </div>
  );
};

export default SidePanel;
