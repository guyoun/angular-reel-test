'use strict';

angular.module('myApp.view3', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])

angular.module('myApp.view3').directive('angularReel', ['$timeout',
        function($timeout) {
            'use strict';
            return {
                restrict: 'A',
                scope: {
                    images: '=images',
                    image: '=image',
                    id: '=id',
                    use_magnify:'=useMagnify',
                    control:'=control'
                },
                link: function(scope, element, attrs) {
                    var image_id = 'angular-reel-'+ scope.$id + '-' + scope.id;
                    var large_image_id = image_id + '-large';

                    scope.image_id = image_id;
                    scope.large_image_id = large_image_id;
                    scope.mode = "normal";

                    var reelImages = scope.images;

                    var imgLoad = imagesLoaded($("#"+image_id), function() {
                        $("#"+image_id).reel({
                            shy: true,
                            steppable: false,
                            images: reelImages
                        });

                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    });

                    var change_mode = function(mode){
                        if(!scope.use_magnify)
                            return;

                        mode = mode || null;
                        if(mode != null){
                            if(scope.mode == mode)
                                return;
                        }

                        if(scope.mode == 'normal'){
                            var frame_image_src = $('#'+ image_id).attr('src');
                            var large_image_src = frame_image_src;
                            scope.frame_image_src = frame_image_src;

                            $('#' + large_image_id).magnify({
                                speed: 200,
                                src: large_image_src
                            });
                            scope.mode = 'large';
                        }
                        else{
                            scope.mode = 'normal';
                        }
                    }

                    if(scope.use_magnify == true){
                        element.on('dblclick', function(){
                            if (!scope.$$phase) {
                                scope.$apply(function(){
                                    change_mode();
                                });
                            }
                        });
                    }

                    if(scope.control){
                        scope.control.change_mode = change_mode;
                    }
               },
                templateUrl: 'view3/angular-reel-template.html'
            };
        }
    ])


    .controller('View3Ctrl', ['$scope', function($scope) {
        var items = [{
            'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
            'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
        },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            },
            {
                'image':'/test-angular-app/app/view1/fish/DSCN0691.JPG',
                'images': '/test-angular-app/app/view1/fish/DSCN####.JPG|691..702'
            }];

        $scope.items = items;
        $scope.imgLoadedEvents = {
            always: function(instance) {
                for(var i=0;i<items.length; i++)
                {
                    $('#image-' + i ).reel({
                        images: items[i].images
                    });
                }
                $scope.all_images_loaded = true;
            },

            done: function(instance) {
                console.log('done');
            },

            fail: function(instance) {
                // Do stuff
                console.log('fail');
            }
        };
    }]);