var camera, scene, renderer;
var cameraControls, effectController;
var logo;
var clock = new THREE.Clock();

function nowLogo(depth) {
    depth = depth || 50;

    // Geometries
    var logoNowGeo = new THREE.TextGeometry("NOW", {
        size: 110,
        height: depth,
        weight: "bold",
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 4,
        curveSegments: 100
    });
    var logoThatsGeo = new THREE.TextGeometry("THAT'S WHAT I CALL", {
        size: 22.5,
        height: depth,
        weight: "bold",
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 1,
        curveSegments: 100
    });
    var logoYGeo = new THREE.TextGeometry("Y", {
        size: 125,
        height: depth,
        weight: "bold",
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 4,
        curveSegments: 100
    });
    var logo2Geo = new THREE.TextGeometry("2", {
        size: 125,
        height: depth,
        weight: "bold",
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 4,
        curveSegments: 100
    });
    var logoKGeo = new THREE.TextGeometry("K!", {
        size: 125,
        height: depth,
        weight: "bold",
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 4,
        curveSegments: 100
    });
    var logoThatsBoxGeo = new THREE.BoxGeometry(350, 55, depth - 2);

    // Materials
    var material = new THREE.MeshPhongMaterial({
        color: 0xfceb21
    });
    var boxMaterial = new THREE.MeshPhongMaterial({
        color: 0xc92def
    });

    // Meshes
    var logoNowMesh = new THREE.Mesh(logoNowGeo, material);
    var logoThatsMesh = new THREE.Mesh(logoThatsGeo, material);
    var logoThatsBoxMesh = new THREE.Mesh(logoThatsBoxGeo, boxMaterial);
    var logoYMesh = new THREE.Mesh(logoYGeo, material);
    var logo2Mesh = new THREE.Mesh(logo2Geo, material);
    var logoKMesh = new THREE.Mesh(logoKGeo, material);

    // Positioning
    logoNowMesh.translateY(40);
    logoNowMesh.translateX(-165);

    logoThatsMesh.translateY(-12.5);
    logoThatsMesh.translateX(-160);

    logoYMesh.translateY(-165);
    logoYMesh.translateX(-180);
    logo2Mesh.translateY(-165);
    logo2Mesh.translateX(-85);
    logoKMesh.translateY(-165);
    logoKMesh.translateX(25);

    logoThatsBoxMesh.translateZ(depth / 2);

    // Adding to scene
    nowLogo = new THREE.Object3D();
    nowLogo.add(logoNowMesh);
    nowLogo.add(logoThatsMesh);
    nowLogo.add(logoThatsBoxMesh);
    nowLogo.add(logoYMesh);
    nowLogo.add(logo2Mesh);
    nowLogo.add(logoKMesh);

    nowLogo.rotateX(Math.PI);
    nowLogo.rotateY(Math.PI);

    return nowLogo;
}

function fillScene() {
    scene = new THREE.Scene();

    // Lights
    var ambientLight = new THREE.AmbientLight(0x333333);
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);
    var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light2.position.set(-500, 250, -200);

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    logo = nowLogo(50);

    scene.add(logo);

}

function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(new THREE.Color(0xffffff, 1));

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(1000, canvasRatio, 1, 10000);

    // Controls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 10, 300);
    cameraControls.target.set(0, 0, 0);
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    logo.rotation.y = Math.sin(Date.now() * 0.0005) / 4;
    logo.rotation.x = Math.sin(Date.now() * 0.0010) / 8;
    logo.position.z = Math.sin(Date.now() * 0.0010) * 10;

    renderer.render(scene, camera);
}

window.onload = function () {
    init();
    fillScene();
    addToDOM();
    animate();
};
