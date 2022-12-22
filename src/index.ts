import { io } from "socket.io-client";
import { createPeerAnswer } from "./utils/createPeerAnswer";
import { sendSdpToPeer } from "./utils/sendSdptoPeer";
const socket = io("http://localhost:4000/");

const pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: import.meta.env.VITE_STUN_SERVER,
    },
  ],
});

socket.on("response_sdp", async (sdp) => await createPeerAnswer(pc, sdp, socket));

window.addEventListener("load", () => sendSdpToPeer(socket, pc));
