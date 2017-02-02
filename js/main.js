(function() {

    let prevTime,
        controlsEnabled = false,
        moveForward = false,
        moveBackward = false,
        moveLeft = false,
        moveRight = false,
        holdShift = false,
        canJump = false;

    let objects = [];

    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild(renderer.domElement);

    let textureLoader = new THREE.TextureLoader();
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 500);
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    let velocity = new THREE.Vector3();
    let clock = new THREE.Clock();

    let raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10);

    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    let blocker = document.getElementById('blocker');
	let instructions = document.getElementById('instructions');

    let controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    let stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);

    document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

    // Floor
    var floor = {
        geometry: new THREE.PlaneGeometry( 2000, 2000, 100, 100 ),
        material: new THREE.MeshBasicMaterial( { map: textureLoader.load('images/floor.jpg') } )
    }

    floor.geometry.rotateX( - Math.PI / 2 );

    // for ( var i = 0, l = floor.geometry.vertices.length; i < l; i ++ ) {
	// 	var vertex = floor.geometry.vertices[ i ];
	// 	vertex.x += Math.random() * 20 - 10;
	// 	vertex.y += Math.random() * 2;
	// 	vertex.z += Math.random() * 20 - 10;
	// }
    //
	// for ( var i = 0, l = floor.geometry.faces.length; i < l; i ++ ) {
	// 	var face = floor.geometry.faces[ i ];
	// 	face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	// 	face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	// 	face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	// }

    floorMesh = new THREE.Mesh( floor.geometry, floor.material );
    scene.add(floorMesh);

    // Objects

    var objGeometry = new THREE.BoxGeometry( 20, 20, 20 );

	for ( var i = 0, l = objGeometry.faces.length; i < l; i ++ ) {

		var face = objGeometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

	}

	for ( var i = 0; i < 20; i ++ ) {

		var objMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, map: textureLoader.load('images/mario-block.png') } );

		var mesh = new THREE.Mesh( objGeometry, objMaterial );
		mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
		mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
		mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
		scene.add( mesh );

		objMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		objects.push( mesh );

	}

    activatePointerLock();

    function render () {
        requestAnimationFrame(render);

        let delta = clock.getDelta();

        if (controlsEnabled) {
			raycaster.ray.origin.copy( controls.getObject().position );
			raycaster.ray.origin.y -= 10;

			var intersections = raycaster.intersectObjects( objects );
			var isOnObject = intersections.length > 0;

			velocity.x -= velocity.x * 10 * delta;
			velocity.z -= velocity.z * 10 * delta;
			velocity.y -= 1 * 1000 * delta;

            if (holdShift) {
                if (moveForward) velocity.z -= 800 * delta;
    			if (moveBackward) velocity.z += 800 * delta;

    			if (moveLeft) velocity.x -= 800 * delta;
    			if (moveRight) velocity.x += 800 * delta;
            } else {
                if (moveForward) velocity.z -= 400 * delta;
    			if (moveBackward) velocity.z += 400 * delta;

    			if (moveLeft) velocity.x -= 400 * delta;
    			if (moveRight) velocity.x += 400 * delta;
            }
            
			if (isOnObject === true) {
				velocity.y = Math.max( 0, velocity.y );

				canJump = true;
			}

			controls.getObject().translateX( velocity.x * delta );
			controls.getObject().translateY( velocity.y * delta );
			controls.getObject().translateZ( velocity.z * delta );

			if (controls.getObject().position.y < 10) {
				velocity.y = 0;
				controls.getObject().position.y = 10;

				canJump = true;
			}
		}

        renderer.render(scene, camera);
        stats.update();
    };

    render();
    window.addEventListener('resize', onWindowResize, false);

    // Functions!
    function onWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
    };

    function onKeyDown (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

            case 16: // shift
                holdShift = true;
                break;

			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};

    function onKeyUp (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

            case 16: // shift
                holdShift = false;
                break;
		}
	};

    function Cube (w, h, d, opts) {
        let geometry = new THREE.BoxGeometry(w, d, h);
        let material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(opts.texture)
        });

        return new THREE.Mesh(geometry, material);
    }

    function activatePointerLock () {
        if (havePointerLock) {
            let element = document.body;

    		var pointerlockchange = function (event) {
    			if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
    				controlsEnabled = true;
    				controls.enabled = true;

    				blocker.style.display = 'none';
    			} else {
    				controls.enabled = false;

    				blocker.style.display = '-webkit-box';
    				blocker.style.display = '-moz-box';
    				blocker.style.display = 'box';

    				instructions.style.display = '';
    			}
    		};

    		var pointerlockerror = function (event) {
    			instructions.style.display = '';
    		};

    		// Hook pointer lock state change events
    		document.addEventListener('pointerlockchange', pointerlockchange, false);
    		document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    		document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    		document.addEventListener('pointerlockerror', pointerlockerror, false);
    		document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    		document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    		instructions.addEventListener('click', function ( event ) {

    			instructions.style.display = 'none';

    			// Ask the browser to lock the pointer
    			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    			if (/Firefox/i.test( navigator.userAgent ) ) {
    				var fullscreenchange = function ( event ) {
    					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
    						document.removeEventListener( 'fullscreenchange', fullscreenchange );
    						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

    						element.requestPointerLock();
    					}
    				};

    				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
    				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

    				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
    				element.requestFullscreen();

    			} else {

    				element.requestPointerLock();

    			}

    		}, false );
        } else {
            alert('This game relies on the pointer lock API... so it might not work on this browser/device');
        }
    }
})();
