/*global angular*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
        
        function initialice(){
            $http
                .get(API_HTTP + "/" + $routeParams.idProceeding)
                .then((response) => {
                    $scope.updated_proceeding = response.data;
                    
                    if($scope.updated_proceeding.coeditors.length > 0) {
                        $scope.updated_proceeding.coeditors = $scope.updated_proceeding.coeditors.join("\n");
                    }
                    delete $scope.updated_proceeding._id;
                }, (err) => {
                    alert(err.data);
                });
        }
        
        $scope.updateProceeding = function() {
            if($scope.updated_proceeding.coeditors.length > 0) {
                $scope.updated_proceeding.coeditors = $scope.updated_proceeding.coeditors.split("\n");
            }
            
            $http
                .put(API_HTTP + "/" + $scope.updated_proceeding.idProceeding, $scope.updated_proceeding)
                .then((response) => {
                    $location.path("/");
                }, (err) => {
                    alert(err.data);
                });
        };
        
        initialice();
    }]);