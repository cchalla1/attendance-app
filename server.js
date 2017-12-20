var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    path = require('path'),
    app = express();

app.use(express.static(__dirname + '/Client'));
app.use(express.static(path.resolve(__dirname, '../Views'));

exports.db = mongoose.createConnection('mongodb://heroku_cn8x6ssd:ams34smgu5v1lhdlh46rplioav@ds155644.mlab.com:55644/heroku_cn8x6ssd');
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
