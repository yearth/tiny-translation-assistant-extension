import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsPanel: React.FC = () => {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // 组件加载时通过消息获取API密钥
    chrome.runtime.sendMessage(
      { from: "sidepanel", subject: "getApiKey" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("获取API密钥时出错:", chrome.runtime.lastError);
          return;
        }

        if (response && response.success && response.apiKey) {
          setApiKeyInput(response.apiKey);
        }
      }
    );
  }, []);

  const handleSave = () => {
    // 通过消息保存API密钥
    chrome.runtime.sendMessage(
      { from: "sidepanel", subject: "saveApiKey", apiKey: apiKeyInput },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("保存API密钥时出错:", chrome.runtime.lastError);
          setStatusMessage("保存API密钥时出错。");
          return;
        }

        if (response && response.success) {
          setStatusMessage("API密钥保存成功！");
          
          // 3秒后清除状态消息
          setTimeout(() => {
            setStatusMessage("");
          }, 3000);
        }
      }
    );
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">设置</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-gray-900 dark:text-white">OpenRouter API Key:</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="输入您的OpenRouter API Key"
            className="w-full"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          保存设置
        </Button>

        {statusMessage && (
          <div className="p-2 mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-md text-sm text-center">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
