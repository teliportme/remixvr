AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('mouseleave', function(event) {
      
      // stop playig the sound once the cursor is no longer on the object.
      this.el.components.sound.stopSound();
    }.bind(this))
  }
});