# ParticleVR

Create particle effects on top of 360 images.

### How does it work

We use a-frame component called [a-sky](https://aframe.io/docs/0.8.0/primitives/a-sky.html) to add the pano to the scene. And we're using  `aframe-particle-system-component` to create the particle effects like raining and snowing.

That a-frame component in turn uses [Shader Particle Engine](https://github.com/squarefeet/ShaderParticleEngine) to work with threejs to create the effect.