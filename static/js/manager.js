var app = angular.module("manager", []); 

app.controller("controller", function($scope, $http) {

	var Scene = function(name, slides, image){
		this.name = name;
        this.slides = _.map(slides, function(item){
            return {name: item}
        });
        this.image = image;
	}

    var Item = function(code, name, description, image){
        this.code = code;
        this.name = name;
        this.description = description;
        this.image = image;
    }

    $http.get("/imageOptions").then(function(response){
        $scope.imageOptions = response.data;
    });

    $http.get("/musicOptions").then(function(response){
        $scope.musicOptions = response.data;
    });

    $scope.tab = "Enredo";
    $scope.items = [];
    $scope.scenes = [
    	//new Scene("Neve", ['snow.jpg'], 'chest.jpg'),
    	//new Scene("Pássaro", ['spring.jpg'], 'sword.svg'),
    	//new Scene("Montanha", ['outumn.jpg'], 'gold.png'),
    	//new Scene("Mar", ['summer.jpg'], 'hero.png')
    ];

    $scope.sendSlides = function(scene){
        $http.post("/orders", {
            slides: scene.slides
        });
    }

    $scope.sendMusic = function(scene){
        $http.post("/orders", {
            music: scene.music
        });
    }

    $scope.stopMusic = function(scene){
        $http.post("/orders", {
            stopMusic: true
        });
    }

    $scope.showItem = function(item){
        $http.post("/orders", {
            item: item
        });
    }

    $scope.hideItem = function(item){
        $http.post("/orders", {
            hideItem: true
        });   
    }

    $scope.playScene = function(scene){
        $scope.sendSlides(scene);
        $scope.sendMusic(scene);
    }

    $scope.remove = function(scene){
        if($scope.editingScene == true){
            return;
        }
        var index = $scope.scenes.indexOf(scene);
        if (index > -1) {
            $scope.scenes.splice(index, 1);
        }
    }

    $scope.removeItem = function(item){
        if($scope.editingItem == true){
            return;
        }
        var index = $scope.items.indexOf(item);
        if (index > -1) {
            $scope.items.splice(index, 1);
        }
    }


    $scope.editingItem = false;
    $scope.itemIndex;
    $scope.item;
    $scope.editingScene = false;
    $scope.index;
    $scope.scene;

    $scope.editItem = function(item, index){
        $scope.editingItem = true;
        $scope.item = JSON.parse(JSON.stringify(item));
        $scope.itemIndex = index;
    }

    $scope.editScene = function(scene, index){
        $scope.editingScene = true;
        $scope.scene = JSON.parse(JSON.stringify(scene));
        $scope.index = index;
    }

    $scope.saveScene = function(){
        $scope.itens[$scope.itenIndex] = $scope.iten;
        
        $scope.editingIten = false;
        $scope.iten = null;
        $scope.itenIndex = null;
    }

    $scope.saveScene = function(){
        $scope.scenes[$scope.index] = $scope.scene;
        
        $scope.editingScene = false;
        $scope.scene = null;
        $scope.index = null;
    }

    $scope.saveItem = function(){
        $scope.items[$scope.itemIndex] = $scope.item;
        
        $scope.editingItem = false;
        $scope.item = null;
        $scope.itemIndex = null;
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

    $scope.addItem = function(){
        var codeIsValid = false;
        var code = -1;
        while(!codeIsValid){
            code = Math.floor(Math.random()*10000);
            codeIsValid = _.every($scope.items, function(i){
                return i == undefined || i.code != code;
            });
        }
        $scope.items.push(new Item(code, "Item", "", null));
    }

    $scope.addSlide = function(){
        $scope.scene.slides.push({name: ""});
    }

    $scope.save = function(){
        var file = new Blob([JSON.stringify({a: 1, b: 2, c:3})], 
            {type: "text"});
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = "arquivo";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    var reader = new FileReader();
    reader.onload = function () {
      $scope.fileContent = reader.result;
      $scope.$apply();
    }

    $scope.load = function(){
        reader.readAsText(document.getElementById("file").files[0]);
    }

});