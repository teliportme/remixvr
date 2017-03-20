/// <reference path="typings/threejs/three.d.ts"/>
/*! Reticulum - v2.0.2 - 2015-12-17
 * http://skezo.github.io/examples/basic.html
 *
 * Copyright (c) 2015 Skezo;
 * Licensed under the MIT license */

var Reticulum = (function () {
    var INTERSECTED = null;

    var collisionList = [];
    var raycaster;
    var vector;
    var clock;
    var reticle = {};
    var fuse = {};

    var frustum;
    var cameraViewProjectionMatrix;

    var parentContainer

    //Settings from user
    var settings = {
        camera:             null, //Required
        proximity:          false,
        isClickEnabled:     true,
        lockDistance:       false
    };

    //Utilities
    var utilities = {
        clampBottom: function ( x, a ) {
            return x < a ? a : x;
        }
    }

    //Vibrate
    var vibrate = navigator.vibrate ? navigator.vibrate.bind(navigator) : function(){};

    //Fuse
    fuse.initiate = function( options ) {
        var parameters = options || {};

        this.visible        = parameters.visible            !== false; //default to true;
        this.globalDuration = parameters.duration           ||  2.5;
        this.vibratePattern = parameters.vibrate            ||  100;
        this.color          = parameters.color              ||  0x00fff6;
        this.innerRadius    = parameters.innerRadius        ||  reticle.innerRadiusTo;
        this.outerRadius    = parameters.outerRadius        ||  reticle.outerRadiusTo;
        this.clickCancel    = parameters.clickCancelFuse    === undefined ? false : parameters.clickCancelFuse; //default to false;
        this.phiSegments    = 3;
        this.thetaSegments  = 32;
        this.thetaStart     = Math.PI/2;
        this.duration       = this.globalDuration;

        //var geometry = new THREE.CircleGeometry( reticle.outerRadiusTo, 32, Math.PI/2, 0 );
        var geometry = new THREE.RingGeometry( this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, 0 );

        //Make Mesh
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {
            color: this.color,
            side: THREE.BackSide,
            fog: false
            //depthWrite: false,
            //depthTest: false
        }));

        //Set mesh visibility
        this.mesh.visible = this.visible;

        //Change position and rotation of fuse
        this.mesh.position.z = 0.002; // Keep in front of reticle
        this.mesh.rotation.y = 180*(Math.PI/180); //Make it clockwise

        //Add to reticle
        //reticle.mesh.add( this.mesh );
        parentContainer.add( this.mesh );
        //geometry.dispose();
    };

    fuse.out = function() {
        this.active = false;
        this.mesh.visible = false;
        this.update(0);
    }

    fuse.over = function(duration, visible) {
        this.duration = duration || this.globalDuration;
        this.active = true;
        this.update(0);
        this.mesh.visible = visible || this.visible;
    }

    fuse.update = function(elapsed) {

        if(!this.active) return;

        //--RING
        var gazedTime = elapsed/this.duration;
        var thetaLength = gazedTime * (Math.PI*2);

        var vertices = this.mesh.geometry.vertices;
        var radius = this.innerRadius;
        var radiusStep = ( ( this.outerRadius - this.innerRadius ) / this.phiSegments );
        var count = 0;

        for ( var i = 0; i < this.phiSegments + 1; i ++ ) {

            for ( var o = 0; o < this.thetaSegments + 1; o++ ) {

                var vertex = vertices[ count ];
                var segment = this.thetaStart + o / this.thetaSegments * thetaLength;
                vertex.x = radius * Math.cos( segment );
                vertex.y = radius * Math.sin( segment );
                count++;
            }
            radius += radiusStep;
        }

        this.mesh.geometry.verticesNeedUpdate = true;

        //Disable fuse if reached 100%
        if(gazedTime >= 1) {
            this.active = false;
        }
        //--RING EOF


    }

    //Reticle
    reticle.initiate = function( options ) {
        var parameters = options || {};

        parameters.hover = parameters.hover || {};
        parameters.click = parameters.click || {};

        this.active             = true;
        this.visible            = parameters.visible            !== false; //default to true;
        this.restPoint          = parameters.restPoint          || settings.camera.far-10.0;
        this.globalColor        = parameters.color              || 0xcc0000;
        this.innerRadius        = parameters.innerRadius        || 0.0001;
        this.outerRadius        = parameters.outerRadius        || 0.003;
        this.worldPosition      = new THREE.Vector3();
        this.ignoreInvisible    = parameters.ignoreInvisible    !== false; //default to true;

        //Hover
        this.innerRadiusTo      = parameters.hover.innerRadius  || 0.02;
        this.outerRadiusTo      = parameters.hover.outerRadius  || 0.024;
        this.globalColorTo      = parameters.hover.color        || this.color;
        this.vibrateHover       = parameters.hover.vibrate      || 50;
        this.hit                = false;
        //Click
        this.vibrateClick       = parameters.click.vibrate      || 50;
        //Animation options
        this.speed              = parameters.hover.speed        || 5;
        this.moveSpeed          = 0;

        //Colors
        this.globalColor = new THREE.Color( this.globalColor );
        this.color = this.globalColor.clone();
        this.globalColorTo = new THREE.Color( this.globalColorTo );
        this.colorTo = this.globalColorTo.clone();

        //Geometry
        var geometry = new THREE.RingGeometry( this.innerRadius, this.outerRadius, 32, 3, 0, Math.PI * 2 );
        var geometryScale = new THREE.RingGeometry( this.innerRadiusTo, this.outerRadiusTo, 32, 3, 0, Math.PI * 2 );

        //Add Morph Targets for scale animation
        geometry.morphTargets.push( { name: "target1", vertices: geometryScale.vertices } );

        //Make Mesh
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {
            color: this.color,
            morphTargets: true,
            fog: false
            //depthWrite: false,
            //depthTest: false
        }));
        this.mesh.visible = this.visible;
        this.mesh.position.z = 0.7;

        //set depth and scale
        this.setDepthAndScale();

        //Add to camera
        //settings.camera.add( this.mesh );
        parentContainer.add( this.mesh );

    };

    //Sets the depth and scale of the reticle - reduces eyestrain and depth issues 
    reticle.setDepthAndScale = function( depth ) {
        //var crosshair = this.mesh;
        var crosshair = parentContainer;
        var z = Math.abs( depth || this.restPoint ); //Default to user far setting
        var cameraZ =  settings.camera.position.z;
        //Force reticle to appear the same size - scale
        //http://answers.unity3d.com/questions/419342/make-gameobject-size-always-be-the-same.html
        var scale = Math.abs( cameraZ - z ) - Math.abs( cameraZ );

        //Set Depth
        crosshair.position.x = 0;
        crosshair.position.y = 0;
        crosshair.position.z = utilities.clampBottom( z, settings.camera.near+0.1 ) * -1;

        //Set Scale
        crosshair.scale.set( scale, scale, scale );
    };

    reticle.update = function(delta) {
        //If not active
        if(!this.active) return;

        var accel = delta * this.speed;

        if( this.hit ) {
            this.moveSpeed += accel;
            this.moveSpeed = Math.min(this.moveSpeed, 1);
        } else {
            this.moveSpeed -= accel;
            this.moveSpeed = Math.max(this.moveSpeed, 0);
        }
        //Morph
        this.mesh.morphTargetInfluences[ 0 ] = this.moveSpeed;
        //Set Color
        this.color = this.globalColor.clone();
        //console.log( this.color.lerp( this.colorTo, this.moveSpeed ) )
        this.mesh.material.color = this.color.lerp( this.colorTo, this.moveSpeed );
    };

    var initiate = function (camera, options) {
        //Update Settings:
        options = options || {};

        settings.camera = camera; //required
        settings.proximity = options.proximity || settings.proximity;
        settings.lockDistance = options.lockDistance || settings.lockDistance;
        settings.isClickEnabled = options.clickevents || settings.isClickEnabled;
        options.reticle = options.reticle || {};
        options.fuse = options.fuse || {};

        //Raycaster Setup
        raycaster = new THREE.Raycaster();
        vector = new THREE.Vector2(0, 0);
        //Update Raycaster 
        if(options.near && options.near >= 0 ) {
            raycaster.near = options.near;
        }
        if(options.far && options.far >= 0 ) {
            raycaster.far = options.far;
        }

        //Create Parent Object for reticle and fuse
        parentContainer = new THREE.Object3D();
        settings.camera.add( parentContainer );

        //Proximity Setup
        if( settings.proximity ) {
            frustum = new THREE.Frustum();
            cameraViewProjectionMatrix = new THREE.Matrix4();
        }

        //Enable Click / Tap Events
        if( settings.isClickEnabled ) {
            document.body.addEventListener('touchend', touchClickHandler, false);
            document.body.addEventListener('click', touchClickHandler, false);
        }

        //Clock Setup
        clock = new THREE.Clock(true);

        //Initiate Reticle
        reticle.initiate(options.reticle);

        //Initiate Fuse
        fuse.initiate(options.fuse);
    };

    var proximity = function() {
        var camera = settings.camera;
        var showReticle = false;

        //Use frustum to see if any targetable object is visible
        //http://stackoverflow.com/questions/17624021/determine-if-a-mesh-is-visible-on-the-viewport-according-to-current-camera
        camera.updateMatrixWorld();
        camera.matrixWorldInverse.getInverse( camera.matrixWorld );
        cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

        frustum.setFromMatrix( cameraViewProjectionMatrix );


        for( var i =0, l=collisionList.length; i<l; i++) {

            var newObj = collisionList[i];

            if(!newObj.reticulumData.gazeable) {
                continue;
            }

            if( reticle.ignoreInvisible && !newObj.visible) {
                continue;
            }

            if( frustum.intersectsObject( newObj ) ) {
                showReticle = true;
                break;
            }

        }
        reticle.mesh.visible = showReticle;

    };

    var detectHit = function() {
        try {
            raycaster.setFromCamera( vector, settings.camera );
        } catch (e) {
            //Assumes PerspectiveCamera for now... 
            //Support for Three.js < rev70
            raycaster.ray.origin.copy( settings.camera.position );
            raycaster.ray.direction.set( vector.x, vector.y, 0.5 ).unproject( settings.camera ).sub( settings.camera.position ).normalize();
        }

        //
        var intersects = raycaster.intersectObjects(collisionList);
        var intersectsCount = intersects.length;
        //Detect
        if (intersectsCount) {

            var newObj;

            //Check if what we are hitting can be used
            for( var i =0, l=intersectsCount; i<l; i++) {
                newObj = intersects[ i ].object;
                //If new object is not gazeable skip it.
                if (!newObj.reticulumData.gazeable) {
                    if( newObj == INTERSECTED ) { //TO DO: move this else where
                        gazeOut(INTERSECTED)
                    }
                    newObj = null;
                    continue;
                }
                //If new object is invisible skip it.
                if( reticle.ignoreInvisible && !newObj.visible) {
                    newObj = null;
                    continue;
                }
                //No issues let use this one
                break;
            }

            //There is no valid object
            if (newObj === null) return;

            //Is it a new object?
            if( INTERSECTED != newObj ) {
                //If old INTERSECTED i.e. not null reset and gazeout 
                if ( INTERSECTED ) {
                    gazeOut(INTERSECTED);
                };

                //Updated INTERSECTED with new object
                INTERSECTED = newObj;
                //Is the object gazeable?
                //if (INTERSECTED.gazeable) {
                //Yes
                gazeOver(INTERSECTED);
                //}
            } else {
                //Ok it looks like we are in love
                gazeLong(INTERSECTED);
            }

        } else {
            //Is the object gazeable?
            //if (INTERSECTED.gazeable) {
            if (INTERSECTED) {
                //GAZE OUT
                gazeOut(INTERSECTED);
            }
            //}
            INTERSECTED = null;

        }
    };

    var setColor = function(threeObject, color) {
        threeObject.material.color.setHex( color );
    };

    var gazeOut = function(threeObject) {
        threeObject.userData.hitTime = 0;
        //if(threeObject.fuse) {
        fuse.out();
        //}

        reticle.hit = false;
        reticle.setDepthAndScale();

        if ( threeObject.onGazeOut != null ) {
            threeObject.onGazeOut();
        }
    };

    var gazeOver = function(threeObject) {
        var threeObjectData = threeObject.reticulumData;
        reticle.colorTo = threeObjectData.reticleHoverColor || reticle.globalColorTo;

        //Fuse
        fuse.over(threeObjectData.fuseDuration, threeObjectData.fuseVisible);
        if(threeObjectData.fuseColor) {
            setColor(fuse.mesh, threeObjectData.fuseColor);
        }

        threeObject.userData.hitTime = clock.getElapsedTime();

        //Reticle
        //Vibrate
        vibrate( reticle.vibrateHover );
        //Does object have an action assigned to it?
        if (threeObject.onGazeOver != null) {
            threeObject.onGazeOver();
        }
    };

    var gazeLong = function( threeObject ) {
        var distance;
        var elapsed = clock.getElapsedTime();
        var gazeTime = elapsed - threeObject.userData.hitTime;
        //There has to be a better  way...
        //Keep updating distance while user is focused on target
        if( reticle.active ) {

            if(!settings.lockDistance){
                reticle.worldPosition.setFromMatrixPosition( threeObject.matrixWorld );
                distance = settings.camera.position.distanceTo( reticle.worldPosition );
                distance -= threeObject.geometry.boundingSphere.radius;
            }

            reticle.hit = true;

            if(!settings.lockDistance) {
                reticle.setDepthAndScale(distance);
            }
        }

        //Fuse
        if( gazeTime >= fuse.duration && !fuse.active ) {
            //Vibrate
            vibrate( fuse.vibratePattern );
            //Does object have an action assigned to it?
            if (threeObject.onGazeLong != null) {
                threeObject.onGazeLong();
            }
            //Reset the clock
            threeObject.userData.hitTime = elapsed;
        } else {
            fuse.update(gazeTime);
        }
    };

    var gazeClick = function( threeObject ) {
        var clickCancelFuse = threeObject.reticulumData.clickCancelFuse != null ? threeObject.reticulumData.clickCancelFuse : fuse.clickCancel;
        //Cancel Fuse
        if( clickCancelFuse ) {
            //Reset the clock
            threeObject.userData.hitTime = clock.getElapsedTime();
            //Force gaze to end...this might be to assumptions
            fuse.update( fuse.duration );
        }

        //Does object have an action assigned to it?
        if (threeObject.onGazeClick != null) {
            threeObject.onGazeClick();
        }
    };

    //This function is called on click or touch events
    var touchClickHandler = function(e) {
        if( reticle.hit && INTERSECTED ) {
            e.preventDefault();
            gazeClick(INTERSECTED);
        }
    }


    return {
        add: function (threeObject, options) {
            var parameters = options || {};

            //Stores object options for reticulum
            threeObject.reticulumData = {};
            threeObject.reticulumData.gazeable = true;
            //Reticle
            threeObject.reticulumData.reticleHoverColor = null;
            if(parameters.reticleHoverColor) {
                threeObject.reticulumData.reticleHoverColor = new THREE.Color(parameters.reticleHoverColor);
            }
            //Fuse
            threeObject.reticulumData.fuseDuration              = parameters.fuseDuration           || null;
            threeObject.reticulumData.fuseColor                 = parameters.fuseColor              || null;
            threeObject.reticulumData.fuseVisible               = parameters.fuseVisible            === undefined ? null : parameters.fuseVisible;
            threeObject.reticulumData.clickCancelFuse           = parameters.clickCancelFuse        === undefined ? null : parameters.clickCancelFuse;
            //Events
            threeObject.onGazeOver                              = parameters.onGazeOver             || null;
            threeObject.onGazeOut                               = parameters.onGazeOut              || null;
            threeObject.onGazeLong                              = parameters.onGazeLong             || null;
            threeObject.onGazeClick                             = parameters.onGazeClick            || null;


            //Add object to list
            collisionList.push(threeObject);
        },
        remove: function (threeObject) {
            var index = collisionList.indexOf(threeObject);
            threeObject.reticulumData.gazeable = false;
            if (index > -1) {
                collisionList.splice(index, 1);
            }
        },
        update: function () {
            var delta = clock.getDelta(); //
            detectHit();

            //Proximity
            if(settings.proximity) {
                proximity();
            }

            //Animation
            reticle.update(delta);

        },
        init: function (camera, options) {
            var c = camera || null;
            var o = options || {};
            if ( !c instanceof THREE.Camera ) {
                console.error("ERROR: Camera was not correctly defined. Unable to initiate Reticulum.");
                return;
            }
            initiate(c, o);
        }
    };
})();