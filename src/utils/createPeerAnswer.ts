import { Socket } from "socket.io-client";

export const createPeerAnswer = async (
  pc: RTCPeerConnection,
  offer: RTCSessionDescription,
  socket: Socket
) => {
  pc.setRemoteDescription(offer)
  .then(() => pc.createAnswer())
  .then((answer) => {
    // Set the local description to the SDP answer
    return pc.setLocalDescription(answer);
  })
  .then(() => {
    // Send the SDP answer to the other peer
    socket.emit("request_sdp", pc.localDescription);
  })
  .catch((error) => {
    console.error(error);
  });  
};
