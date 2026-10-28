const { Server } = require("socket.io");

function initializeSocket(server) {
    const io = new Server(server, {
       cors: {
            origin: [
                process.env.CLIENT_URL || "http://localhost:5173",
                "https://arremata-app.vercel.app",
            ],
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);

        socket.on("lot:join", async ({ lotId }) => {
            if (!Number.isInteger(Number(lotId)) || Number(lotId) <= 0) {
                return;
            }

            const room = `lot:${Number(lotId)}`;

            await socket.join(room);

            console.log(`Cliente ${socket.id} entrou na sala ${room}`);
        });

        socket.on("lot:leave", async ({ lotId }) => {
            if (!Number.isInteger(Number(lotId)) || Number(lotId) <= 0) {
                return;
            }

            await socket.leave(`lot:${Number(lotId)}`);
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });

    return io;
}

module.exports = { initializeSocket };