'use strict';

angular.module('myApp.view5', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view5', {
        templateUrl: 'view5/view5.html',
        controller: 'View5Ctrl'
    });
}])
.controller('View5Ctrl', ['$scope', function($scope) {

     function ThreeJS(){
        this.draw_cube = function(){
            var container = document.getElementById( 'threejs-canvas' );
            var scene = new THREE.Scene(); // Create a Three.js scene object.
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.

            var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
            renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the WebGL viewport.
            container.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

            var geometry = new THREE.CubeGeometry(20, 20, 20); // Create a 20 by 20 by 20 cube.
            var material = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); // Skin the cube with 100% blue.
            var cube = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).
            scene.add(cube); // Add the cube at (0, 0, 0).

            camera.position.z = 50; // Move the camera away from the origin, down the positive z-axis.

            var render = function () {
                cube.rotation.x += 0.01; // Rotate the sphere by a small amount about the x- and y-axes.
                cube.rotation.y += 0.01;

                renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
                requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
            };

            render(); // Start the rendering of the animation frames.
        };

         var clock = new THREE.Clock();
         var delta = clock.getDelta(); // seconds.
         var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
         var container, stats;

         var camera, scene, renderer;

         var mouseX = 0, mouseY = 0;

         var windowHalfX = window.innerWidth / 2;
         var windowHalfY = window.innerHeight / 2;
         var obj = null;

         this.load_obj = function(file_url){
            init();
            animate();

            function init() {
                container = document.createElement( 'threejs-canvas' );
                document.body.appendChild( container );

                camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
                camera.position.z = 1000;

                // scene

                scene = new THREE.Scene();

                var ambient = new THREE.AmbientLight( 0x101030 );
                scene.add( ambient );

                var directionalLight = new THREE.DirectionalLight( 0xffeedd );
                directionalLight.position.set( 0, 0, 1 );
                scene.add( directionalLight );

                // texture

                var manager = new THREE.LoadingManager();
                manager.onProgress = function ( item, loaded, total ) {
                    console.log( item, loaded, total );
                };

                // model
                var loader = new THREE.OBJLoader( manager );
                loader.load( file_url, function ( object ) {
                    object.traverse( function ( child ) {

                        if ( child instanceof THREE.Mesh ) {

                            //child.material.map = texture;

                        }
                    } );

                    object.position.y = -400;
                    object.rotation.y = 20* Math.PI / 180;
                    object.scale.x = 0.05;
                    object.scale.y = 0.05;
                    object.scale.z = 0.05;
                    obj = object
                    scene.add( obj );

                } );

                renderer = new THREE.WebGLRenderer();
                renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( renderer.domElement );

                document.addEventListener( 'mousemove', onDocumentMouseMove, false );

                window.addEventListener( 'resize', onWindowResize, false );

            }

            function onWindowResize() {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );
            }

            function onDocumentMouseMove( event ) {
                mouseX = ( event.clientX - windowHalfX ) / 2;
                mouseY = ( event.clientY - windowHalfY ) / 2;
            }

            function animate() {
                requestAnimationFrame( animate );
                render();
            }

            function render() {
                obj.rotation.y += (0.2*(Math.PI / 180));
                obj.rotation.y %=360;
                renderer.render( scene, camera );
            }
        }
    };
    var threejs = null;

    $scope.draw_cube = function(){
        threejs = new ThreeJS();
        threejs.draw_cube();
    };

    $scope.load_obj = function(){

        threejs = new ThreeJS();

        //From local webserver
        threejs.load_obj('view5/6_1887.OBJ');
        // threejs.load_obj('view5/ship_triangle.obj');
    }
}]);