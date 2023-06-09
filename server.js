import { createBot } from 'whatsapp-cloud-api';
import cors from 'cors';
import express from 'express';
// or if using require:
// const { createBot } = require('whatsapp-cloud-api');






(async () => {
  try {
    const app = express()

    const from = '110984281875094';
    const token = 'EAALZCEgWBWH8BABlJmmB58E3ottmLuku988wqjFAak63dJdZAfKwYZBzJH2xoDPJ8UpSxQcCLd9HRCVb7QkE6lrYrW5jBH9cgZB1ZAFBwoExXcZAHZAxDIAifuh1LzvF0r0dUw9ibGIYMtdG5AoedZCzYzZBVkZCM7mneQTY2UT0yEi64zHrsbnr1e56YIyM7RBQEY6q7guEEO9JcV40ckEbZAl1lDpA4S4EsoZD';

    const webhookVerifyToken = 'Cacpeg2023!';

    const bot = createBot(from, token);


    await bot.startExpressServer({
      webhookVerifyToken: webhookVerifyToken,
      port: 3000,
      webhookPath: `/custom/webhook`,
      useMiddleware: (app) => {
        app.use(cors()),
          app.get("/apis", async (req, res) => {
            let { mensaje, from } = req.body
            await bot.sendText(from, mensaje);
          })
      },
    });

    bot.on('message', async (msg) => {
      console.log(msg);
      const user = await prisma.usuario.upsert({
        where: { telefono:msg.from  },
        update: {},
        create: { 
          nombre:msg.name,
          telefono:msg.from
         },
      })
      const date = new Date();
      date.setTime(msg.timestamp * 1000);

      console.log(date.toISOString()); // Imprime la fecha en formato ISO
      console.log(date.toLocaleDateString());
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

