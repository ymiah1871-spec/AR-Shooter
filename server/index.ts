import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { Server } from "socket.io"; // মাল্টিপ্লেয়ারের জন্য

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// মাল্টিপ্লেয়ার লজিক
io.on("connection", (socket) => {
  log(`একজন বন্ধু জয়েন করেছে: ${socket.id}`);
  
  socket.on("monsterHit", (data) => {
    // একজনের হিট সবার কাছে পাঠিয়ে দেওয়া
    io.emit("monsterDamaged", data);
  });

  socket.on("disconnect", () => {
    log("একজন বন্ধু ডিসকানেক্ট হয়েছে");
  });
});

(async () => {
  const server = registerRoutes(app);
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }
  const PORT = 5000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    log(`গেমটি পোর্ট ${PORT} এ চলছে`);
  });
})();
