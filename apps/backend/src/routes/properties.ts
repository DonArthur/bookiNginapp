import { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

export default async function propertyRoutes(fastify: FastifyInstance) {
    fastify.get('/api/properties', async (request, reply) => {
        try {
            const properties = await prisma.property.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return properties;
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'An error occurred while fetching properties.' });
        }
    });

    fastify.get('/api/properties/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            const property = await prisma.property.findUnique({
                where: { id: id },
            });
            if (!property) {
                return reply.status(404).send({ error: 'Property not found.' });
            }
            return property;
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'An error occurred while fetching the property.' });
        }
    });
}