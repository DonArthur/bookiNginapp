import { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

export default async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/api/users/:id/bookings', async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            const bookings = await prisma.booking.findMany({
                where: { userId: id },
                orderBy: { checkInDate: 'asc' },
                include: {
                    property: {
                        select: {
                            title: true,
                            description: true,
                        },
                    }
                },
            });
            if (!bookings || bookings.length === 0) {
                return reply.status(404).send({ error: 'No bookings found for this user.' });
            }
            return bookings;
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'An error occurred while fetching user bookings.' });
        }
    });
}