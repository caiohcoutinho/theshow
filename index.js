const express = require('express')
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("static"));

var orders = [];

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

app.listen(3000, () => console.log('The Show is running on port 3000!'));