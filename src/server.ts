import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

const app = fastify();

const prisma = new PrismaClient({
    log: ['query']
});

app.post('/events', async (request, reply) => {

    const createEventSchema = z.object({
        tittle: z.string().min(4),
        details: z.string().nullable(),
        maximunAttendees: z.number().int().positive().nullable(),
    })

    const data = createEventSchema.parse(request.body);

    const event = await prisma.event.create({
        data: {
            tittle: data.tittle,
            details: data.details,
            maximumAttendees: data.maximunAttendees,
            slug: new Date().toISOString()
        }
    })

    return reply.code(201).send({eventId : event.id});
})

app.listen({ port: 3333}).then(() => {
    console.log('Server is running on port 3333');
})