// 这个文件主要用于测试侧边栏功能
console.log("侧边栏功能初始化...");

// 监听来自侧边栏的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "🔍 ~ chrome.runtime.onMessage.addListener() callback ~ src/content/sidepanel.ts:5 ~ sender:",
    sender
  );
  if (message.from === "sidepanel" && message.subject === "getInfo") {
    // 响应侧边栏的信息请求
    sendResponse({
      url: window.location.href,
      title: document.title,
      status: "ok",
    });
    return true;
  }
});
