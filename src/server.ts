import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import cors from '@fastify/cors';

const app = Fastify();

const createSalaSchema = z.object({
  titulo: z.string(),
  texto: z.string(),
  urlAudio: z.string(),
  urlFoto: z.string(),
  urlVideo: z.string(),
});

const urlFront = "https://frontend-salas.vercel.app"

// Enable CORS
app.register(cors, {
    origin: [urlFront],
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
  const {
    titulo,
    texto,
    urlAudio,
    urlFoto,
    urlVideo,
  } = createSalaSchema.parse(request.body);

  // Verifica se outro registro com o mesmo título já existe
  const conflictingSala = await prisma.sala.findFirst({
    where: {
      titulo: titulo,
    },
  });

  if (conflictingSala) {
    return reply.status(400).send({ error: `Já existe uma sala com o título: ${titulo}` });
  }

  const newSala = await prisma.sala.create({
    data: {
      titulo,
      texto,
      urlAudio,
      urlFoto,
      urlVideo,
    },
  });

  const parseSala = {
    urlSala: urlFront + '/' + newSala.id,
    id: newSala.id,
    titulo: newSala.titulo,
    texto: newSala.texto,
    urlFoto: newSala.urlFoto,
    urlAudio: newSala.urlAudio,
    urlVideo: newSala.urlVideo,
  }

  return reply.status(201).send({ parseSala });
});

// Endpoint para atualizar uma sala específica
app.put('/salas/update/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    return reply.status(404).send({ error: `id not found: ${id}` });
  }

  const {
    titulo,
    texto,
    urlAudio,
    urlFoto,
    urlVideo,
  } = createSalaSchema.parse(request.body);

  // Verifica se outro registro com o mesmo título já existe
  const conflictingSala = await prisma.sala.findFirst({
    where: {
      titulo: titulo,
      NOT: {
        id: id, // Exclui a sala que está sendo atualizada da busca
      },
    },
  });

  if (conflictingSala) {
    return reply.status(400).send({ error: `Já existe uma sala com o título: ${titulo}` });
  }

  const updatedSala = await prisma.sala.update({
      where: { id },
      data: {
        titulo,
        texto,
        urlAudio,
        urlFoto,
        urlVideo,
      },
    });

  const parseSala = {
      urlSala: urlFront + '/' + updatedSala.id,
      id: updatedSala.id,
      titulo: updatedSala.titulo,
      texto: updatedSala.texto,
      urlFoto: updatedSala.urlFoto,
      urlAudio: updatedSala.urlAudio,
      urlVideo: updatedSala.urlVideo,
    }

  return reply.status(200).send({ parseSala });
});

// Endpoint para deletar uma sala específica
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
