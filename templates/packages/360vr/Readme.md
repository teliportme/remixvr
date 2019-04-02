## 360 VR

This template can be used to create a simple VR hotspot tour using A-FRAME.

## How does it work?

When the cursor points over the hotspot and "clicks", `a-cursor` component emits click event. The `set-image` component set on the hotspot will update the image in `a-sky` based on the pano we provided.

We're also using `aframe-animation-component` to make smooth transitions between the panos.