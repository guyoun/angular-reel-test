'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$timeout', function($scope, $timeout) {
  $('#image-fish').reel({
    images:      '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
  });

  //shoe 사진 테스트(magic 360)
  //$('#image-shoe').reel({
  //  images:      '/angular-reel-test/app/view1/shoe/shoe-360-##.JPG|01..36'
  //});

  var items = [{
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    },
    {
      'image':'/angular-reel-test/app/view1/fish/DSCN0691.JPG',
      'images': '/angular-reel-test/app/view1/fish/DSCN####.JPG|691..702'
    }];
    $scope.items = items;

    $timeout(function(){
      for(var i=0;i<items.length; i++)
      {
        $('#image-' + i ).reel({
          images: items[i].images
        });
      }
    }, 1000);

}]);