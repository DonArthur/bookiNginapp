import { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

interface BookingRequest {
    propertyId: string;
    userId: string;
    checkInDate: string;
    checkOutDate: string;
}

export default async function bookingRoutes(fastify: FastifyInstance) {
    fastify.post('/api/bookings', async (request, reply) => {
        const { propertyId, userId, checkInDate, checkOutDate } = request.body as BookingRequest;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        try {
            const result = await prisma.$transaction(async (tx) => {
                const property = await tx.property.findUnique({
                    where: { id: propertyId },
                });

                if (!property) throw new Error('Property not found');

                const overlappingBookings = await tx.booking.count({
                    where: {
                        propertyId: propertyId,
                        status: 'CONFIRMED',
                        AND: [
                            { checkInDate: { lt: checkOut } },
                            { checkOutDate: { gt: checkIn } },
                        ],
                    },
                });

                if (overlappingBookings >= property.totalRooms) {
                    throw new Error('No available rooms for the selected dates');
                }

                const timeDifference = checkOut.getTime() - checkIn.getTime();
                const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
                const totalPrice = nights * Number(property.pricePerNight);

                const newBooking = await tx.booking.create({
                    data: {
                        userId,
                        propertyId,
                        checkInDate: checkIn,
                        checkOutDate: checkOut,
                        totalPrice,
                        status: 'CONFIRMED',
                    },
                });
                return newBooking;
            });
            return reply.status(201).send(result);
        } catch (error: any) {
            fastify.log.error(error);
            return reply.status(409).send({ error: error.message || 'Failed to create booking.' });
        }
    });
}