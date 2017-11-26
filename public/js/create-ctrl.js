/*global angular*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        function initialice(){
            $scope.new_proceeding = {
                "title": "",
                "year": "",
                "editor": "",
                "coeditors": [],
                "publisher": "",
                "city": "",
                "country": ""
            };
        }
        
        $scope.createProceeding = function() {
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