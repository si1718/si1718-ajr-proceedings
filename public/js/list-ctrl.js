/*global angular*/

var API_HTTP = "/api/v1/proceedings";

angular.module("ProceedingManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh(){
            $http
                .get(API_HTTP)
                .then((response) => {
                    $scope.proceedings = response.data;
                }, (error) => {
                    $scope.errorMessage = "An unexpected error has ocurred.";
                    $scope.hideTable = true;
                });
        }
        
        $scope.deleteProceeding = function(idProceeding) {
            $http
                .delete(API_HTTP + "/" + idProceeding)
                .then((response) => {
                    refresh();
                    $scope.successMessage = "The proceeding with id " + idProceeding + " was deleted successfully.";
                }, (error) => {
                    $scope.errorMessage = "There was an error while deleting the proceeding with id " + idProceeding;
                });
        };
        
        $scope.searchProceeding = function() {
            $http
                .get(API_HTTP, {params: $scope.search_proceeding})
                .then((response) => {
                     $scope.proceedings = response.data;
                     $scope.search_proceeding = {};
                }, (err) => {
                    switch(err.status) {
                        case 404:
                            $scope.errorMessage = "There are no proceedings that match your search";
                            break;
                        default:
                            $scope.errorMessage = "The search is not correct";
                    }
                });
        };
        
        refresh();
    }]);