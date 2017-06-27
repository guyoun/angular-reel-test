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

            threejs.draw_line = function (start, end, color, custom_data, key_name) {
                color = color || 0x00FF00;
                custom_data = custom_data || null;

                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    new THREE.Vector3(start.x, start.y, start.z),
                    new THREE.Vector3(end.x, end.y, end.z)
                );
                var material = new THREE.LineBasicMaterial({color: color, linewidth: 2});
                var line = new THREE.Line( geometry, material );

                scene_container.add(line); // Add the cube at (0, 0, 0).

                var render_func = function (key) {
                    var element = threejs.get_element(key);

                    if(element){
                        var obj = element['object'];
                    }
                };
                key_name = key_name || line.uuid;
                threejs.add_element(key_name, line, render_func, custom_data);
            };

            threejs.draw_line_loop = function (points, color, custom_data, key_name) {
                color = color || 0xFF0000;
                custom_data = custom_data || null;

                var geometry = new THREE.Geometry();

                for(var i=0; i<points.length; i++){
                    var point = points[i];

                    geometry.vertices.push(
                        new THREE.Vector3(point.x, point.y, point.z)
                    );
                }
                var material = new THREE.LineBasicMaterial({color: color, linewidth: 3});
                var line = new THREE.LineLoop( geometry, material );

                scene_container.add(line); // Add the cube at (0, 0, 0).

                var render_func = function (key) {
                    var element = threejs.get_element(key);

                    if(element){
                        var obj = element['object'];
                    }
                };
                key_name = key_name || line.uuid;
                threejs.add_element(key_name, line, render_func, custom_data);
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

        $scope.draw_line_loop = function () {
            var points = [
                {x: -170.663086,y: 1304.509766,z: 35.244965},
                {x: -170.969147,y: 1305.937378,z: 34.59201},
                {x: -171.652466,y: 1309.017822,z: 33.022148},
                {x: -172.371307,y: 1312.170288,z: 31.27866},
                {x: -172.972382,y: 1314.735962,z: 29.746868},
                {x: -173.819183,y: 1318.188843,z: 27.419819},
                {x: -173.819214,y: 1318.188843,z: 27.419811},
                {x: -174.70108,y: 1321.803467,z: 25.015713},
                {x: -174.701111,y: 1321.803467,z: 25.015678},
                {x: -175.774261,y: 1326.454834,z: 22.354885},
                {x: -176.317047,y: 1328.607056,z: 20.799202},
                {x: -176.317078,y: 1328.607056,z: 20.799194},
                {x: -177.505249,y: 1332.322754,z: 16.351418},
                {x: -177.505249,y: 1332.322754,z: 16.351414},
                {x: -177.884644,y: 1333.291016,z: 14.702618},
                {x: -178.656281,y: 1335.416382,z: 11.512684},
                {x: -179.234924,y: 1336.88916,z: 8.993832},
                {x: -179.235016,y: 1336.88916,z: 8.993748},
                {x: -179.986572,y: 1339.07251,z: 6.005169},
                {x: -179.986603,y: 1339.07251,z: 6.005157},
                {x: -180.954773,y: 1341.061157,z: 1.292793},
                {x: -181.247742,y: 1341.54126,z: -0.260477},
                {x: -181.247681,y: 1341.54126,z: -0.260479},
                {x: -181.57782,y: 1341.925781,z: -2.174557},
                {x: -182.716583,y: 1343.593994,z: -8.419846},
                {x: -183.366974,y: 1344.215332,z: -12.3335},
                {x: -184.157684,y: 1345.232422,z: -16.817839},
                {x: -185.363251,y: 1346.583862,z: -23.863535},
                {x: -185.600586,y: 1346.937622,z: -25.158556},
                {x: -185.600555,y: 1346.937622,z: -25.158562},
                {x: -186.271179,y: 1347.566528,z: -29.206417},
                {x: -186.659821,y: 1347.858765,z: -31.628014},
                {x: -187.159058,y: 1347.849121,z: -35.141777},
                {x: -187.159058,y: 1347.849121,z: -35.141804},
                {x: -187.472046,y: 1347.743164,z: -37.449009},
                {x: -187.472015,y: 1347.743164,z: -37.449017},
                {x: -187.555389,y: 1347.608521,z: -38.175289},
                {x: -188.207703,y: 1346.300537,z: -44.123177},
                {x: -188.207733,y: 1346.300415,z: -44.123169},
                {x: -188.536682,y: 1344.419678,z: -48.401592},
                {x: -188.652283,y: 1343.742188,z: -49.922089},
                {x: -188.898712,y: 1341.046997,z: -54.47398},
                {x: -188.934113,y: 1340.642578,z: -55.14603},
                {x: -188.934113,y: 1340.642456,z: -55.146027},
                {x: -188.989136,y: 1339.634888,z: -56.58746},
                {x: -189.031219,y: 1338.391602,z: -58.184639},
                {x: -189.138489,y: 1334.605225,z: -62.902706},
                {x: -189.138489,y: 1334.605103,z: -62.902699},
                {x: -189.144897,y: 1333.692505,z: -63.903439},
                {x: -189.173859,y: 1332.524414,z: -65.329903},
                {x: -189.256378,y: 1327.211548,z: -71.472694},
                {x: -189.256348,y: 1327.211548,z: -71.472702},
                {x: -189.247162,y: 1326.736572,z: -71.905144},
                {x: -189.247101,y: 1326.736572,z: -71.905151},
                {x: -189.246948,y: 1326.145508,z: -72.523125},
                {x: -189.246979,y: 1326.145386,z: -72.523148},
                {x: -189.260254,y: 1322.897095,z: -76.017906},
                {x: -189.128845,y: 1317.317627,z: -80.938354},
                {x: -189.128845,y: 1317.317627,z: -80.938377},
                {x: -189.119781,y: 1316.78833,z: -81.428993},
                {x: -189.119751,y: 1316.78833,z: -81.428993},
                {x: -189.010986,y: 1312.66687,z: -84.981499},
                {x: -188.846069,y: 1308.349976,z: -88.344376},
                {x: -188.846039,y: 1308.349976,z: -88.344383},
                {x: -188.624939,y: 1303.057373,z: -92.33519},
                {x: -188.560791,y: 1301.584839,z: -93.42691},
                {x: -188.547028,y: 1301.346313,z: -93.580246},
                {x: -187.971375,y: 1293.113159,z: -98.162094},
                {x: -187.956268,y: 1292.936768,z: -98.240509},
                {x: -187.371613,y: 1286.675293,z: -100.694214},
                {x: -186.735626,y: 1280.961304,z: -102.214554},
                {x: -186.495026,y: 1278.843384,z: -102.743851},
                {x: -186.280701,y: 1277.116577,z: -103.048111},
                {x: -186.280731,y: 1277.116577,z: -103.048096},
                {x: -185.658752,y: 1272.444214,z: -103.576172},
                {x: -185.440277,y: 1270.916992,z: -103.641876},
                {x: -185.440277,y: 1270.916992,z: -103.641861},
                {x: -185.150665,y: 1268.746216,z: -103.882767},
                {x: -185.150696,y: 1268.746216,z: -103.882751},
                {x: -185.581879,y: 1268.756714,z: -103.647629},
                {x: -184.931763,y: 1267.3396,z: -103.81929},
                {x: -184.931793,y: 1267.3396,z: -103.819275},
                {x: -184.553925,y: 1264.752197,z: -103.876923},
                {x: -184.076813,y: 1261.935913,z: -103.477676},
                {x: -184.076813,y: 1261.935913,z: -103.477676},
                {x: -183.827118,y: 1260.384766,z: -103.349655},
                {x: -183.827118,y: 1260.384766,z: -103.349655},
                {x: -183.625061,y: 1259.289185,z: -103.078979},
                {x: -183.625061,y: 1259.289185,z: -103.078964},
                {x: -183.224182,y: 1257.095215,z: -102.563049},
                {x: -183.158813,y: 1256.731812,z: -102.484879},
                {x: -183.158844,y: 1256.731812,z: -102.484863},
                {x: -183.063507,y: 1256.30127,z: -102.266846},
                {x: -181.810944,y: 1250.713379,z: -99.32782},
                {x: -181.810974,y: 1250.713379,z: -99.327805},
                {x: -181.655975,y: 1250.009644,z: -98.977051},
                {x: -181.535645,y: 1249.363892,z: -98.80864},
                {x: -180.499023,y: 1244.65918,z: -96.460358},
                {x: -180.499023,y: 1244.65918,z: -96.460342},
                {x: -180.476105,y: 1244.519531,z: -96.445816},
                {x: -169.726379,y: 1245.197632,z: -87.509918},
                {x: -173.582489,y: 1242.009277,z: -91.599892},
                {x: -179.417053,y: 1238.744507,z: -95.060684},
                {x: -179.417084,y: 1238.744507,z: -95.060654},
                {x: -179.346222,y: 1238.389526,z: -94.93541},
                {x: -179.346252,y: 1238.389526,z: -94.935394},
                {x: -167.182526,y: 1246.541992,z: -82.059258},
                {x: -178.956451,y: 1236.583984,z: -94.090668},
                {x: -178.95639,y: 1236.583984,z: -94.090637},
                {x: -178.117981,y: 1232.491333,z: -92.491737},
                {x: -165.745392,y: 1246.435425,z: -75.486443},
                {x: -165.209564,y: 1245.270264,z: -68.029976},
                {x: -165.369446,y: 1243.439819,z: -59.928432},
                {x: -166.019592,y: 1241.336914,z: -51.4203},
                {x: -166.954468,y: 1239.354004,z: -42.744125},
                {x: -167.968567,y: 1237.884277,z: -34.138443},
                {x: -168.867279,y: 1237.276733,z: -25.821474},
                {x: -169.549286,y: 1237.502319,z: -17.836792},
                {x: -169.960938,y: 1238.339722,z: -10.138809},
                {x: -170.048981,y: 1239.56543,z: -2.681227},
                {x: -169.760315,y: 1240.956787,z: 4.582249},
                {x: -169.041534,y: 1242.290161,z: 11.697918},
                {x: -167.839508,y: 1243.342773,z: 18.712086},
                {x: -166.100952,y: 1243.891235,z: 25.671036},
                {x: -163.772614,y: 1243.712646,z: 32.621075},
                {x: -160.643188,y: 1240.659058,z: 38.702511},
                {x: -160.8013,y: 1242.58374,z: 39.608456},
                {x: -160.8013,y: 1242.58374,z: 39.608456},
                {x: -160.80127,y: 1242.583862,z: 39.608501},
                {x: -160.918182,y: 1244.65918,z: 40.961567},
                {x: -160.918182,y: 1244.65918,z: 40.961575},
                {x: -161.286957,y: 1248.294312,z: 42.180355},
                {x: -161.286896,y: 1248.294434,z: 42.180386},
                {x: -161.60202,y: 1252.282959,z: 44.145863},
                {x: -162.046234,y: 1256.753052,z: 45.709301},
                {x: -162.480164,y: 1260.405273,z: 46.488506},
                {x: -162.703796,y: 1262.115112,z: 46.709087},
                {x: -163.546112,y: 1267.708618,z: 46.654995},
                {x: -163.725281,y: 1268.835815,z: 46.578228},
                {x: -164.373169,y: 1272.81897,z: 46.20245},
                {x: -164.545044,y: 1273.797241,z: 46.020893},
                {x: -165.057068,y: 1276.690674,z: 45.457096},
                {x: -166.386169,y: 1283.712891,z: 43.483028},
                {x: -167.105286,y: 1287.439697,z: 42.339054},
                {x: -167.562164,y: 1289.688354,z: 41.487247}
            ];
            threejs.draw_line_loop(points);
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