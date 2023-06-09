import { createBot } from 'whatsapp-cloud-api';
import cors from 'cors';
import express from 'express';
// or if using require:
// const { createBot } = require('whatsapp-cloud-api');
const bot = createBot();

const app = express()


import { createBot } from 'whatsapp-cloud-api';
// or if using require:
// const { createBot } = require('whatsapp-cloud-api');

(async () => {
  try {
    // replace the values below
    const from = '110984281875094';
    const token = 'EAALZCEgWBWH8BABlJmmB58E3ottmLuku988wqjFAak63dJdZAfKwYZBzJH2xoDPJ8UpSxQcCLd9HRCVb7QkE6lrYrW5jBH9cgZB1ZAFBwoExXcZAHZAxDIAifuh1LzvF0r0dUw9ibGIYMtdG5AoedZCzYzZBVkZCM7mneQTY2UT0yEi64zHrsbnr1e56YIyM7RBQEY6q7guEEO9JcV40ckEbZAl1lDpA4S4EsoZD';
    const to = 'PHONE_NUMBER_OF_RECIPIENT';
    const webhookVerifyToken = 'Cacpeg2023!';

    // Create a bot that can send messages
    const bot = createBot(from, token);

    // Send text message
    //const result = await bot.sendText(to, 'Hello world');

    // Start express server to listen for incoming messages
    // NOTE: See below under `Documentation/Tutorial` to learn how
    // you can verify the webhook URL and make the server publicly available

    await bot.startExpressServer({
      webhookVerifyToken: 'my-verification-token',
      port: 3000,
      webhookPath: `/custom/webhook`,
      useMiddleware: (app) => {
        app.use(cors()),
          app.get("/apis", (req, res) => {
            res.send("Hola Mundo")
          })
      },
    });
    // Listen to ALL incoming messages
    // NOTE: remember to always run: await bot.startExpressServer() first
    bot.on('message', async (msg) => {
      console.log(msg);

      if (msg.type === 'text') {
        await bot.sendText(msg.from, 'Received your text message!');
      } else if (msg.type === 'image') {
        await bot.sendText(msg.from, 'Received your image!');
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
