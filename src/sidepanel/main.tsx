import React from "react";
import ReactDOM from "react-dom/client";
import SidePanel from "./SidePanel";
import "../index.css"; // 确保 Tailwind 样式被加载

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);
