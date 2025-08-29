import express from 'express';

import { AIMessage, callGemini } from './index.router';
import { getSystemPrompt } from '../../utils/prompts';


export interface ChatResponse {
  response: string;
}

const chatRouter = express.Router();

chatRouter.get("/",async (req, res) => {
    res.send("Chat endpoint is working");   
});


chatRouter.post("/",async (req, res) => {
    const message = req.body.message as any[];
     try {
    const messages: AIMessage[] = [
      {
        role: 'user',
        content: `${getSystemPrompt()}\n\n` + message.map((m: any) => m.content).join('\n'),
      },
    ];

    const output = await callGemini(messages, 8000);
    
    const response: ChatResponse = {
      response: output,
    };
    console.log(response);
    res.json(response);
  } catch (error) {
    const errorResponse = { error: 'Failed to process chat request' };
    res.status(500).json(errorResponse);
  }


   
});

export default chatRouter;