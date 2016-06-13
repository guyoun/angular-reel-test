'use strict';

angular.module('myApp.view4', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view4', {
        templateUrl: 'view4/view4.html',
        controller: 'View4Ctrl'
    });
}])
.controller('View4Ctrl', ['$scope', function($scope) {

    $scope.elements = {
        'red': null,
        'blue': null,
        'green': null
    };

    $scope.init = function(){
        // Setup the paper
        var width = 640;
        var height = 480;
        var svgEl = document.getElementById('canvas');

        var paper = Raphael( svgEl, width, height );

        $scope.elements['red'] = paper.circle( 320, 190, 100 ).attr({
            fill: 'red',
            stroke: '#000',
            'stroke-width': 5,
            cursor: 'pointer'
        });

        $scope.elements['blue'] = paper.circle( 270, 240, 100 ).attr({
            fill: 'blue',
            stroke: '#000',
            'stroke-width': 5,
            cursor: 'pointer'
        });

        $scope.elements['green'] = paper.circle( 370, 240, 100 ).attr({
            fill: 'green',
            stroke: '#000',
            'stroke-width': 5,
            cursor: 'pointer'
        });
    };

    $scope.click_button = function(color, direction){
        direction = direction || 'front';

        var element = $scope.elements[color];
        if(direction == 'front'){
            element.toFront();
        }
        else{
            element.toBack();
        }
    };

    $scope.init();
}]);