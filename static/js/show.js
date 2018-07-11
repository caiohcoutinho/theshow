var app = angular.module("show", []); 

app.controller("controller", function($scope) {
	$scope.changeBGImage = function(file){
    	document.body.background = "/img/"+file;
	}
	$scope.play = function(file){	
		var promisse = new Audio("/mp3/"+file).play();
		promisse.then(function(){
			console.log("running");
		}).catch(function(){
			console.log("error");
		});
	}
	$scope.show = function(file){
		document.getElementById("image").src = "/img/"+file;
	}
	$scope.changeBGImage("snow.jpg");
});