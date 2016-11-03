'use strict';

angular.module('myApp.view6', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view6', {
        templateUrl: 'view6/view6.html',
        controller: 'View6Ctrl'
    });
}])
.controller('View6Ctrl', ['$scope', function($scope) {
    function WebGL(){
        this.gl = null; // A global variable for the WebGL context

        this.start = function() {
            var canvas = document.getElementById("glcanvas");

            var gl = this.initWebGL(canvas);      // Initialize the GL context

            // Only continue if WebGL is available and working

            if (gl) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
                gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
                gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
                gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
            }
        }

        this.initWebGL = function(canvas) {
            var gl = null;

            try {
                // Try to grab the standard context. If it fails, fallback to experimental.
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            }
            catch(e) {}

            // If we don't have a GL context, give up now
            if (!gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
                gl = null;
            }
            this.gl = gl;
            return gl;
        }
    }

    $scope.init = function(){
        var webgl = new WebGL();
        webgl.start();
    };

    $scope.init();
}]);