import { stunConfig } from "./config";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_PORT);

const startButton = document.querySelector(
  ".start-camera"
) as HTMLButtonElement;

export type messageType = {
  candidate: string | null;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
};

let pc: RTCPeerConnection;
let localStream: MediaStream;
const localVideo = document.querySelector(".me") as HTMLVideoElement;
const remoteVideo = document.querySelector(".peer") as HTMLVideoElement;

const createPeerConnection = async () => {
  pc = new RTCPeerConnection(stunConfig);

  pc.onicecandidate = ({ candidate }) => {
    console.log("[Candidate] Generated Candidate");

    const message: messageType = {
      candidate: null,
    };

    if (candidate) {
      message.candidate = candidate.candidate;
      message.sdpMid = candidate.sdpMid;
      message.sdpMLineIndex = candidate.sdpMLineIndex;
    }

    socket.emit("send_candidate", message);
  };

  pc.addEventListener("track", (e) => {
    remoteVideo.srcObject = e.streams[0];
  });

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
};

const makeCall = async () => {
  await createPeerConnection();

  const offer = await pc.createOffer();
  socket.emit("send_offer", offer), pc.setLocalDescription(offer);
  pc.setLocalDescription(offer);
};

const startVideoCall = async () => {
  console.log("[Local] Sent Join Request");
  localStream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })
  localVideo.srcObject = localStream;

  startButton.disabled = true;
  socket.emit("send_join");
};

startButton.onclick = startVideoCall;

const handleOffer = async (offer: RTCSessionDescription) => {
  if (pc) {
    console.error("Existing Peer Connection");
    return;
  }

  await createPeerConnection();

  await (pc as RTCPeerConnection).setRemoteDescription(offer);
  const answer = await (pc as RTCPeerConnection).createAnswer(offer);

  socket.emit("send_answer", answer);
  await (pc as RTCPeerConnection).setLocalDescription(answer);
};

// Socket Handlers
socket.on("join", () => {
  console.log("[Socket] Received Join Request");

  if (!localStream) {
    console.log("Not Ready Yet");
    return;
  }

  if (pc) {
    console.log("already in call, ignoring...");
    return;
  }

  makeCall();
});

socket.on("offer", (offer) => {
  console.log("[Socket] Received Offer");

  if (!localStream) {
    console.log("Not Ready Yet");
    return;
  }

  if (pc) {
    console.error("[ERROR] Existing Peer Connection");
    return;
  }

  handleOffer(offer);
});

socket.on("answer", (answer) => {
  console.log("[Socket] Received Answer");

  if (!localStream) {
    console.log("Not Ready Yet");
    return;
  }

  if (!pc) {
    console.error("no peerconnection");
    return;
  }

  pc.setRemoteDescription(answer);
});

socket.on("candidate", (candidate: RTCIceCandidate) => {
  console.log("[Socket] Received Candidate");

  if (!localStream) {
    console.log("Not Ready Yet");
    return;
  }

  if (!pc) {
    console.log("No Peer Connection");
    return;
  }

  if (candidate.candidate) {
    console.log('[Socket]', candidate)
    pc.addIceCandidate(candidate);
  }
});
