/*global angular*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh(){
            $http
                .get(API_HTTP)
                .then((response) => {
                    $scope.proceedings = response.data;
                });
        }
        
        $scope.deleteProceeding = function(idProceeding) {
            $http
                .delete(API_HTTP + "/" + idProceeding)
                .then((response) => {
                    refresh();
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
                            alert('There are no proceedings that match your search');
                            break;
                        default:
                            alert('The search is not correct');
                    }
                });
        };
        
        refresh();
    }]);