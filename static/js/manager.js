var app = angular.module("manager", []); 

app.controller("controller", function($scope, $http, $compile) {

	var Scene = function(name, slides){
		this.name = name;
        this.slides = _.map(slides, function(item){
            return {name: item}
        });
	}

    var Politician = function(name){
        this.name = name;
        this.rumors = [];
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

    var Rumor = function(text, difficulty){
        this.text = text;
        this.difficulty = difficulty;
    }

    $scope.updateResources = function(){
        $http.get("/imageOptions").then(function(response){
            $scope.imageOptions = response.data;
        });
        $http.get("/musicOptions").then(function(response){
            $scope.musicOptions = response.data;
        });
    }
    $scope.updateResources();

    var DifficultyOption = function(code, text, penalty){
        this.code = code;
        this.text = text;
        this.penalty = penalty;
    }

    $scope.getPenalty = function(code){
        return _.findWhere($scope.difficultyOptions, {code: code}).penalty;
    }

    $scope.occupationOptions = [
        "Regente (-8)", "Ministro (-4)", "Secretário (-0)", "Elegível (Não exige teste)"
    ];

    $scope.partyOptions = [
        "Vorlat", "Scwholld", "Rigaud"
    ];

    $scope.difficultyOptions = [
        new DifficultyOption("Easy", "Simples", 0),
        new DifficultyOption("Medium", "Médio", -3),
        new DifficultyOption("Hard", "Difícil", -5)
    ];

    $scope.tab = "Enredo";
    $scope.items = [];
    $scope.scenes = [];
    $scope.images = [];
    $scope.politicians = [];
    $scope.knowledge = {};

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

    $scope.showItemOnConfirm = function(code){
        var item = _.findWhere($scope.items, {code: code});
        var confirm = window.confirm("Deseja mostrar o item "+item.name+" (#"+code+")?");
        if(confirm === true && !_.isUndefined(item)){
            $scope.showItemPassingItem(item);
        }
    }

    $scope.showSceneOnConfirm = function(sceneName){
        var scene = _.findWhere($scope.scenes, {name: sceneName});
        var confirm = window.confirm("Deseja mostrar o ambiente "+scene.name+"?");
        if(confirm === true && !_.isUndefined(scene)){
            $scope.playScenePassingScene(scene);
        }
    }

    $scope.showImageOnConfirm = function(imageName){
        var image = _.findWhere($scope.images, {name: imageName});
        var confirm = window.confirm("Deseja mostrar a imagem "+image.name+"?");
        if(confirm === true && !_.isUndefined(image)){
            $scope.showImagePassingImage(image);
        }
    }

    $scope.showItemPassingItem = function(item){
        $http.post("/orders", {
            item: item
        });
    }

    $scope.showItem = function(){
        var index = $scope.selectedItemIndex;
        var item = $scope.items[index];    
        $scope.showItemPassingItem(item);
    }

    $scope.showImagePassingImage = function(image){
        $http.post("/orders", {
            image: image
        });
    }

    $scope.showImage = function(){
        var index = $scope.selectedImageIndex;
        var image = $scope.images[index];
        $scope.showImagePassingImage(image);
    }

    $scope.hideItem = function(){
        $http.post("/orders", {
            hideItem: true
        });   
    }

    $scope.hideImage = function(){
        $http.post("/orders", {
            hideImage: true
        });   
    }

    $scope.playScenePassingScene = function(scene){
        $http.post("/orders", {
            slides: scene.slides,
            music: scene.music
        });
    }

    $scope.playScene = function(){
        var index = $scope.selectedSceneIndex;
        var scene = $scope.scenes[index];
        $scope.playScenePassingScene(scene);
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

    $scope.removePolitician = function(){
        var index = $scope.selectedPoliticianIndex;
        var politician = $scope.politicians[index];
        if($scope.editingPolitician == true){
            return;
        }
        var index = $scope.politicians.indexOf(politician);
        if (index > -1) {
            $scope.politicians.splice(index, 1);
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

    $scope.removeRumor = function(index){
        if($scope.editingPolitician == false){
            return;
        }
        if (index > -1){
            $scope.politician.rumors.splice(index, 1);
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

    $scope.removeImage = function(){
        var index = $scope.selectedImageIndex;
        var image = $scope.images[index];
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
    $scope.editingPolitician = false;
    $scope.politicianIndex;
    $scope.politician;

    $scope.editPolitician = function(){
        var index = $scope.selectedPoliticianIndex;
        var politician = $scope.politicians[index];
        $scope.editingPolitician = true;
        $scope.politician = JSON.parse(JSON.stringify(politician));
        $scope.politicianIndex = index;
    }

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

    $scope.editImage = function(){
        var index = $scope.selectedImageIndex;
        var image = $scope.images[index];
        $scope.editingImage = true;
        $scope.image = JSON.parse(JSON.stringify(image));
        $scope.imageIndex = index;
    }

    $scope.savePolitician = function(){
        $scope.politicians[$scope.politicianIndex] = $scope.politician;
        
        $scope.editingPolitician = false;
        $scope.politician = null;
        $scope.politicianIndex = null;
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
        $scope.displayItemForManager = true;
        $scope.displayedItem = item;
        document.getElementById("showInManagementImage").src = "/img/"+item.image;
    }

    $scope.action = function(){
    	alert("Ação!");
    }

    $scope.search = function(){
        $scope.displayItemForManager = false;
        $scope.displayedItem = null;
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

    $scope.addPolitician = function(){
        $scope.politicians.push(
            new Politician("Novo político"));
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

    $scope.addRumor = function(){
        var array = $scope.politician.rumors;
        if(_.isUndefined(array)){
            $scope.politician.rumors = []; // migration
            array = $scope.politician.rumors;
        }
        array.push(new Rumor("Boato", $scope.difficultyOptions[0]));
    }

    var transform = function(script){

        var transformedScript = script.replace(/#Item\{(\d*)\}/g, 
            function(match, idString){
                var id = parseInt(idString);
                var item = _.findWhere($scope.items, {code: id});
                if(_.isUndefined(item)){
                    return match;
                }
                return "<span class='itemLink' ng-click='showItemOnConfirm("+id+")'>#"+item.code+" "+item.name+"</span>";
        });

        transformedScript = transformedScript.replace(/#Cena\{(.*)\}/g, 
            function(match, sceneName){
                var scene = _.findWhere($scope.scenes, {name: sceneName});
                if(_.isUndefined(scene)){
                    return match;
                }
                return '<span class="itemLink" ng-click="showSceneOnConfirm(\''+scene.name+'\')">'+scene.name+'</span>';
        });

        transformedScript = transformedScript.replace(/#Imagem\{(.*)\}/g, 
            function(match, imageName){
                var image = _.findWhere($scope.images, {name: imageName});
                if(_.isUndefined(image)){
                    return match;
                }
                return '<span class="itemLink" ng-click="showImageOnConfirm(\''+image.name+'\')">'+image.name+'</span>';
        });

        return transformedScript;
    }

    $scope.saveScript = function(){
        var text = $scope.script;

        var transformedScript = transform($scope.script);

        var el = angular.element(document.getElementById('scriptDiv'));
        el.html(transformedScript);
        $compile(el.contents())($scope);

        $scope.editingScript = false;
    }

    $scope.editScript = function(){
        $scope.editingScript = true;
    }

    if(_.isUndefined($scope.script) || _.isEmpty($scope.script)){
        $scope.editScript();
    }

    $scope.showAhlenFor = function(character){
        $http.post("/orders", {
            politicians: $scope.politicians,
            knowledge: $scope.knowledge,
            chosenCharacter: character
        });
    }

    $scope.hideAhlen = function(){
        $http.post("/orders", {
            hideKnowledge: true,
        });
    }

    $scope.save = function(){
        var file = new Blob([JSON.stringify({
            script: $scope.script,
            items: $scope.items,
            scenes: $scope.scenes,
            images: $scope.images,
            politicians: $scope.politicians,
            knowledge: $scope.knowledge
        })], 
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

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 83 && event.ctrlKey) {
            $scope.save();
            event.preventDefault();
            return false;
        }
    });

    var reader = new FileReader();
    reader.onload = function () {
      var savedJson = JSON.parse(reader.result);
      $scope.script = savedJson.script;
      $scope.items = savedJson.items;
      $scope.scenes = savedJson.scenes;
      $scope.images = savedJson.images;
      $scope.politicians = savedJson.politicians;
      $scope.knowledge = savedJson.knowledge;
      if(_.isUndefined($scope.knowledge)){
        $scope.knowledge = {};
      }
      $scope.saveScript();
      $scope.$apply();
    }

    $scope.load = function(){
        reader.readAsText(document.getElementById("file").files[0]);
    }

});

window.onbeforeunload = function(){
  return 'Lembre-se de salvar antes de fechar a página!';
};