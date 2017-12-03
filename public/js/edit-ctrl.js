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
                
            $scope.change_editor = 'Validate';
        }
        
        $scope.updateProceeding = function() {
            if($scope.updated_proceeding.coeditors && $scope.updated_proceeding.coeditors.length > 0) {
                $scope.updated_proceeding.coeditors = $scope.updated_proceeding.coeditors.split("\n");
            }
            if($scope.updated_proceeding.keywords && $scope.updated_proceeding.keywords.length > 0) {
                $scope.updated_proceeding.keywords = $scope.updated_proceeding.keywords.split(",");
            }
            
            if($scope.change_editor == 'Validate') {
                $scope.statusEditor();
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
        
        $scope.statusEditor = function() {
            if($scope.change_editor == 'Validate') {
                $http
                    .get('https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers?search='+$scope.updated_proceeding.editor.name)
                    .then((response) => {
                        var researcher = response.data[0];
                        if(researcher) {
                            $scope.updated_proceeding.editor = {
                                uri: 'http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/' + researcher.idResearcher,
                                name: researcher.name,
                                viewURL: researcher.viewURL
                            };
                        } else {
                            $scope.updated_proceeding.editor = {
                                uri: 'http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/0',
                                name: $scope.updated_proceeding.editor.name,
                                viewURL: 'https://si1718-dfr-researchers.herokuapp.com/#!/researchers/0/edit'
                            };
                        }
                        $scope.change_editor = 'Change';
                    }, (err) => {
                        $scope.errorMessage = "An accoured a unexpected error: sorry!";
                        console.log(err.data);
                });
            } else {
                $scope.change_editor = 'Validate';
            }
        };
        
        initialice();
    }]);