var app = angular.module("manager", []); 

app.controller("controller", function($scope, $http) {

	var Scene = function(name, slides, image){
		this.name = name;
        this.slides = slides;
        this.image = image;
	}

    $scope.tab = "Enredo";
    $scope.scenes = [
    	new Scene("Neve", ['snow.jpg'], 'chest.jpg'),
    	new Scene("Pássaro", ['spring.jpg'], 'sword.svg'),
    	new Scene("Montanha", ['outumn.jpg'], 'gold.png'),
    	new Scene("Mar", ['summer.jpg'], 'hero.png')
    ];

    $scope.sendSlides = function(scene){
        $http.post("/orders", {
            slides: scene.slides
        });
    }

    $scope.sendImage = function(scene){
        $http.post("/orders", {
            image: scene.image
        });
    }

    $scope.hideImage = function(scene){
        $http.post("/orders", {
            hideImage: true
        });   
    }

    $scope.action = function(){
    	alert("Ação!");
    }

    $scope.search = function(){
    	alert($scope.searchInput);
    }

    $scope.addScene = function(){
    	$scope.scenes.push(new Scene("Nova cena"));
    }
});