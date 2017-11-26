/*global angular*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        function initialice(){
            $scope.new_proceeding = {};
        }
        
        $scope.createProceeding = function() {
            if($scope.new_proceeding.coeditors.length > 0) {
                $scope.new_proceeding.coeditors = $scope.new_proceeding.coeditors.split("\n");
            }
            $http
                .post(API_HTTP, $scope.new_proceeding)
                .then((response) => {
                    $location.path("/");
                }, (err) => {
                    alert(err.data);
                });
        };
        
        initialice();
    }]);