import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OptionsPage: React.FC = () => {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // 组件加载时从存储中获取API密钥
    chrome.storage.local.get(["openRouterApiKey"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("获取API密钥时出错:", chrome.runtime.lastError);
        return;
      }

      if (result.openRouterApiKey) {
        setApiKeyInput(result.openRouterApiKey);
      }
    });
  }, []);

  const handleSave = () => {
    // 保存API密钥到存储
    chrome.storage.local.set({ openRouterApiKey: apiKeyInput }, () => {
      if (chrome.runtime.lastError) {
        console.error("保存API密钥时出错:", chrome.runtime.lastError);
        setStatusMessage("保存API密钥时出错。");
        return;
      }

      setStatusMessage("API密钥保存成功！");
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">翻译助手设置</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenRouter API Key:</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="输入您的OpenRouter API Key"
          />
        </div>
        
        <Button onClick={handleSave}>保存密钥</Button>
        
        {statusMessage && (
          <p className="mt-2 text-sm font-medium text-green-600">{statusMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OptionsPage;
