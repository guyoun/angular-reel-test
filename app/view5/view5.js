'use strict';

angular.module('myApp.view5', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view5', {
            templateUrl: 'view5/view5.html',
            controller: 'View5Ctrl'
        });
    }])
    .controller('View5Ctrl', ['$scope', '$log', 'Papa', function ($scope, $log) {
        function ThreeJS(configs) {
            var threejs = {};
            var container, scene, scene_container, renderer, camera, controls;
            var axis_translated = false;
            threejs.elements = {}; //render, object

            threejs.add_element = function(key, object, render, custom_data){
                custom_data = custom_data || null;

                threejs.elements[key] = {
                    'object': object,
                    'render': render,
                    'custom_data': custom_data
                };

                configs.update_elements_callback(threejs.elements);
            }


            threejs.get_objects = function(excludes) {
                excludes = excludes || [];

                var objects = [];
                for(var key in threejs.elements){
                    if(excludes.length > 0 && excludes.indexOf(key) != -1)
                        continue;

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

            threejs.remove_all = function(excludes){
                var objects = threejs.get_objects(excludes);
                for(var i=0; i < objects.length; i++)
                {
                    var object = objects[i];
                    scene_container.remove(object);
                }

                for(var key in threejs.elements){
                    if(excludes.length > 0 && excludes.indexOf(key) != -1)
                        continue;

                    delete threejs.elements[key];
                }

                configs.update_elements_callback(threejs.elements);
            }

            threejs.init = function () {
                $log.debug('init');

                var width = configs['size']['width'] || window.innerWidth;
                var height = configs['size']['height'] || window.innerHeight;

                container = document.getElementById('threejs-canvas');
                scene = new THREE.Scene(); // Create a Three.js scene object.
                scene_container = new THREE.Object3D();
                scene.add( scene_container );

                camera = new THREE.PerspectiveCamera(75, width/height, 1, 5000); // Define the perspective camera's attributes.

                renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
                renderer.setSize(width, height); // Set the size of the WebGL viewport.
                container.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.


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

                var axisHelper = new THREE.AxisHelper( 5 );
                scene_container.add( axisHelper );

                draw_floor_texture();
                animate();
            };

            threejs.update_camera = function(camera_position){
                camera.position.set(camera_position['x'],camera_position['y'],camera_position['z']);
                camera.updateProjectionMatrix();
            };

            threejs.reset_trackballcontrols = function(){
                controls.reset();
            }

            threejs.draw_cube = function (x,y,z, width, height, depth, color, custom_data) {
                x = x || 0;
                y = y || 0;
                z = z || 0;

                width =  width || 20;
                height =  height || 20;
                depth = depth || 20;

                color = color || 0x00FF00;
                custom_data = custom_data || null;

                var geometry = new THREE.CubeGeometry(width, height, depth); // Create a 20 by 20 by 20 cube.
                //var material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, transparent: true});
                var material = new THREE.MeshBasicMaterial({color: color});
                var cube = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).

                cube.position.x = x;
                cube.position.y = y;
                cube.position.z = z;

                cube.rotation.x = -90 * Math.PI / 180;
                // object.rotation.y = 0 * Math.PI / 180;
                cube.rotation.z = 180 * Math.PI / 180;

                scene_container.add(cube); // Add the cube at (0, 0, 0).

                var render_func = function (key) {
                    var element = threejs.get_element(key);

                    if(element){
                        var obj = element['object'];
                        // obj.rotation.x += 0.01; // Rotate the sphere by a small amount about the x- and y-axes.
                        // obj.rotation.y += 0.01;
                    }
                };
                threejs.add_element(cube.uuid, cube, render_func, custom_data);
            };

            threejs.draw_sphere = function (x,y,z, radius, color, custom_data) {
                x = x || 0;
                y = y || 0;
                z = z || 0;

                radius = radius || 5;

                color = color || 0x00FF00;
                custom_data = custom_data || null;

                var geometry = new THREE.SphereGeometry(radius); // Create a 20 by 20 by 20 cube.
                var material = new THREE.MeshBasicMaterial({color: color});
                var mesh = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).

                mesh.position.x = x;
                mesh.position.y = y;
                mesh.position.z = z;

                mesh.rotation.x = -90 * Math.PI / 180;
                // object.rotation.y = 0 * Math.PI / 180;
                mesh.rotation.z = 180 * Math.PI / 180;

                scene_container.add(mesh); // Add the cube at (0, 0, 0).

                var render_func = function (key) {
                    var element = threejs.get_element(key);

                    if(element){
                        var obj = element['object'];
                        // obj.rotation.x += 0.01; // Rotate the sphere by a small amount about the x- and y-axes.
                        // obj.rotation.y += 0.01;
                    }
                };
                threejs.add_element(mesh.uuid, mesh, render_func, custom_data);
            };

            var clock = new THREE.Clock();
            var delta = clock.getDelta(); // seconds.
            var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
            var stats;

            var mouseX = 0, mouseY = 0;

            threejs.load_obj = function (file_url, onload_callback, rotation) {
                onload_callback = onload_callback || function(){};
                rotation = rotation || false;

                init();

                function init() {
                    // var ambient = new THREE.AmbientLight(0x101030);
                    // scene.add(ambient);

                    var directionalLight_front = new THREE.DirectionalLight(0xffffff);
                    directionalLight_front.position.set(0, 0, 1);
                    scene.add(directionalLight_front);

                    var directionalLight_back = new THREE.DirectionalLight(0xffffff);
                    directionalLight_back.position.set(0, 0, -1);
                    scene.add(directionalLight_back);

                    // texture
                    var manager = new THREE.LoadingManager();
                    manager.onLoad = function (item, loaded, total) {
                        console.log(item, loaded, total);
                        alert('로드되었습니다.');
                        onload_callback();
                    };

                    manager.onProgress = function (item, loaded, total) {
                        console.log("onProgress: " + loaded + "/" + total);
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

                        // Todo: 오브젝트에 따로 업데이트 필요
                        object.position.x = 0;
                        object.position.y = 0;
                        object.position.z = 0;

                        // object.scale.x = 0.05;
                        // object.scale.y = 0.05;
                        // object.scale.z = 0.05;

                        if(rotation){
                            object.rotation.x = -90 * Math.PI / 180;
                            // object.rotation.y = 0 * Math.PI / 180;
                            object.rotation.z = 180 * Math.PI / 180;
                        }

                        scene_container.add(object);
                        threejs.add_element('body', object, render_func);

                        draw_floor_texture();
                    });
                }
            };

            threejs.render = function(){
                if(!axis_translated){
                    scene_container.translateOnAxis(new THREE.Vector3(0,1,0),-500);
                    axis_translated = true;
                }
                for (var key in threejs.elements) {
                    var element = threejs.get_element(key);

                    if (element && typeof(element['render']) == 'function') {
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

            //floor cube matrix
            function draw_floor_texture(){
                var element = threejs.get_element('body');
                if(element){
                    var obj = element['object'];
                    var box = new THREE.Box3().setFromObject(obj);

                    var floorTexture = new THREE.ImageUtils.loadTexture( 'view5/checkerboard.jpg' );
                    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                    floorTexture.repeat.set( 10, 10 );
                    // DoubleSide: render texture on both sides of mesh
                    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
                    var floorGeometry = new THREE.PlaneGeometry(3000, 3000, 1, 1);
                    var floor = new THREE.Mesh(floorGeometry, floorMaterial);

                    floor.position.y = box.min.y;
                    floor.rotation.x = Math.PI / 2;

                    scene.add(floor);

                    threejs.add_element('floor', floor, null);
                }
            }

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
        var update_elements_callback = function(elements){
            $scope.elements = elements;

            if (!$scope.$$phase)
                $scope.$apply(); //or simply $scope.$digest();
        };

        $scope.configs = {
            'size': {
                'width': 475,
                'height': 900
            },
            'position': {x:0, y:0, z:0},
            'camera': {x:0, y:0, z:2000},
            'update_elements_callback': update_elements_callback
        };

        function init(){
            threejs = new ThreeJS($scope.configs);
        };
        init();

        $scope.remove_all = function(excludes){
            threejs.remove_all(excludes);
        }

        $scope.draw_cube = function (position, dimension, custom_data, color) {
            position = position || null;
            dimension = dimension || dimension;
            color = color || Math.random() * 0xFFFFFF;

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

            if(dimension)
            {
                width = dimension.width;
                height = dimension.height;
                depth = dimension.depth;
            }

            threejs.draw_cube(x, y, z, width, height, depth, color, custom_data);
        };

        $scope.draw_sphere = function (position, radius, custom_data, color) {
            position = position || null;
            radius = radius || 5;
            color = color || Math.random() * 0xFFFFFF;

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

            threejs.draw_sphere(x, y, z, radius, color, custom_data);
        };

        $scope.load_obj = function () {
            var file_obj_id = $scope.file_obj_id;
            var file_obj_path = $scope.body_model_data[file_obj_id]['obj'];
            var to_rotation = $scope.body_model_data[file_obj_id]['rotation'];

            //From local webserver
             threejs.load_obj(file_obj_path, null, to_rotation);

            // threejs.load_obj('view5/ship_triangle.obj');
        }

        $scope.update_camera = function (camera) {
            threejs.update_camera(camera)
        }

        $scope.select_element = function(element){
            $scope.selected = null;
            $scope.selected = element;
        }

        $scope.move_element = function(axis, sign){
            var element = $scope.selected;

            if(sign == '+'){
                element['object'].position[axis] = element['object'].position[axis] + 1;
            }
            else{
                element['object'].position[axis] = element['object'].position[axis] - 1;
            }
        }

        $scope.landmarks = null;
        var draw_landmarks = function(landmarks){
            var excludes = ['body'];
            var color = 0x8fff45;
            $scope.remove_all(excludes);

            var dimension = {
                "width": 20,
                "height": 20,
                "depth": 20
            };
            for(var i=0; i<landmarks.length; i++){
                var landmark = landmarks[i];
                var position = {
                    'x': landmark[2],
                    'y': landmark[3],
                    'z': landmark[4]
                };
                $scope.draw_cube(position, dimension, landmark, color);
            }
        }

        $scope.read_landmarks = function(file){
            var file_obj_id = $scope.file_obj_id;

            var data = Papa.parse(file[0], {
                    complete: function(results) {
                        console.log("Finished:", results.data);

                        draw_landmarks(results.data);
                    }
                }
            );
        }

        $scope.body_model_data = {
            '5_5036':{
                'obj': 'view5/5_5036.OBJ',
                'rotation': false
            },
            '6_4860': {
                'obj': 'view5/6_4860.OBJ',
                'rotation': true
            },
            '6_5012': {
                'obj': 'view5/6_5012.OBJ',
                'rotation': true
            }
        }

    }]);