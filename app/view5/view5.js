'use strict';

angular.module('myApp.view5', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view5', {
        templateUrl: 'view5/view5.html',
        controller: 'View5Ctrl'
    });
}])
.controller('View5Ctrl', ['$scope', function($scope) {
    $scope.init = function(){
        var scene = new THREE.Scene(); // Create a Three.js scene object.
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.

        var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
        renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the WebGL viewport.
        document.body.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

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

    $scope.init();
}]);