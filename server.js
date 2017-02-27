/*
* @Author: Ali
* @Date:   2017-02-22 11:00:40
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-26 23:23:54
*/

'use strict'
/******** Requiring libraries ********/
var express = require('express');
var bodyParser= require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;


/******** Setting ********/
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);
var config = require('./config/config.js');
app.use(bodyParser.json());


/******** Routing ********/
app.use(express.static(__dirname + '/public'));
require('./routes/route.js')(app, express, bodyParser, MongoClient, config);

