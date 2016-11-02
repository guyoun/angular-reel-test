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
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        var render = function () {
            requestAnimationFrame( render );

            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;

            renderer.render(scene, camera);
        };

        render();
    };

    $scope.init();
}]);