var app = angular.module("show", []); 

app.controller("controller", function($scope, $http) {
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
	$scope.showImage = false;
	$scope.show = function(file){
		document.getElementById("image").src = "/img/"+file;
		$scope.showImage = true;
	}
	$scope.hide = function(){
		$scope.showImage = false;
	}
	$scope.slides = [];
	$scope.actualSlide = 0;
	$scope.nextSlide = function(){
		$scope.actualSlide++;
		if($scope.actualSlide >= $scope.slides.length){
			$scope.actualSlide = 0;
		}
		$scope.changeBGImage($scope.slides[$scope.actualSlide]);
	}
	$scope.intervalId;
	$scope.getOrders = function(){
		$http.get("/orders").then(function(response){
			var data = response.data;
			if(data != null && data != ""){
				if(data.slides != null){
					$scope.actualSlide = 0;
					$scope.slides = data.slides;
					window.clearInterval($scope.intervalId);
					$scope.intervalId = setInterval($scope.nextSlide, 1000);
				}
				if(data.image != null){
					$scope.show(data.image);
				}
				if(data.hideImage != null){
					$scope.hide();	
				}
			}
		});
	}

	setInterval($scope.getOrders, 500);
});