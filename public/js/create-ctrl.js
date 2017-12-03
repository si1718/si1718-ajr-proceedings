/*global angular*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        function initialice(){
            $scope.new_proceeding = {};
                
            $scope.change_editor = 'Validate';
        }
        
        $scope.createProceeding = function() {
            if($scope.new_proceeding.coeditors && $scope.new_proceeding.coeditors.length > 0) {
                $scope.new_proceeding.coeditors = $scope.new_proceeding.coeditors.split("\n");
            }
            if($scope.new_proceeding.keywords && $scope.new_proceeding.keywords.length > 0) {
                $scope.new_proceeding.keywords = $scope.new_proceeding.keywords.split(",");
            }
            
            if($scope.change_editor == 'Validate') {
                $scope.statusEditor();
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
        
        $scope.statusEditor = function() {
            if($scope.change_editor == 'Validate') {
                $http
                    .get('https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers?search='+$scope.new_proceeding.editor.name)
                    .then((response) => { 
                        var researcher = response.data[0];
                        if(researcher) {
                            $scope.new_proceeding.editor = {
                                uri: 'http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/' + researcher.idResearcher,
                                name: researcher.name,
                                viewURL: researcher.viewURL
                            };
                        } else {
                            $scope.new_proceeding.editor = {
                                uri: 'http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/0',
                                name: $scope.new_proceeding.editor.name,
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