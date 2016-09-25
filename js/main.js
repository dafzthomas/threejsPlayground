(function() {

    function onWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    function render () {
        requestAnimationFrame(render);

        marioCube.rotation.y += 0.01;

        controls.update();
        renderer.render(scene, camera);
        stats.update();
    };

    function cube (w, h, d, texture) {
        let geometry = new THREE.BoxGeometry(w, d, h);
        let material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(texture)
        });

        return cube = new THREE.Mesh(geometry, material);
    }

    let scene, camera, renderer, controls, stats, textureLoader, light;

    textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    controls = new THREE.OrbitControls(camera);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    controls.damping = 10;

    camera.position.z = 5;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let marioCube = cube(2, 2, 2, 'images/mario-block.png')

    marioCube.rotation.x = 0.4;

    scene.add(marioCube);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);

    render();
    window.addEventListener('resize', onWindowResize, false);

})();
