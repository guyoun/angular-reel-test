'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', function($scope) {
  var filesvr = "http://xxx.xxx.xxx.xxx/app/filesvr/view/auto_preview/";

  var images = [
    filesvr + "/preset_20150410_e483fbee-1_preview/preview_front.png",
    filesvr + "/preset_20150410_85b625b2-5_preview/preview_front.png",
    filesvr + "/preset_20151021_b18450b5-9_preview/preview_front.png",
    filesvr + "/preset_20150410_f3bed195-4_preview/preview_front.png",
    filesvr + "/preset_20150410_cd43fcf3-8_preview/preview_front.png",
    filesvr + "/preset_20151021_66859754-a_preview/preview_front.png",
    filesvr + "/preset_20150410_cd4c5b42-b_preview/preview_front.png",
    filesvr + "/preset_20150305_f1527a2a-3_preview/preview_front.png",
    filesvr + "/preset_20150304_b24a4b0d-0_preview/preview_front.png",
    filesvr + "/preset_20150304_5caa3788-a_preview/preview_front.png",
    filesvr + "/preset_20150304_3e295770-0_preview/preview_front.png"
  ];

  $scope.imgLoadedEvents = {
    always: function(instance) {
      // Do stuff
      console.log('always');
      alert('all images loaded');
    },
    
    done: function(instance) {
      angular.element(instance.elements[0]).addClass('loaded');
      console.log('done');
    },

    fail: function(instance) {
      // Do stuff
      console.log('fail');
    }
  };

  $scope.images = images;

}]);