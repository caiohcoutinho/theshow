var app = angular.module("show", []); 

app.controller("controller", function($scope, $http) {
	$scope.music;
	$scope.changeBGImage = function(file){
		if(_.isUndefined(file) && document.body.background != "null"){
			document.body.background = null;
		} else if(!_.isUndefined(file)){
	    	document.body.background = "/img/"+file;
	    }
	}
	$scope.play = function(file){	
		$scope.stop();
		$scope.music = new Audio("/mp3/"+file);
		var promisse = $scope.music.play();
		promisse.then(function(){
			console.log("running");
		}).catch(function(){
			console.log("error");
		});
	}
	$scope.stop = function(){
		if($scope.music != null){
			$scope.music.pause();
			$scope.music.currentTime = 0;
			$scope.music = null;
		}
	}
	$scope.showImage = false;
	$scope.showItem = function(item){
		document.getElementById("image").src = "/img/"+item.image;
		$scope.showImage = true;
		$scope.code = "#"+item.code;
	}
	$scope.showImageFunction = function(image){
		document.getElementById("image").src = "/img/"+image.path;
		$scope.showImage = true;
	}
	$scope.hide = function(){
		$scope.showImage = false;
		$scope.code = null;
	}
	$scope.slides = [];
	$scope.actualSlide = 0;
	$scope.nextSlide = function(){
		$scope.actualSlide++;
		if($scope.actualSlide >= $scope.slides.length){
			$scope.actualSlide = 0;
		}
		var slide = $scope.slides[$scope.actualSlide];
		if(_.isUndefined(slide)){
			$scope.changeBGImage();
		} else{
			$scope.changeBGImage(slide.name);
		}
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
					$scope.intervalId = setInterval($scope.nextSlide, 10000);
					$scope.nextSlide();
				}
				if(data.item != null){
					$scope.showItem(data.item);
				}
				if(data.music != null){
					$scope.play(data.music);
				}
				if(data.image != null){
					$scope.showImageFunction(data.image);
				}
				if(data.hideItem != null || data.hideImage != null){
					$scope.hide();	
				}
				if(data.stopMusic){
					$scope.stop();
				}
			}
		});
	}

	setInterval($scope.getOrders, 500);
});