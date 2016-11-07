'use strict';

angular.module('myApp.view5', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view5', {
            templateUrl: 'view5/view5.html',
            controller: 'View5Ctrl'
        });
    }])
    .controller('View5Ctrl', ['$scope', '$log', function ($scope, $log) {
        function ThreeJS(configs) {
            var threejs = {};
            var container, scene, renderer, camera, controls;
            threejs.elements = {}; //render, object

            threejs.add_element = function(key, object, render){
                threejs.elements[key] = {
                    'object': object,
                    'render': render
                };

                configs.updata_elements_callback(threejs.elements);
            }


            threejs.get_objects = function() {
                var objects = [];
                for(var key in threejs.elements){
                    objects.push(threejs.elements[key]['object']);
                }

                return objects;
            }

            threejs.get_element = function(key){
                if(key in threejs.elements)
                    return threejs.elements[key];
                else
                    return null;
            }

            threejs.init = function () {
                $log.debug('init');

                var width = configs['size']['width'] || window.innerWidth;
                var height = configs['size']['height'] || window.innerHeight;

                container = document.getElementById('threejs-canvas');
                scene = new THREE.Scene(); // Create a Three.js scene object.

                renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
                renderer.setSize(width, height); // Set the size of the WebGL viewport.
                container.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

                camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000); // Define the perspective camera's attributes.

                if(configs['camera']){
                    $log.debug(configs);

                    camera.position.x = configs['camera']['x'];
                    camera.position.y = configs['camera']['y'];
                    camera.position.z = configs['camera']['z'];
                }
                else{
                    camera.position.z = 100; // Move the camera away from the origin, down the positive z-axis.
                }

                controls = new THREE.TrackballControls( camera, container);
                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;
                controls.noZoom = false;
                controls.noPan = false;
                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;

                renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
                renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
                renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

                animate();
            };

            threejs.update_camera = function(camera_position){
                camera.position.x = camera_position['x'];
                camera.position.y = camera_position['y'];
                camera.position.z = camera_position['z'];
            };

            threejs.draw_cube = function (x,y,z, width, height, depth, color) {
                x = x || 0;
                y = y || 0;
                z = z || 0;

                width =  width || 20;
                height =  height || 20;
                depth = depth || 20;

                color = color || 0x00FF00;

                var geometry = new THREE.CubeGeometry(width, height, depth); // Create a 20 by 20 by 20 cube.
                var material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, transparent: true});
                var cube = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).

                cube.position.x = x;
                cube.position.y = y;
                cube.position.z = z;

                scene.add(cube); // Add the cube at (0, 0, 0).

                var render_func = function (key) {
                    var element = threejs.get_element(key);

                    if(element){
                        var obj = element['object'];
                        // obj.rotation.x += 0.01; // Rotate the sphere by a small amount about the x- and y-axes.
                        // obj.rotation.y += 0.01;
                    }
                };
                threejs.add_element(cube.uuid, cube, render_func);
            };

            var clock = new THREE.Clock();
            var delta = clock.getDelta(); // seconds.
            var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
            var stats;

            var mouseX = 0, mouseY = 0;

            threejs.load_obj = function (file_url) {
                init();

                function init() {
                    var ambient = new THREE.AmbientLight(0x101030);
                    scene.add(ambient);

                    var directionalLight = new THREE.DirectionalLight(0xffeedd);
                    directionalLight.position.set(0, 0, 1);
                    scene.add(directionalLight);

                    // texture
                    var manager = new THREE.LoadingManager();
                    manager.onProgress = function (item, loaded, total) {
                        console.log(item, loaded, total);
                    };

                    function render_func() {
                        var element = threejs.get_element('body');
                        if(element){
                            var obj = element['object'];
                            // obj.rotation.y += (0.2 * (Math.PI / 180));
                            // obj.rotation.y %= 360;
                        }
                    }

                    // model
                    var loader = new THREE.OBJLoader(manager);
                    loader.load(file_url, function (object) {
                        object.traverse(function (child) {

                            if (child instanceof THREE.Mesh) {
                                //child.material.map = texture;
                            }
                        });

                        object.position.y = -400;
                        object.rotation.y = 20 * Math.PI / 180;
                        object.scale.x = 0.05;
                        object.scale.y = 0.05;
                        object.scale.z = 0.05;
                        scene.add(object);

                        threejs.add_element('body', object, render_func);
                    });
                }
            };

            threejs.render = function(){
                for (var key in threejs.elements) {
                    var element = threejs.get_element(key);

                    if (element && typeof(element['render'] == 'function')) {
                        var func = element['render'];
                        func(key);
                    }
                }
                renderer.render(scene, camera);
                controls.update();
            };

            function animate() {
                requestAnimationFrame(animate);
                threejs.render();
            };

            //from https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_interactive_draggablecubes.html
            //draggable cube
            var SELECTED, INTERSECTED, mouse = {};
            var raycaster = new THREE.Raycaster();
            var plane = new THREE.Plane();
            var offset = new THREE.Vector3();
            var intersection = new THREE.Vector3();

            function onDocumentMouseMove( event ) {
                event.preventDefault();

                var offsetLeft = container.offsetLeft;
                var offsetTop = container.offsetTop;
                mouse.x = ( (event.clientX - offsetLeft) / configs.size.width ) * 2 - 1;
                mouse.y = - ( (event.clientY - offsetTop) / configs.size.height ) * 2 + 1;

                raycaster.setFromCamera( mouse, camera );

                if ( SELECTED ) {
                    if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

                        SELECTED.position.copy( intersection.sub( offset ) );
                    }
                    return;
                }

                var objects = threejs.get_objects();
                var intersects = raycaster.intersectObjects( objects );

                if ( intersects.length > 0 ) {
                    if ( INTERSECTED != intersects[ 0 ].object ) {
                        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                        INTERSECTED = intersects[ 0 ].object;
                        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                        plane.setFromNormalAndCoplanarPoint(
                            camera.getWorldDirection( plane.normal ),
                            INTERSECTED.position );
                    }

                    container.style.cursor = 'pointer';

                } else {
                    if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                    INTERSECTED = null;
                    container.style.cursor = 'auto';
                }
            }

            function onDocumentMouseDown( event ) {
                event.preventDefault();

                raycaster.setFromCamera( mouse, camera );
                var objects = threejs.get_objects();
                var intersects = raycaster.intersectObjects( objects );
                
                if ( intersects.length > 0 ) {

                    controls.enabled = false;

                    SELECTED = intersects[ 0 ].object;

                    if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

                        offset.copy( intersection ).sub( SELECTED.position );
                    }

                    container.style.cursor = 'move';

                }

            }

            function onDocumentMouseUp( event ) {
                event.preventDefault();

                controls.enabled = true;
                if ( INTERSECTED ) {
                    SELECTED = null;
                }
                container.style.cursor = 'auto';

            }

            threejs.init();
            return threejs;
        };


        var threejs;
        $scope.elements = null;
        $scope.selected = null;
        var updata_elements_callback = function(elements){
            $scope.elements = elements;

            if (!$scope.$$phase)
                $scope.$apply(); //or simply $scope.$digest();
        };

        $scope.configs = {
            'size': {
                'width': 1024,
                'height': 768
            },
            'position': {x:0, y:0, z:0},
            'camera': {x:0, y:0, z:100},
            'updata_elements_callback': updata_elements_callback
        };

        function init(){
            threejs = new ThreeJS($scope.configs);
        };
        init();

        $scope.draw_cube = function (position) {
            position = position || null;

            var x,y,z;
            if(!position){
                x = Math.random() * (30 - (-30)) + (-30);
                y = Math.random() * (30 - (-30)) + (-30);
                z = 0;
            }
            else{
                x = position.x;
                y = position.y;
                z = position.z;
            }

            var rand = Math.random() * (20 - (2)) + (2);
            var width = rand,
            height = rand,
            depth = rand;

            var color = Math.random() * 0xFFFFFF;
            threejs.draw_cube(x, y, z, width, height, depth, color);
        };

        $scope.load_obj = function () {
            //From local webserver
            threejs.load_obj('view5/6_1887.OBJ');
            // threejs.load_obj('view5/ship_triangle.obj');
        }

        $scope.update_camera = function (camera) {
            threejs.update_camera(camera)
        }

        $scope.select_element = function(element){
            $scope.selected = null;
            $scope.selected = element;
        }
    }]);