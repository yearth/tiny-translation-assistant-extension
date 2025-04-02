import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OptionsPage: React.FC = () => {
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // 组件加载时从存储中获取API密钥
    chrome.storage.local.get(["openRouterApiKey", "geminiApiKey"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("获取API密钥时出错:", chrome.runtime.lastError);
        return;
      }

      if (result.openRouterApiKey) {
        setOpenRouterApiKey(result.openRouterApiKey);
      }
      
      if (result.geminiApiKey) {
        setGeminiApiKey(result.geminiApiKey);
      }
    });
  }, []);

  const handleSaveOpenRouter = () => {
    // 保存OpenRouter API密钥到存储
    chrome.storage.local.set({ openRouterApiKey: openRouterApiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error("保存OpenRouter API密钥时出错:", chrome.runtime.lastError);
        setStatusMessage("保存OpenRouter API密钥时出错。");
        return;
      }

      setStatusMessage("OpenRouter API密钥保存成功！");
    });
  };
  
  const handleSaveGemini = () => {
    // 保存Gemini API密钥到存储
    chrome.storage.local.set({ geminiApiKey: geminiApiKey }, () => {
      if (chrome.runtime.lastError) {
        console.error("保存Gemini API密钥时出错:", chrome.runtime.lastError);
        setStatusMessage("保存Gemini API密钥时出错。");
        return;
      }

      setStatusMessage("Gemini API密钥保存成功！");
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">翻译助手设置</h1>
      
      <Tabs defaultValue="gemini" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gemini">Gemini API</TabsTrigger>
          <TabsTrigger value="openRouter">OpenRouter API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gemini" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="geminiApiKey">Gemini API Key:</Label>
            <Input
              id="geminiApiKey"
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="输入您的Gemini API Key"
            />
          </div>
          
          <Button onClick={handleSaveGemini}>保存 Gemini 密钥</Button>
        </TabsContent>
        
        <TabsContent value="openRouter" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="openRouterApiKey">OpenRouter API Key:</Label>
            <Input
              id="openRouterApiKey"
              type="password"
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              placeholder="输入您的OpenRouter API Key"
            />
          </div>
          
          <Button onClick={handleSaveOpenRouter}>保存 OpenRouter 密钥</Button>
        </TabsContent>
      </Tabs>
      
      {statusMessage && (
        <p className="mt-4 text-sm font-medium text-green-600">{statusMessage}</p>
      )}
    </div>
  );
};

export default OptionsPage;
