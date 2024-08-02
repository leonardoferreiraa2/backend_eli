"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_client = require("@prisma/client");
var import_zod = require("zod");
var import_cors = __toESM(require("@fastify/cors"));
var app = (0, import_fastify.default)();
var createSalaSchema = import_zod.z.object({
  titulo: import_zod.z.string(),
  texto: import_zod.z.string(),
  urlAudio: import_zod.z.string(),
  urlFoto: import_zod.z.string(),
  urlVideo: import_zod.z.string()
});
app.register(import_cors.default, {
  origin: ["https://frontend-salas.vercel.app"],
  methods: ["GET", "POST", "DELETE", "UPDATE"],
  credentials: true
});
var prisma = new import_client.PrismaClient();
app.get("/salas", async () => {
  const salas = await prisma.sala.findMany();
  return { salas };
});
app.get("/salas/:id", async (request, reply) => {
  const { id } = request.params;
  const sala = await prisma.sala.findUnique({
    where: { id }
  });
  if (!sala) {
    return reply.status(404).send({ error: `id not found: ${id}` });
  }
  return { sala };
});
app.post("/salas", async (request, reply) => {
  const {
    titulo,
    texto,
    urlAudio,
    urlFoto,
    urlVideo
  } = createSalaSchema.parse(request.body);
  const conflictingSala = await prisma.sala.findFirst({
    where: {
      titulo
    }
  });
  if (conflictingSala) {
    return reply.status(400).send({ error: `J\xE1 existe uma sala com o t\xEDtulo: ${titulo}` });
  }
  const newSala = await prisma.sala.create({
    data: {
      titulo,
      texto,
      urlAudio,
      urlFoto,
      urlVideo
    }
  });
  return reply.status(201).send({ newSala });
});
app.put("/salas/update/:id", async (request, reply) => {
  const { id } = request.params;
  const sala = await prisma.sala.findUnique({
    where: { id }
  });
  if (!sala) {
    return reply.status(404).send({ error: `id not found: ${id}` });
  }
  const {
    titulo,
    texto,
    urlAudio,
    urlFoto,
    urlVideo
  } = createSalaSchema.parse(request.body);
  const conflictingSala = await prisma.sala.findFirst({
    where: {
      titulo,
      NOT: {
        id
        // Exclui a sala que está sendo atualizada da busca
      }
    }
  });
  if (conflictingSala) {
    return reply.status(400).send({ error: `J\xE1 existe uma sala com o t\xEDtulo: ${titulo}` });
  }
  const updatedSala = await prisma.sala.update({
    where: { id },
    data: {
      titulo,
      texto,
      urlAudio,
      urlFoto,
      urlVideo
    }
  });
  return reply.status(200).send({ updatedSala });
});
app.delete("/salas/delete/:id", async (request, reply) => {
  const { id } = request.params;
  const sala = await prisma.sala.findUnique({
    where: { id }
  });
  if (!sala) {
    return reply.status(404).send({ error: `id not found: ${id}` });
  }
  await prisma.sala.delete({
    where: { id }
  });
  return reply.status(201).send({ message: "Sala deletada com sucesso!" });
  ;
});
app.listen({
  host: "0.0.0.0",
  port: Number(process.env.PORT) || 3001
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
