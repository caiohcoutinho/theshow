var app = angular.module("manager", []); 

app.controller("controller", function($scope) {

	var Scene = function(name){
		this.name = name;
	}

    $scope.tab = "Enredo";
    $scope.scenes = [
    	new Scene("Neve"),
    	new Scene("Pântano"),
    	new Scene("Cemitério"),
    	new Scene("Castelo")
    ];

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