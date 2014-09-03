var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
renderer.setClearColor( 0xffffff );

var maxAnisotropy = renderer.getMaxAnisotropy();

document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();

var aspectRatio = width/height;
var fov = 50;
var near = 0.1;
var far = 1000;

var camera = new THREE.PerspectiveCamera( fov, aspectRatio );
camera.position.z = 300;

var winResize = new THREEx.WindowResize( renderer, camera )

var light = new THREE.SpotLight( 0xffffee );
light.position.set( 5000, 5000, 5000 );
scene.add( light );

var light2 = new THREE.SpotLight( 0xddddff );
light2.position.set( -5000, -5000, -5000 );
scene.add( light2 );

var ambientLight = new THREE.AmbientLight( 0xaaaaaa );
scene.add( ambientLight );

var earthDiffuse = THREE.ImageUtils.loadTexture( 'earth_diffuse.png' );
earthDiffuse.anisotropy = maxAnisotropy;


var boxGeo = new THREE.BoxGeometry( 20, 20, 20, 1, 1, 1 );
var boxMesh = new THREE.Mesh( boxGeo );
scene.add( boxMesh );


// var p = Util.vectorToSpherical( 200, 200 );

// boxMesh.position.copy( p );
// boxMesh.lookAt( new THREE.Vector3(0,0,0) );


var $svg = $('#assets svg');
var shape = Util.svgToShape( $svg[0] );
console.log( 'loaded shape' );
var meshes = Util.parseChildren( shape );
console.log( 'parsed meshes' );
scene.add( meshes );


var sphereGeometry = new THREE.SphereGeometry( 100, 80, 60 );
var sphereMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xffffff,
    map: earthDiffuse,
    ambient: 0x999999,
    specular: 0xbbbbbb,
    shininess: 15
  }
);
sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add( sphereMesh );


var controls = new THREE.OrbitControls( camera, renderer.domElement );

function animate(){

  controls.update();

  renderer.render( scene, camera );

  requestAnimationFrame( animate );
}

animate();
