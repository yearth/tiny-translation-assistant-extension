/**
 * Gemini API 工具类
 */
import { GoogleGenAI } from "@google/genai";

// 定义响应类型
export interface GeminiResponse {
  meaning: string;
  contextualMeaning: string;
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
  "meaning": "含义",
  "contextualMeaning": "尽量简短得用一句话解释它在上下文中的含义",
  "dictionaryDefinition": "词典定义",
  "exampleSentence": "示例句子"
}

举例：
recognize
{
  "meaning": "识别",
  "contextualMeaning": "在上下文中，'识别'表示浏览器和辅助技术能够理解和察觉诸如WAI-ARIA所提供的额外语义，以便向用户传达界面内容的状态和功能。",
  "dictionaryDefinition": "意识到或承认某事物的存在、有效性或身份",
  "exampleSentence": " I can recognize her from a distance. 我能从远处识别她。"
}

请直接以 JSON 格式回答，不要有任何其他文字。`;
}

/**
 * 调用 Gemini API 获取翻译结果
 * @param apiKey Gemini API 密钥
 * @param word 选中的单词
 * @param context 上下文
 * @param onUpdate 流式更新回调
 * @returns Promise<GeminiResponse>
 */
export async function translateWithGemini(
  apiKey: string,
  word: string,
  context: string,
  onUpdate?: (partialResponse: Partial<GeminiResponse>) => void
): Promise<GeminiResponse> {
  const prompt = buildPrompt(word, context);
  const genAI = new GoogleGenAI({ apiKey });

  try {
    let partialResponse: Partial<GeminiResponse> = {};
    let buffer = "";

    const contents = [{ role: "user", parts: [{ text: prompt }] }];

    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-pro-exp-03-25",
      contents,
    });

    for await (const chunk of response) {
      console.log("Gemini API 响应 chunk:", chunk.text);

      if (chunk.text) {
        buffer += chunk.text;

        // 将累积的文本添加到响应中
        try {
          // 尝试解析部分 JSON
          const jsonMatch = buffer.match(/\{.*\}/s);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            try {
              const parsedJson = JSON.parse(jsonStr);
              partialResponse = { ...partialResponse, ...parsedJson };
              if (onUpdate) {
                onUpdate(partialResponse);
              }
            } catch (e) {
              // JSON 不完整，继续等待
            }
          }
        } catch (e) {
          console.error("解析流式响应时出错:", e);
        }
      }
    }

    console.log("Gemini API 响应 buffer:", buffer);

    // 最后一次尝试解析完整的响应
    try {
      const jsonMatch = buffer.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsedJson = JSON.parse(jsonStr);
        partialResponse = { ...partialResponse, ...parsedJson };
        if (onUpdate) {
          onUpdate(partialResponse);
        }
      }
    } catch (e) {
      console.error("解析最终响应时出错:", e);
    }

    // 如果没有解析出完整的响应，提供一个默认响应
    if (!partialResponse.meaning) {
      partialResponse.meaning = word;
    }
    if (!partialResponse.contextualMeaning) {
      partialResponse.contextualMeaning = "无法解析 AI 返回的上下文含义。";
    }
    if (!partialResponse.dictionaryDefinition) {
      partialResponse.dictionaryDefinition = "无法解析 AI 返回的定义。";
    }
    if (!partialResponse.exampleSentence) {
      partialResponse.exampleSentence = "无法解析 AI 返回的示例句子。";
    }

    return partialResponse as GeminiResponse;
  } catch (error) {
    console.error("调用 Gemini API 时出错:", error);
    throw error;
  }
}
