const express = require('express')
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("static"));

var orders = [];
var charKnowledge = {};

app.post('/orders', function(req, res){
	console.log("post orders");
	orders.push(req.body);
	res.send("");
});

app.get('/orders', function(req, res){
	if(orders.length > 0){
		var order = orders.shift(req.body);
		console.log("GET order = "+JSON.stringify(order));
		res.send(order);
	} else{
		console.log("GET no orders ");
		res.send("");
	}
});

app.post('/charKnowledge', function(req, res){
	var knowledge = req.body;
	charKnowledge['F19f74277'] = knowledge['F19f74277'];
	charKnowledge['Gd4d01150'] = knowledge['Gd4d01150'];
	charKnowledge['L53726c85'] = knowledge['L53726c85'];
	res.send("");
});

app.get('/charKnowledge/F19f74277', function(req, res){
	res.send(charKnowledge['F19f74277']);
});

app.get('/charKnowledge/Gd4d01150', function(req, res){
	res.send(charKnowledge['Gd4d01150']);
});

app.get('/charKnowledge/L53726c85', function(req, res){
	res.send(charKnowledge['L53726c85']);
});

app.get('/imageOptions', function(req, res){
	console.log("GET imageOptions");
	var files = [];
	fs.readdirSync("static/img").forEach(file => {
		files.push(file);
	});
	res.send(files);
});

app.get('/musicOptions', function(req, res){
	console.log("GET musicOptions");
	var files = [];
	fs.readdirSync("static/mp3").forEach(file => {
		files.push(file);
	});
	res.send(files);
});

app.listen(3000, () => console.log('The Show is running on port 3000!'));