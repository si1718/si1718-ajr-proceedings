/*global angular*/

var API_HTTP = "/api/v1/proceedings";

angular.module("ProceedingManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
        
        function initialice(){
            $http
                .get(API_HTTP + "/" + $routeParams.idProceeding)
                .then((response) => {
                    $scope.updated_proceeding = response.data;
                    
                    if($scope.updated_proceeding.coeditors && $scope.updated_proceeding.coeditors.length > 0) {
                        $scope.updated_proceeding.coeditors = $scope.updated_proceeding.coeditors.join("\n");
                    }
                    if($scope.updated_proceeding.keywords && $scope.updated_proceeding.keywords.length > 0) {
                        $scope.updated_proceeding.keywords = $scope.updated_proceeding.keywords.join(",");
                    }
                    
                    delete $scope.updated_proceeding._id;
                }, (err) => {
                    $scope.errorMessage = "An accoured a unexpected error: sorry!";
                    console.log(err.data);
                });
        }
        
        $scope.updateProceeding = function() {
            if($scope.updated_proceeding.coeditors && $scope.updated_proceeding.coeditors.length > 0) {
                $scope.updated_proceeding.coeditors = $scope.updated_proceeding.coeditors.split("\n");
            }
            if($scope.updated_proceeding.keywords && $scope.updated_proceeding.keywords.length > 0) {
                $scope.updated_proceeding.keywords = $scope.updated_proceeding.keywords.split(",");
            }
            
            $http
                .put(API_HTTP + "/" + $scope.updated_proceeding.idProceeding, $scope.updated_proceeding)
                .then((response) => {
                    $location.path("/");
                }, (err) => {
                    switch(err.status) {
                        case 400:
                            $scope.errorMessage = 'The proceeding has not a unique identifier';
                            break;
                        case 404:
                            $scope.errorMessage = 'The proceeding has not found';
                            break;
                        default:
                            $scope.errorMessage = 'The proceeding is not correct';
                    }
                });
        };
        
        initialice();
    }]);