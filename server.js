/*
* @Author: Ali
* @Date:   2017-02-22 11:00:40
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-25 13:44:38
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

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());


/******** Routing ********/
require('./routes/route.js')(app, express, bodyParser, MongoClient, config);

