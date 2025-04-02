/**
 * OpenRouter API 工具类
 */

// 定义响应类型
export interface OpenRouterResponse {
  contextualMeaning: string;
  contextualExplanation: string;
  dictionaryDefinition: string;
  exampleSentence: string;
}

/**
 * 构建提示词
 * @param word 选中的单词
 * @param context 上下文
 * @returns 完整的提示词
 */
export function buildPrompt(word: string, context: string): string {
  return `我需要你帮我理解英文单词或短语"${word}"在以下上下文中的含义：

"${context}"

请用中文回答，并按照以下格式提供信息：
1. 在这个上下文中，"${word}"的含义是什么？
2. 详细解释为什么在这个上下文中它有这个含义
3. 提供这个词的词典定义（包括词性）
4. 给出一个使用这个词的例句

请确保回答格式如下：
{
  "contextualMeaning": "上下文中的含义",
  "contextualExplanation": "详细解释",
  "dictionaryDefinition": "词典定义",
  "exampleSentence": "示例句子"
}

请直接以 JSON 格式回答，不要有任何其他文字。`;
}

/**
 * 调用 OpenRouter API 获取翻译结果
 * @param apiKey OpenRouter API 密钥
 * @param word 选中的单词
 * @param context 上下文
 * @param onUpdate 流式更新回调
 * @returns Promise<OpenRouterResponse>
 */
export async function translateWithOpenRouter(
  apiKey: string,
  word: string,
  context: string,
  onUpdate?: (partialResponse: Partial<OpenRouterResponse>) => void
): Promise<OpenRouterResponse> {
  const prompt = buildPrompt(word, context);
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://tiny-translation-assistant.example.com",
        "X-Title": "Tiny Translation Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-pro-exp-03-25:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "stream": !!onUpdate, // 如果有回调函数，则使用流式输出
        "temperature": 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
    }

    // 处理流式响应
    if (onUpdate) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let partialResponse: Partial<OpenRouterResponse> = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // 处理 SSE 格式的数据
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.substring(6));
              const content = data.choices[0]?.delta?.content || "";
              
              if (content) {
                try {
                  // 尝试解析部分 JSON
                  const jsonMatch = content.match(/\{.*\}/s);
                  if (jsonMatch) {
                    const jsonStr = jsonMatch[0];
                    try {
                      const parsedJson = JSON.parse(jsonStr);
                      partialResponse = { ...partialResponse, ...parsedJson };
                      onUpdate(partialResponse);
                    } catch (e) {
                      // JSON 不完整，继续等待
                    }
                  }
                } catch (e) {
                  console.error("解析流式响应时出错:", e);
                }
              }
            } catch (e) {
              console.error("处理 SSE 数据时出错:", e);
            }
          }
        }
      }

      // 确保返回完整的响应
      return partialResponse as OpenRouterResponse;
    } else {
      // 非流式响应
      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      
      try {
        // 尝试从内容中提取 JSON
        const jsonMatch = content.match(/\{.*\}/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error("无法从响应中提取 JSON");
      } catch (e) {
        console.error("解析 API 响应时出错:", e);
        throw new Error("解析响应失败");
      }
    }
  } catch (error) {
    console.error("调用 OpenRouter API 时出错:", error);
    throw error;
  }
}
