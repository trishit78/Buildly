import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { GenerateContentResult, GoogleGenerativeAI } from '@google/generative-ai';


const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Request counter to track usage
let requestCount = 0;
let lastResetTime = Date.now();

// Reset counter every minute
setInterval(() => {
    requestCount = 0;
    lastResetTime = Date.now();
    console.log("Request counter reset");
}, 60000);




async function makeGeminiRequest(prompt: string, maxRetries = 3): Promise<GenerateContentResult> {
    // Check if we're approaching the limit (14 out of 15 requests per minute)
    if (requestCount >= 14) {
        const timeToWait = 60000 - (Date.now() - lastResetTime);
        if (timeToWait > 0) {
            console.log(`Approaching rate limit. Waiting ${timeToWait}ms...`);
            await delay(timeToWait);
            requestCount = 0;
            lastResetTime = Date.now();
        }
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // ONLY use gemini-1.5-flash (15 requests/min limit)
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: {
                    maxOutputTokens: 4000,
                    temperature: 0.7
                }
            });

            requestCount++;
            console.log(`Making request ${requestCount}/15 (attempt ${attempt}/${maxRetries})`);
            
            const result = await model.generateContent(prompt);
            return result;

        } catch (error: any) {
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (error.status === 429) {
                // Extract retry delay or use default
                let retryDelay = 60000; // Default 1 minute
                
                if (error.errorDetails) {
                    for (const detail of error.errorDetails) {
                        if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo' && detail.retryDelay) {
                            const delayMatch = detail.retryDelay.match(/(\d+)s/);
                            if (delayMatch) {
                                retryDelay = parseInt(delayMatch[1]) * 1000;
                            }
                        }
                    }
                }
                
                if (attempt < maxRetries) {
                    console.log(`Rate limited. Waiting ${retryDelay}ms before retry ${attempt + 1}...`);
                    await delay(retryDelay);
                    requestCount = 0; // Reset counter after waiting
                    lastResetTime = Date.now();
                } else {
                    throw error; // Final attempt failed
                }
            } else {
                throw error; // Non-rate-limit error
            }
        }
    }
    throw new Error("Failed to get response from Gemini");
}



app.get('/test-gemini', async (req, res) => {
  try {
    const prompt = "tell me in 100 words about india?";
    const result = await makeGeminiRequest(prompt);

    // Extract text response
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "No text found";
   // console.log(result);

     res.set('Cache-Control', 'no-store');
    res.json({
      status: "success",
      output: responseText,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Unknown error",
    });
  }
});

app.post('/admin', async (req, res) => {
    const {username} = req.body;
    res.json({message: `Welcome Admin, ${username}`});
});



app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
});
