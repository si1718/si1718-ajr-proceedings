/*global angular*/

angular.module("ProceedingManagerApp", ["ngRoute"])
    .config(function($routeProvider) {
        console.log("INFO: Angular app Initialized!");
    
        $routeProvider.when("/", {
            templateUrl: "list.html",
            controller: "ListCtrl"
        }).when("/proceeding/edit/:idProceeding", {
            templateUrl: "edit.html",
            controller: "EditCtrl"
        }).when("/proceeding/create", {
            templateUrl: "create.html",
            controller: "CreateCtrl"
        });
});