export const stunConfig = {
  iceServers: [
    {
      urls: import.meta.env.VITE_STUN_SERVER,
    },
  ],
}

export const cameraConfigs = {
  audio: false,
  video: {
   facingMode: 'user'
  }
};