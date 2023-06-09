import { createBot } from 'whatsapp-cloud-api';
import cors from 'cors';
import express from 'express';
// or if using require:
// const { createBot } = require('whatsapp-cloud-api');
const bot = createBot();

const app = express()



await bot.startExpressServer({
  webhookVerifyToken: 'my-verification-token',
  port: 3000,
  webhookPath: `/custom/webhook`,  
  useMiddleware: (app) => {
    app.use(cors()),
    app.get("/apis",(req,res)=>{
      res.send("Hola Mundo")
    })
  },
});