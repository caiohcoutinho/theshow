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
	$scope.showKnowledge = false;
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
				if(data.chosenCharacter != null){
					$scope.showKnowledge = true;
					$scope.knowledge = data.knowledge;
					$scope.politicians = data.politicians;
					$scope.character = data.chosenCharacter;
				}
				if(data.hideKnowledge != null){
					$scope.showKnowledge = false;
					$scope.knowledge = null;
					$scope.politicians = null;
					$scope.character = null;	
				}
			}
		});
	}

	$scope.getRegencyPoliticians = function(){
		return _.filter($scope.politicians, function(item){
			return item.occupation.indexOf("Regente") > -1;
		});
	}

	$scope.getMinistryPoliticians = function(){
		return _.filter($scope.politicians, function(item){
			return item.occupation.indexOf("Ministro") > -1;
		});
	}

	$scope.getSecretaryPoliticians = function(){
		return _.filter($scope.politicians, function(item){
			return item.occupation.indexOf("Secretário") > -1;
		});
	}

	setInterval($scope.getOrders, 500);
});