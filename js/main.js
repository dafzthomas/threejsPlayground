(function() {
    let scene, camera, renderer, controls, light, stats;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 5;

    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );

    var texture = THREE.ImageUtils.loadTexture( 'images/metal.jpg', {}, function(){
        // use to test when image gets loaded if it does
        render();
        },
        function(){
            alert('error')
    });

    let geometry = new THREE.BoxGeometry(2, 2, 2);
    let material = new THREE.MeshBasicMaterial({
        map: texture
    });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    let onMouseMove = function (event) {
        console.log('Moving mouse');
    }

    let onWindowResize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();
    }

    let render = function () {
        requestAnimationFrame(render);
        controls.update();

        // cube.rotation.y += 0.01;
        // cube.rotation.x += 0.01;

        renderer.render(scene, camera);
        stats.update();
    }

    render();
    window.addEventListener( 'resize', onWindowResize, false );

})();
