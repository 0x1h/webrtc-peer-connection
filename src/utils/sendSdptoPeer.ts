import { Socket } from "socket.io-client";

export const sendSdpToPeer = async (socket: Socket, pc: RTCPeerConnection) => {
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("request_sdp", pc.localDescription);
  } catch (err) {
    throw new Error(err as string);
  }
};
