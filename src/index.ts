import { io } from "socket.io-client";
import { stunConfig } from "./config";
const socket = io(import.meta.env.VITE_SOCKET_PORT);

const pc = new RTCPeerConnection(stunConfig)

window.onload = () => {
  socket.emit('request_connection')
}

socket.on("new_connection", () => {
  pc.createOffer()
  .then(async offer => {
    await pc.setLocalDescription(offer)
    socket.emit('send_offer', offer)
  })
})

socket.on("receive_offer", async (offer) => {
  await pc.setRemoteDescription(offer as RTCSessionDescription)

  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)

  socket.emit("send_answer", pc.localDescription)
})

socket.on('receive_answer', (answer) => {
  pc.setRemoteDescription(answer)
})