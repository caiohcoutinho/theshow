var app = angular.module("manager", []); 

app.controller("controller", function($scope, $http) {

	var Scene = function(name, slides){
		this.name = name;
        this.slides = _.map(slides, function(item){
            return {name: item}
        });
	}

    var Item = function(code, name, description, image){
        this.code = code;
        this.name = name;
        this.description = description;
        this.image = image;
    }

    var Image = function(name, path){
        this.name = name;
        this.path = path;
    }

    $http.get("/imageOptions").then(function(response){
        $scope.imageOptions = response.data;
    });

    $http.get("/musicOptions").then(function(response){
        $scope.musicOptions = response.data;
    });

    $scope.tab = "Enredo";
    $scope.items = [];
    $scope.scenes = [];
    $scope.images = [];

    $scope.sendSlides = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        $http.post("/orders", {
            slides: scene.slides
        });
    }

    $scope.sendMusic = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        $http.post("/orders", {
            music: scene.music
        });
    }

    $scope.stopScene = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        $http.post("/orders", {
            stopMusic: true,
            slides: []
        });
    }

    $scope.showItem = function(){
        var index = $scope.selectedItemIndex;
        var item = $scope.items[index];        
        $http.post("/orders", {
            item: item
        });
    }

    $scope.showImage = function(image){
        $http.post("/orders", {
            image: image
        });
    }

    $scope.hideItem = function(){
        $http.post("/orders", {
            hideItem: true
        });   
    }

    $scope.hideImage = function(image){
        $http.post("/orders", {
            hideImage: true
        });   
    }

    $scope.playScene = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        $http.post("/orders", {
            slides: scene.slides,
            music: scene.music
        });
    }

    $scope.remove = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        if($scope.editingScene == true){
            return;
        }
        var index = $scope.scenes.indexOf(scene);
        if (index > -1) {
            $scope.scenes.splice(index, 1);
        }
    }

    $scope.removeItem = function(){
        var index = $scope.selectedItemIndex;
        var item = $scope.items[index];  
        if($scope.editingItem == true){
            return;
        }
        var index = $scope.items.indexOf(item);
        if (index > -1) {
            $scope.items.splice(index, 1);
        }
    }

    $scope.removeSlide = function(slide){
        if($scope.editingScene == false){
            return;
        }
        var index = $scope.scene.slides.indexOf(slide);
        if (index > -1) {
            $scope.scene.slides.splice(index, 1);
        }
    }

    $scope.removeImage = function(image){
        if($scope.editingImage == true){
            return;
        }
        var index = $scope.images.indexOf(image);
        if (index > -1) {
            $scope.images.splice(index, 1);
        }
    }

    $scope.editingItem = false;
    $scope.itemIndex;
    $scope.item;
    $scope.editingScene = false;
    $scope.index;
    $scope.scene;
    $scope.editingImage = false;
    $scope.imageIndex;
    $scope.image;

    $scope.editItem = function(){
        var index = $scope.selectedItemIndex;
        var item = $scope.items[index];
        $scope.editingItem = true;
        $scope.item = JSON.parse(JSON.stringify(item));
        $scope.itemIndex = index;
    }

    $scope.editScene = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        $scope.editingScene = true;
        $scope.scene = JSON.parse(JSON.stringify(scene));
        $scope.index = index;
    }

    $scope.editImage = function(image, index){
        $scope.editingImage = true;
        $scope.image = JSON.parse(JSON.stringify(image));
        $scope.imageIndex = index;
    }

    $scope.saveImage = function(){
        $scope.images[$scope.imageIndex] = $scope.image;
        
        $scope.editingImage = false;
        $scope.image = null;
        $scope.imageIndex = null;
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

    $scope.showItemInManagement = function(item){
        document.getElementById("image").src = "/img/"+item.image;
    }

    $scope.action = function(){
    	alert("Ação!");
    }

    $scope.search = function(){
        var input = $scope.searchInput;
        var id = parseInt(input);
        if(_.isNaN(id)){
            alert("Digite um código numérico válido: "+input);
            return;
        }
        var item = _.findWhere($scope.items, 
            {code: id});
        if(!_.isUndefined(item)){
            $scope.showItemInManagement(item);
            return;
        } 
        alert("Não foi possível encontrar um item com código: "+id);
    }

    var randomSceneNames = [
        "O Pantano", 
        "As Montanhas Geladas", 
        "A Caverna Amaldiçoada", 
        "O Castelo do Rei", 
        "A Taverna"
    ];

    var randomSceneName = function(){
        var size = _.size(randomSceneNames);
        var index = Math.floor(Math.random()*size);
        return randomSceneNames[index];
    }

    $scope.addScene = function(){
    	$scope.scenes.push(new Scene(randomSceneName()));
    }

    var randomCode = function(){
        var codeIsValid = false;
        var code = -1;
        var limit = 10000;
        var i = 0;
        while(!codeIsValid && i < limit){
            code = Math.floor(Math.random()*10000);
            codeIsValid = _.every($scope.items, function(i){
                return i == undefined || i.code != code;
            });
            i++;
        }
        if(i >= limit){
            throw "error: code invalid";
        }
        return code;
    }

    var randomSwordNames = [
        "Asguliard", 
        "Batedora", 
        "Espinho de Fúria", 
        "Espada de Lâmina Larga", 
        "A Antiga Defensora", 
        "Gládio do Escultor", 
        "Lâmina Larga de Adamantina", 
        "Avassaladora, Lâmina Negra dos Banidos", 
        "A Luz, Lâmina de Visões Tortuosas"
    ];

    var randomSwordDescriptions = [
        "Barata e de baixa qualidade.", 
        "Eu não confiaria nisso se fosse você...", 
        "Seu brilho só é ofuscado pelo seu preço.", 
        "Excelente lâmina. Péssimo cabo.", 
        "Fio de ouro e entalhes em rubis.", 
        "Leve. Equilibrada. Fatal.", 
        "Resistente como aço forjado nos vulcões de Lamnor.", 
        "+2 no NH e no Dano contra Programadores.", 
        "Antiga lâmina utilizada pelo Rei Rammil, do Deserto da Perdição.", 
    ];

    var randomName = function(){
        var size = _.size(randomSwordNames);
        var index = Math.floor(Math.random()*size);
        return randomSwordNames[index];
    }

    var randomDescription = function(){
        var size = _.size(randomSwordDescriptions);
        var index = Math.floor(Math.random()*size);
        return randomSwordDescriptions[index];
    }

    $scope.addItem = function(){
        $scope.items.push(
            new Item(
                randomCode(), randomName(), randomDescription(), null));
    }

    $scope.addImage = function(){
        $scope.images.push(new Image("Nova imagem", ""));
    }

    $scope.addSlide = function(){
        $scope.scene.slides.push({name: ""});
    }

    var transform = function(script){
        // iten
        // ambiente
        // bullets
    }

    $scope.saveScript = function(){
        var text = $scope.script;

        var transformedScript = transform($scope.script);

        // Perform item and bullet transformations.

        document.getElementById("scriptDiv").innerHTML = text;
        $scope.editingScript = false;
    }

    $scope.editScript = function(){
        $scope.editingScript = true;
    }

    if(_.isUndefined($scope.script) || _.isEmpty($scope.script)){
        $scope.editScript();
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