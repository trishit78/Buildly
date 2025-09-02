import express, { Request, Response } from 'express';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { BASE_PROMPT } from '../../utils/prompts';
import { reactbasePrompt } from '../../utils/react';
import { nodebasePrompt } from '../../utils/node';

const templateRouter = express.Router();
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
export interface TemplateResponse {
  prompts: string[];
  uiPrompts: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function callGemini(messages: AIMessage[], maxTokens: number): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
  });

  const userMessage = messages[messages.length - 1].content;
  const result = await chat.sendMessage(userMessage);
  const response = await result.response;
  return response.text();
} 


templateRouter.post("/", async (req:Request, res:Response):Promise<any> => {
    const prompt = req.body.prompt  as string;
    
    const messages: AIMessage[] = [
        { role: 'user', content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra\n\n" + prompt    
        },

    ];

    try {
        const answer = (await callGemini(messages, 200)).trim().toLowerCase();
        if ( answer === 'react') {
            const response: TemplateResponse = {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactbasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n `,
        ],
        uiPrompts: [reactbasePrompt],
      };
      res.json(response);
        
        }else if (answer === 'node') {
      const response: TemplateResponse = {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodebasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodebasePrompt],
      };
      res.json(response);
    }

         else {
      const errorResponse: string | any = { error: "You can't access this" };
      res.status(403).json(errorResponse);
    }
    } catch (error:string| any) {
        const errorResponse = error;
        return res.status(500).json({ status: "error", message: errorResponse.message || "Unknown error" });
    }

});

export default templateRouter;