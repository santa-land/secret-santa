/*
* @Author: Ali
* @Date:   2017-02-22 11:00:40
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-22 16:32:54
*/

/******** Requiring libraries ********/
var express = require('express');
var bodyParser= require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;



/******** Setting ********/
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);
var config = require('./config/config.js');
var db;
MongoClient.connect( config.mongoLaClient, (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(app.get('port'), function(){
        console.log('Server is listening on port ' + app.get('port') + '. Press CTRL-C to terminate.');
    });
});

/******** Routing ********/
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
});

app.post('/register', (req, res) => {
    req.body.match = '';
    db.collection('gifters').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.redirect('/');
    });

});

