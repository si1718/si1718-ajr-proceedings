/*global angular*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        function initialice(){
            $scope.new_proceeding = {};
        }
        
        $scope.createProceeding = function() {
            if($scope.new_proceeding.coeditors && $scope.new_proceeding.coeditors.length > 0) {
                $scope.new_proceeding.coeditors = $scope.new_proceeding.coeditors.split("\n");
            }
            if($scope.new_proceeding.keywords && $scope.new_proceeding.keywords.length > 0) {
                $scope.new_proceeding.keywords = $scope.new_proceeding.keywords.split(",");
            }
            $http
                .post(API_HTTP, $scope.new_proceeding)
                .then((response) => {
                    $location.path("/");
                }, (err) => {
                    switch(err.status) {
                        case 422:
                            $scope.errorMessage = 'The proceeding is not well-formed: it is necessary a title, year and editor and unique identifier';
                            break;
                        case 409:
                            $scope.errorMessage = 'The proceeding already exists';
                            break;
                        default:
                            $scope.errorMessage = 'The proceeding is not correct';
                    }
                });
        };
        
        initialice();
    }]);