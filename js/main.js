(function() {

    function onWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        controls.updateScreenSize();

        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    function render () {
        requestAnimationFrame(render);

        marioCube.rotation.y += 0.01;
        marioCube.rotation.x += 0.01;

        delta = clock.getDelta();

        controls.update(delta);
        renderer.render(scene, camera);
        stats.update();
    };

    function Cube (w, h, d, opts) {
        let geometry = new THREE.BoxGeometry(w, d, h);
        let material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(opts.texture)
        });

        return new THREE.Mesh(geometry, material);
    }

    let scene, camera, renderer, clock, delta, controls, stats, textureLoader, light;

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    // controls = new THREE.OrbitControls(camera);
    controls = new THREE.FirstPersonControls(camera);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    textureLoader = new THREE.TextureLoader();

    // Camera Options
    camera.position.x = -20;
    camera.position.y = 5;

    // Controls Options
    controls.movementSpeed = 20;
    controls.lookSpeed = 0.3;
    controls.noFly = true;
    controls.constrainVertical = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    /* Floor  */
    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry( 20, 20, 20, 20 ),
        new THREE.MeshBasicMaterial( { color: 0x00ff30 } )
    );
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = (Math.PI / 2);
    // floor.rotation.y = 100;
    // floor.translate(0, 0, 10);
    scene.add(floor );

    let marioCube = Cube(2, 2, 2, {texture: 'images/mario-block.png'});

    marioCube.rotation.x = 0.4;
    marioCube.position.y = 2;

    scene.add(marioCube);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);

    render();
    window.addEventListener('resize', onWindowResize, false);

})();
