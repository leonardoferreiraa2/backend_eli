import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import cors from '@fastify/cors';

const app = Fastify();

// Enable CORS
app.register(cors, {
    origin: ["https://frontend-salas.vercel.app"],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
    credentials: true
})

// Inicializa o Prisma Client
const prisma = new PrismaClient();

// Endpoint para listar todas as salas
app.get('/salas', async () => {
  const salas = await prisma.sala.findMany();
  return { salas };
});

// Endpoint para obter uma sala específica
app.get('/salas/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    return reply.status(404).send({ error: `id not found: ${id}` });
  }

  return { sala };
});

// Endpoint para criar uma nova sala
app.post('/salas', async (request, reply) => {
  const createSalaSchema = z.object({
    titulo: z.string(),
    texto: z.string(),
    urlAudio: z.string(),
    urlFoto: z.string(),
    urlVideo: z.string(),
  });

  const {
    titulo,
    texto,
    urlAudio,
    urlFoto,
    urlVideo,
  } = createSalaSchema.parse(request.body);

  const newSala = await prisma.sala.create({
    data: {
      titulo,
      texto,
      urlAudio,
      urlFoto,
      urlVideo,
    },
  });

  return reply.status(201).send({ newSala });
});

// Endpoint para obter uma sala específica
app.delete('/salas/delete/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    return reply.status(404).send({ error: `id not found: ${id}` });
  }

  // Delete a sala
  await prisma.sala.delete({
      where: { id: id },
  });

  return reply.status(201).send({ message: "Sala deletada com sucesso!" });;
});

// Inicia o servidor
app.listen({
  host: '0.0.0.0',
  port: Number(process.env.PORT) || 3001,
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
