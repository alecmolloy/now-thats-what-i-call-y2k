// Add average function to Math library
Math.average = function (arr) {
    var cnt = arr.length,
        tot = 0,
        i = 0;
    while (i < cnt)
        tot += arr[i++];
    return tot / cnt;
}

// Three JS controls
var camera, scene, renderer;
var cameraControls, effectController;
var logo, logos = [];
var clock = new THREE.Clock();
var saturationTarget = document.getElementById('saturationTarget');

// Audio Context
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var audioCtx = new AudioContext();
var source;

// Analyser Node
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 32;
var bufferLength = analyser.fftSize;
var dataArray = new Uint8Array(bufferLength);

// Get microphone
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

navigator.webkitGetUserMedia({
    audio: true
}, gotStream, lostStream);



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


    depth = 50;

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
    var letterMaterial = new THREE.MeshPhongMaterial({
        color: 0xfceb21,
        side: THREE.DoubleSide
    });
    var boxMaterial = new THREE.MeshPhongMaterial({
        color: 0xc92def,
        side: THREE.DoubleSide
    });

    // Meshes
    var logoNowMesh = new THREE.Mesh(logoNowGeo, letterMaterial);
    var logoThatsMesh = new THREE.Mesh(logoThatsGeo, letterMaterial);
    var logoThatsBoxMesh = new THREE.Mesh(logoThatsBoxGeo, boxMaterial);
    var logoYMesh = new THREE.Mesh(logoYGeo, letterMaterial);
    var logo2Mesh = new THREE.Mesh(logo2Geo, letterMaterial);
    var logoKMesh = new THREE.Mesh(logoKGeo, letterMaterial);

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
    logo = new THREE.Object3D();
    logo.add(logoNowMesh);
    logo.add(logoThatsMesh);
    logo.add(logoThatsBoxMesh);
    logo.add(logoYMesh);
    logo.add(logo2Mesh);
    logo.add(logoKMesh);

    logo.rotateX(Math.PI);
    logo.rotateY(Math.PI);

    for (var i = 0; i < 25; i++) {
        nowLogo = logo.clone();

        nowLogo.position.x = Math.random() * 2000 - 1000;
        nowLogo.position.y = Math.random() * 2000 - 1000;
        nowLogo.position.z = Math.random() * 2000 - 1000;
        nowLogo.rotation.x = Math.random() * 4;
        nowLogo.rotation.y = Math.random() * 4;
        nowLogo.rotation.z = Math.random() * 4;

        logos.push(nowLogo);

        scene.add(nowLogo);
    }


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
    renderer.setClearColor(0x000000, 0);

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

    // Take sound data, get standard deviation of last n samples, and use that to control the saturation of the target
    analyser.getByteTimeDomainData(dataArray);
    var deviation = Math.average(dataArray);
    deviation = ((deviation - 128) * 200) + 128;
    saturationTarget.style.webkitFilter = 'saturate(' + deviation + '%)';
    saturationTarget.style.transform = 'rotateY(' + Math.abs(deviation/100 ) + 'deg)';
    saturationTarget.style.transform = 'rotateX(' + Math.abs(0-deviation/100 ) + 'deg)';

    console.log(deviation);

    // Rotate THREE camera
    camera.rotation.y = camera.rotation.y + .001;
    camera.rotation.x = camera.rotation.x + .001;
    //        camera.rotation.y = Math.sin(Date.now() * 0.0005) / 8;
    //        camera.rotation.x = Math.sin(Date.now() * 0.0010) / 16;

    for (var i = 0; i < logos.length; i++) {
        logos[i].rotation.y = Math.sin(Date.now() * 0.0005) / 4;
        logos[i].rotation.x = Math.sin(Date.now() * 0.0010) / 8;
        logos[i].position.x = logos[i].position.x + Math.sin(Date.now() / 10000) * 1;
    }
    render();
}

function gotStream(stream) {
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    draw();
}

function lostStream(e) {
    console.log(e);
}


function render() {
    renderer.render(scene, camera);
}

init();
fillScene();
addToDOM();
animate();
