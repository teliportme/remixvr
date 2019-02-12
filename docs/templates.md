# Templates

RemixVR offers VR templates to help you create VR experiences faster.

The best way to understand VR templates is through an example.

Let's say there is a VR template for creating a VR tour. The scaffolding for the VR tour is the VR template.

This template can be used to create other VR experiences. The photos or any media added in the VR tour is part of the VR experience.

The VR templates simplifies creating similar VR experiences and makes it easy for anyone to get started with VR experiences.

Perhaps the biggest advantage is that when a VR template is created, it can be used to create a lot more VR experiences. For example, if a teacher wants to create a virtual field trip to pyramids in Egypt, she can get started by adding images to VR tour template and quickly use it in her class.

The same VR template can be used by another teacher to create a field trip to Peru. Although the content and the images are changed, the basic structure is similar. This basic structure is extracted to create a VR template.

And if they choose to make these VR experiences public, it can be reused in classrooms around the world.

The flexibility and options in a VR template is totally upto the developer. Anyone can create these VR templates with a few lines of code.

These templates will help others to customise their VR experiences for their classes.

## How do I create a VR template?

You can create a VR template by writing a few lines of code.

While RemixVR does not limit you to a certain framework, our recommendation is to use Aframe since it makes it easy to get started and encourages the use and reuse of components which in turn helps the community.

Let's create a simple VR template to see how it works. With this template, we'll create a simple 3D model viewer. So anyone can add a model to the scene and use it for any purpose.

In this tutorial, we'll be using Aframe.

```markup
<a-scene>
    <a-assets>
      <a-asset-item id="bear" src="./objects/Bear_Brown/Bear_Brown.obj"></a-asset-item>
      <a-asset-item id="bear-mtl" src="./objects/Bear_Brown/Bear_Brown.mtl"></a-asset-item>
    </a-assets>
    <a-sky color="#f2f2f2"> </a-sky>
    <!-- Bear -->
    <a-obj-model sound="on:click; src:#bear-sound;" src="#bear" mtl="#bear-mtl" scale="0.6 0.6 0.6" rotation="0 12.88 0" position="-0.167 1.45 -5.37">
    </a-obj-model>
  </a-scene>
```

In this simple VR experience, we've added a bear model to the scene. We'll be able to see a bear in our VR scene. Right now, anyone can update the model in the scene by changing a few lines of code.

In the future, there will be more non-coder friendly way to update the VR template and publish it without touching code.

