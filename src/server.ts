import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'
import generateSlug from "./utils/generate-slug";

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

    const slug = generateSlug(data.tittle);

    const eventWithSameSlug = await prisma.event.findUnique({
        where: {
            slug: slug,
        }
    })

    if(eventWithSameSlug !== null) {
        throw new Error('Event with same slug already exists')
    }

    const event = await prisma.event.create({
        data: {
            tittle: data.tittle,
            details: data.details,
            maximumAttendees: data.maximunAttendees,
            slug,
        }
    })

    return reply.code(201).send({eventId : event.id});
})

app.listen({ port: 3333}).then(() => {
    console.log('Server is running on port 3333');
})

function generateSlugt(tittle: string) {
    throw new Error("Function not implemented.");
}
