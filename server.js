/*
* @Author: Ali
* @Date:   2017-02-22 11:00:40
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-25 13:13:33
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
var db;
MongoClient.connect( config.mongoLaClient, (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(app.get('port'), function(){
        console.log('Server is listening on port ' + app.get('port') + '. Press CTRL-C to terminate.');
    });
});
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());

/******** Routing ********/
app.get('/lastsanta', (req, res) => {
    var cursor = db.collection('santas').find().limit(1).sort({$natural:-1}).toArray((err, results) => {
         if (err) return console.log(err);
         res.json(results);
    });
});

app.get('/countsanta', (req, res) => {
    var cursor = db.collection('santas').find().toArray((err, results) => {
         if (err) return console.log(err);
         res.json(results.length);
    });
});

app.post('/register', (req, res) => {
    if (req.body.name.length !== 0){
        // ideally check if the database is already created anf has something in it
        // ideally check for duplicated santa
        var newSanta = {};
        newSanta.name = req.body.name.toLowerCase();
        newSanta.spouse = req.body.spouse.toLowerCase();
        newSanta.match = '';
        db.collection('santas').save(newSanta, (err, result) => {
            if (err) return console.log(err);
            });
            // I added this to handle duplicated case but it didnot work 
            db.collection('santas').ensureIndex({'name': newSanta.name}, {unique: true, dropDups: true});
            res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.post('/myMatch', (req, res) => {
    if (req.body.name.length !== 0 ){
        db.collection('santas').find({ name: req.body.name }).toArray((err, results) => {
            if (results.length !==0) {
                // Correct name
                res.json(results[0]);
            } else {
                // Wrong name
                res.json(results);
            }
        });
    } else {
        res.redirect('/');
    }
});

app.post('/makeMatch', (req, res) => {
    if (req.body.email.length !== 0 && req.body.pass.length !== 0){
        if (req.body.email === 'admin@smith.com' && req.body.pass === '123'){
             // I am using shuffiling method.
                var santas = [];
                var matches = [];
                var ok = false;
                db.collection('santas').find().toArray((err, results) => {
                    if (err) return console.log(err);
                    santas = results;

                    db.collection('santas').find().toArray((error, outputs) => {
                        if (error) return console.log(error);
                        matches = outputs;

                        //shuffle until a good match
                        var santaLength = santas.length;
                        while(!ok) {
                            shuffle(matches);
                            var i = santaLength -1;
                            while( i >= 0 ){
                                if(santas[i].name === matches[i].name || santas[i].spouse === matches[i].name ){
                                     ok = false;
                                     break;
                                }else{
                                    ok = true;
                                }
                                i -= 1;
                            }
                        }
                        // Once we are in a good shuffle, assign matches and save them
                        if(ok) {
                            var j = santaLength -1;
                            while( j >= 0 ){
                                db.collection('santas').findOneAndUpdate(
                                    {name: santas[j].name}, {$set: {match: matches[j].name}}, {new: true}, function (err, doc) {
                                                            if(err){ console.log("Something wrong when updating data!");}
                                                            j -= 1;
                                                        }
                                );
                                santas[j].match = matches[j].name;
                                j -= 1;
                            }
                        }
                    });
                });
            res.send('We should have a match, now!');
        } else {
            res.status(400).send('Wrong username and password for the admin');
        }
    }

});

app.post('/deletefamily', (req, res)  => {
     if (req.body.email.length !== 0 && req.body.pass.length !== 0){
        if (req.body.email === 'admin@smith.com' && req.body.pass === '123'){
            db.collection('santas').drop((err, doc) => {
                res.send(doc);
            });
        } else {
            res.status(400).send('Wrong username and password for the admin');
        }
     }
  });

/**
 * Shuffles array in place. Fisher-Yates Shuffle 
 * @param {Array} a items The array containing the items.
 * @source http://jsfromhell.com/array/shuffle
 */
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}