
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, LeaveRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getAIResponse = async (
  prompt: string,
  history: { role: 'user' | 'assistant', content: string }[],
  context: { attendance: AttendanceRecord[], leaveRequests: LeaveRequest[] }
) => {
  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      당신은 회사 내 근태 및 HR 시스템의 'ZenWork AI'입니다. 
      사용자의 근태 기록과 휴가 신청 데이터를 바탕으로 답변하세요.
      
      현재 사용자 데이터:
      - 근태 기록: ${JSON.stringify(context.attendance)}
      - 휴가 신청: ${JSON.stringify(context.leaveRequests)}
      
      사용자에게 친절하고 전문적으로 답변하며, 한국어를 사용하세요. 
      출퇴근 시간 분석, 잔여 연차 조언, 인사 규정 안내 등을 수행할 수 있습니다.
    `;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. AI 서비스에 연결하는 중 오류가 발생했습니다.";
  }
};
