var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    path = require('path'),
    app = express();

app.use(express.static(__dirname + '/Client'));
app.use(express.favicon(path.join(config.root, '/', 'favicon.ico')));
app.use(express.static(path.join(config.root, '/')));
app.set('views', config.root + '/views');
// app.use(express.static(__dirname + '/views'));

exports.db = mongoose.createConnection('mongodb://heroku_h4wb4tck:ornq8ql31cf3n6885b6ho0g05n@ds159866.mlab.com:59866/heroku_h4wb4tck');
exports.autoIncrement = require('mongoose-auto-increment');
exports.autoIncrement.initialize(exports.db);
require("./Models/model.js");
var router = require("./routes");

app.engine("html", require("ejs").__express);
app.set("view engine", "html");

app.use(bodyParser.json());

app.use('/', router);
var port = process.env.PORT || "8888";
app.listen(port, function() {
  console.log("Server Started on 8888");
})
