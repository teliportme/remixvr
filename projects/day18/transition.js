// based on https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js
var transitionParams = {
  "useTexture": true,
  "transition": 0.1,
  "transitionSpeed": 2.0,
  "texture": 5,
  "loopTexture": true,
  "animateTransition": true,
  "textureThreshold": 0.3
};

function Transition ( sceneA, sceneB, renderer ) {
  this.effect = new THREE.VREffect(renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight); 
  this.scene = new THREE.Scene();
  this.cameraOrtho = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10, 100 );
  this.textures = [];
  for ( var i = 0; i < 6; i ++ )
    this.textures[ i ] = new THREE.TextureLoader().load( 'transition' + ( i + 1 ) + '.png' );
  this.quadmaterial = new THREE.ShaderMaterial( {
    uniforms: {
      tDiffuse1: {
        value: null
      },
      tDiffuse2: {
        value: null
      },
      mixRatio: {
        value: 0.0
      },
      threshold: {
        value: 0.1
      },
      useTexture: {
        value: 1
      },
      tMixTexture: {
        value: this.textures[ 0 ]
      }
    },
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
      "vUv = vec2( uv.x, uv.y );",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join( "\n" ),
    fragmentShader: [
      "uniform float mixRatio;",
      "uniform sampler2D tDiffuse1;",
      "uniform sampler2D tDiffuse2;",
      "uniform sampler2D tMixTexture;",
      "uniform int useTexture;",
      "uniform float threshold;",
      "varying vec2 vUv;",
      "void main() {",
      "vec4 texel1 = texture2D( tDiffuse1, vUv );",
      "vec4 texel2 = texture2D( tDiffuse2, vUv );",
      "if (useTexture==1) {",
        "vec4 transitionTexel = texture2D( tMixTexture, vUv );",
        "float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
        "float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);",
        "gl_FragColor = mix( texel1, texel2, mixf );",
      "} else {",
        "gl_FragColor = mix( texel2, texel1, mixRatio );",
      "}",
    "}"
    ].join( "\n" )
  } );
  quadgeometry = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );
  this.quad = new THREE.Mesh( quadgeometry, this.quadmaterial );
  this.scene.add( this.quad );
  // Link both scenes and their FBOs
  this.sceneA = sceneA;
  this.sceneB = sceneB;
  this.quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo.texture;
  this.quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo.texture;
  this.needChange = false;
  this.setTextureThreshold = function ( value ) {
    this.quadmaterial.uniforms.threshold.value = value;
  };
  this.useTexture = function ( value ) {
    this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0;
  };
  this.setTexture = function ( i ) {
    this.quadmaterial.uniforms.tMixTexture.value = this.textures[ i ];
  };
  this.render = function( ) {
    // Transition animation
    if ( transitionParams.animateTransition ) {
      var t = ( 1 + Math.sin( transitionParams.transitionSpeed * clock.getElapsedTime() / Math.PI ) ) / 2;
      transitionParams.transition = THREE.Math.smoothstep( t, 0.3, 0.7 );
      // Change the current alpha texture after each transition
      if ( transitionParams.loopTexture && ( transitionParams.transition == 0 || transitionParams.transition == 1 ) ) {
        if ( this.needChange ) {
          transitionParams.texture = ( transitionParams.texture + 1 ) % this.textures.length;
          this.quadmaterial.uniforms.tMixTexture.value = this.textures[ transitionParams.texture ];
          this.needChange = false;
        }
      } else
        this.needChange = true;
    }
    this.quadmaterial.uniforms.mixRatio.value = transitionParams.transition;
    // Prevent render both scenes when it's not necessary
    if ( transitionParams.transition == 0 ) {
      this.sceneB.render( false );
    } else if ( transitionParams.transition == 1 ) {
      this.sceneA.render( false );
    } else {
      // When 0<transition<1 render transition between two scenes
      this.sceneA.render( true );
      this.sceneB.render( true );
      this.effect.render( this.scene, this.cameraOrtho, null, true );
    }
  }
}
