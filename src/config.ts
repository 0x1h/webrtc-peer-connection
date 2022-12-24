export const stunConfig = {
  iceServers: [
    {
      urls: import.meta.env.VITE_STUN_SERVER,
    },
  ],
}