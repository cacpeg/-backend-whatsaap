import { createBot } from 'whatsapp-cloud-api';
import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
  const app = express()

  const from = '110984281875094';
  const token = 'EAALZCEgWBWH8BAKLOIaXuMfV2004iBXFO9bxGVSkyYBm51nhwKPxwzLuLY39q2V3wGd9TWb2ZAqeFgBN3rUoLQAYSovsuAheSv0m1bf4F8nMqOKJjntI4jYHgUZCS0dZAb00ZCIJ6YY04pBw4FvxCZBj9M3zpCuhZA2ZAp0dBdtP6tUWxNAZBPplwC5eUiZCa7lyhnC49RgC76OIpx5UdCaR498hvZABxlcrE4ZD';

  const webhookVerifyToken = 'Cacpeg2023!';

  const bot = createBot(from, token);


  await bot.startExpressServer({
    webhookVerifyToken: webhookVerifyToken,
    port: 3000,
    webhookPath: `/custom/webhook`,
    useMiddleware: (app) => {
      app.use(cors()),
        app.post("/apis", async (req, res) => {
          try {
            let { mensaje, from } = req.body
            await bot.sendText(from, mensaje);
            return res.json({ "ok": true })
          } catch (error) {
            return res.json({ "ok": false, "error": error })
          }
        })
      app.get("/apis/consul", async (req, res) => {
        return res.send("Is Running")
      })
    },
  });

  bot.on('message', async (msg) => {
    console.log(msg);
    const date = new Date();
    try {


      date.setTime(msg.timestamp * 1000);
      date.setHours(date.getHours() - 5);
      const user = await prisma.usuario.upsert({
        where: { telefono: msg.from },
        update: {},
        create: {
          nombre: msg.name,
          telefono: msg.from
        },
      })

      const conversacion = await prisma.listConversacion.upsert({
        where: { id: `${date.toLocaleDateString() + user.id}` },
        update: {},
        create: {
          id: `${date.toLocaleDateString() + user.id}`,
          llave: date.toLocaleDateString(),
          UsuarioId: user.id
        },
      })

      const message = await prisma.message.create({
        data: {
          from: msg.from,
          name: msg.name,
          timestamp: date.toISOString(),
          type: msg.type,
          usuario: { connect: { id: user.id } },
          conversacion: { connect: { id: conversacion.id } },

        }
      })

      const data = await prisma.data.create({
        data: {
          text: msg.data.text,
          messageId: message.id
        }
      })



      console.log(date.toISOString()); // Imprime la fecha en formato ISO
      console.log(date.toLocaleDateString());
      if (msg.type === 'text') {
        await bot.sendText(msg.from, 'Received your text message!');
      } else if (msg.type === 'image') {
        await bot.sendText(msg.from, 'Received your image!');
      }
    } catch (error) {
      console.error('Error recibe mensaje:', error);
    }
  });
}

main()
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    prisma.$disconnect();
  });

