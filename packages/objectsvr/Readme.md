# ObjectsVR

Add and interact with objects on the screen.

## How does it work

It uses [`a-obj-model`](https://aframe.io/docs/0.8.0/primitives/a-obj-model.html) to load the OBJ formatted objects in the scene. It uses [a-frame asset management system](https://aframe.io/docs/0.8.0/core/asset-management-system.html) for better performance. 

Once the objects are loaded, then it uses a-frame [cursor](https://aframe.io/docs/0.8.0/components/cursor.html) to add a cursor to the scene. The cursor component is built on top of [raycaster](https://aframe.io/docs/0.8.0/components/raycaster.html) component, which in turn is mapped to [three.js raycaster](https://threejs.org/docs/#api/core/Raycaster). 

You can visualise it as a ray that is emitted our perpendicular to the camera. Once this ray intersects with something on the scene, we can perform our action based on it. a-frame emits events based on what happens with the cursor.

In our project, we're listening on the click event on the object to animate and play the sound associated with it.

Adding animations and interactivity with a-frame is straightforward. We use [a-animation](https://aframe.io/docs/0.8.0/core/animations.html) for adding the animations to our object. For associating the animations with the object, we can declaratively add it to HTML.

For example, in the following code, we add animations to the *bear* object by adding the `a-animation` tag inside the `a-obj-model`.

```html
<a-obj-model sound="on:click; src:#bear-sound;" cursor-listener src="#bear" mtl="#bear-mtl" scale="0.6 0.6 0.6" rotation="0 12.88 0" position="-0.167 1.45 -5.37">
  <a-animation begin="click" attribute="rotation" from="0 12.88 0" to="0 372.88 0" end="mouseleave" repeat="indefinite" dur="10000"></a-animation>
</a-obj-model>
```

Using the attributes of the component, we can set when to *begin* the animation, when to *end* it, what to animate and so on. In the above example, we've set the animation to start with the event *click* and end with *mouseleave* event.

We also use the built in [`sound`](https://aframe.io/docs/0.8.0/components/sound.html) component to play the sound when the object is *clicked* using the cursor.