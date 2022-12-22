import express from "express";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.use(cors());

app.get("/", (_, res) => {
  res.send({
    msg: "Everything is good ✅",
  });
});

// Get SDP string and give other peers response
io.on("connection", (socket) => {
  socket.on("request_sdp", (sdp) => {
    socket.broadcast.emit("response_sdp", sdp);
  });
});

const port = 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
