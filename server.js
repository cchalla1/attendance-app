var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

app.use(express.static(__dirname + '/Client'));
app.use(express.static(__dirname + '/Views'));

exports.db = mongoose.createConnection('mongodb://heroku_scdnj73g:raiup2rtlui9ei2fi6eja7n5uc@ds159856.mlab.com:59856/heroku_scdnj73g');
exports.autoIncrement = require('mongoose-auto-increment');
exports.autoIncrement.initialize(exports.db);
require("./Models/model.js");
var router = require("./routes");

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(bodyParser.json());

app.use('/', router);
var port = process.env.PORT || "8888";
app.listen(port, function() {
  console.log("Server Started on 8888");
})
