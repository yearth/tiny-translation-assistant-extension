console.log("background loaded");

// 监听浏览器动作点击事件，打开侧边栏
// chrome.action.onClicked.addListener(() => {
//   // 打开侧边栏
//   chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
// });

// 处理侧边栏的消息通信
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.from === "sidepanel") {
    // 如果消息来自侧边栏
    if (message.subject === "getApiKey") {
      // 获取API密钥
      chrome.storage.local.get(["openRouterApiKey"], (result) => {
        sendResponse({
          success: true,
          apiKey: result.openRouterApiKey || "",
        });
      });
      return true; // 异步响应
    }

    if (message.subject === "saveApiKey") {
      // 保存API密钥
      chrome.storage.local.set({ openRouterApiKey: message.apiKey }, () => {
        sendResponse({ success: true });
      });
      return true; // 异步响应
    }
  }
  return false;
});

// 在安装或更新时设置侧边栏行为
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed or updated!");
  
  // 设置点击扩展图标时自动打开侧边栏
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch(error => {
      console.error("设置侧边栏行为失败:", error);
    });
});
