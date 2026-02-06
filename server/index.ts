import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.static("client"));

let players: any = {};

io.on("connection", (socket) => {
    players[socket.id] = { id: socket.id, x: 0, z: 0 };
    io.emit("updateList", Object.values(players));

    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].z = data.z;
            socket.broadcast.emit("playerMoved", players[socket.id]);
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("updateList", Object.values(players));
    });
});

const PORT = 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
