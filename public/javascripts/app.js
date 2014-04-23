var app = angular.module('goalkeeperApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize'
]);

// Main controller for the main.jade page
app.controller("MainController", function($scope){
	$scope.understand = "I now understand how the scope works!";
});