import { createBot } from 'whatsapp-cloud-api';
import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
  const app = express()

  const from = '110984281875094';
  const token = 'EAALZCEgWBWH8BAEW7b6SlElQkZB1bLI3tEX7ORLXl0qJiZAflxT5IGZAm0HoVly7sxAKJP0LDJCFqjUNhFVq486cM92OvxnULVoLjqaS876GGvRT849gqOPnnNBXo9062SP7pKuG8ewECXN9NeZC9HCaQg0R9ZAFldHJAJ4ZAosmhddWasZAlY08mG4HTfYlEuNZA0caxRn9rZCNRYvCqTN4FYABxkQYqLVWgZD';

  const webhookVerifyToken = 'Cacpeg2023!';

  const bot = createBot(from, token);


  await bot.startExpressServer({
    webhookVerifyToken: webhookVerifyToken,
    port: 3000,
    webhookPath: `/custom/webhook`,
    useMiddleware: (app) => {
      app.use(cors()),
        app.post("/apis", async (req, res) => {
          let { mensaje, from } = req.body
          await bot.sendText(from, mensaje);
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

