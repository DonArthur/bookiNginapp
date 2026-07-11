import Fastify from "fastify";
import propertyRoutes from "./routes/properties.js";
import bookingRoutes from "./routes/bookings.js";
import userRoutes from "./routes/users.js";

const fastify = Fastify({
    logger: true, // Automatically logs requests and responses
});

fastify.get("/health", async (request, reply) => {
    return { status: "OK", message: "bookiNginapp backend is running!" };
});

fastify.register(propertyRoutes);
fastify.register(bookingRoutes);
fastify.register(userRoutes);

const start = async () => {
    try {
        await fastify.listen({ port: 5000, host: "0.0.0.0" });
        console.log("Server is running on http://localhost:5000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
