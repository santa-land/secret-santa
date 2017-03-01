/*
* @Author: Ali
* @Date:   2017-02-22 11:00:40
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-28 17:27:26
*/

'use strict'
/******** Requiring libraries ********/
var express = require('express');
var bodyParser= require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var swaggerJSDoc = require('swagger-jsdoc');


/******* Swagger *********/ 
// swagger definition
var swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating Secret Santa RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);


/******** Setting ********/
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);
var config = require('./config/config.js');
app.use(bodyParser.json());


/******** Routing ********/
app.use(express.static(__dirname + '/public'));
require('./routes/route.js')(app, express, bodyParser, MongoClient, config, swaggerSpec);

