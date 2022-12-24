# webrtc-peer-connection

simple webrtc connection via peers

### peer connection on same tab

```js
const pc1 = new RTCPeerConnection()
const pc2 = new RTCPeerConnection()

pc1.createOffer().
    .then((offer) => pc1.setLocalDescription(offer))
    .then(() => pc2.setRemoteDescription(pc1.localDescription))
    .then(() => pc2.createAnswer())
    .then((answer) => pc2.setLocalDescription(answer))
    .then(() => pc1.setRemoteDescription(pc2.localDescription))
```
