import { PrismaClient } from "@prisma/client"
import fastify from "fastify"
import { number, z } from "zod"

const app = fastify()

const prisma = new PrismaClient()

app.get('/salas', async () => {
    const salas = await prisma.sala.findMany()

    return { salas }
})

app.get('/salas/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const sala = await prisma.sala.findUnique({
        where: { id }
    })

    if (!sala) {
        return reply.status(404).send({ error: 'Sala not found' })
    }

    return { sala }
})

app.post('/salas', async (request, reply) => {
    const createSalaSchema = z.object({
        titulo: z.string(), 
        texto: z.string(),
        urlAudio: z.string(), 
        urlFoto: z.string(), 
        urlVideo: z.string(),
    })

    const { 
        titulo, 
        texto, 
        urlAudio, 
        urlFoto, 
        urlVideo
    } = createSalaSchema.parse(request.body)

    await prisma.sala.create({
        data: {
            titulo, 
            texto, 
            urlAudio, 
            urlFoto, 
            urlVideo
        }
    })

    return reply.status(201).send()
})

app.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT),
}).then(() => {
    console.log('Server runing')
})