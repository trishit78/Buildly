import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';

import templateRouter from './routers/v1/index.router';

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


app.use('/templates',templateRouter);


// app.get("/test-gemini", async (req, res) => {
//   try {
//     const prompt = "create a todo app using react and nodejs";
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Enable chunked transfer
//     res.setHeader("Content-Type", "text/plain; charset=utf-8");
//     res.setHeader("Transfer-Encoding", "chunked");
//     res.setHeader("Cache-Control", "no-store");

//     const result = await model.generateContentStream(prompt);

//     // Stream chunks as they arrive
//     for await (const chunk of result.stream) {
//       const text = chunk.text();
//       if (text) {
//         res.write(text);
// console.log(text)
//     }

//     // End response when streaming is complete
//     res.end();
//   } 
// }catch (error : any) {
//     res.status(500).json({
//       status: "error",
//       message: error.message || "Unknown error",
//     });
//   }
// });

app.post('/admin', async (req, res) => {
    const {username} = req.body;
    res.json({message: `Welcome Admin, ${username}`});
});





app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
});
