/*
* @Author: Ali
* @Date:   2017-02-25 13:31:00
* @Last Modified by:   Ali
* @Last Modified time: 2017-03-02 06:57:14
*/

module.exports = function(app, express, bodyParser, MongoClient, config, swaggerSpec){
    'use strict'

    // connecting to MoogoLab servive.
    var db;
    MongoClient.connect( config.mongoLaClient, (err, database) => {
        if (err) return console.log(err);
        db = database;
        app.listen(app.get('port'), () => {
            console.log('Server is listening on port ' + app.get('port') + '. Press CTRL-C to terminate.');
        });
    });

    /**
     * @swagger
     * definition:
     *   Santa:
     *     properties:
     *       name:
     *         type: string
     *       spouse:
     *         type: string
     *       match:
     *         type: string
     */

    /**
     * @swagger
     * definition:
     *   admin:
     *     properties:
     *       email:
     *         type: string
     *       password:
     *         type: string
     */

    /**
     * @swagger
     * /lastsanta:
     *   get:
     *     tags:
     *       - Santa
     *     description: Returns name of last Santa who registered.
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Object of last Santa
     *         schema:
     *           $ref: '#/definitions/Santa'
     */
    app.get('/lastsanta', (req, res) => {
        var cursor = db.collection('santas').find().limit(1).sort({$natural:-1}).toArray((err, results) => {
             if (err) return console.log(err);
             res.json(results);
        });
    });

    /**
     * @swagger
     * /countsanta:
     *   get:
     *     tags:
     *       - Santa
     *     description: Returns number of Santas in database
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: object with a number in it
     *         schema:
     *           $ref: '#/definitions/Santa'
     */
    app.get('/countsanta', (req, res) => {
        var cursor = db.collection('santas').find().toArray((err, results) => {
             if (err) return console.log(err);
             res.json(results.length);
        });
    });


    /**
     * @swagger
     * /register:
     *   post:
     *     tags:
     *       - Santa
     *     description: Register Sanata, if they have spouse, they are supposed to enter it. At the moment, I couldnt cover removing duplicated santa, and making object for spouse in the same time.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: santa
     *         description: Santa object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Santa'
     *     responses:
     *       200:
     *         description: Successfully created
     */
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


    /**
     * @swagger
     * /myMatch:
     *   post:
     *     tags:
     *       - Santa
     *     description: Gives each Santa his/her match to buys a gift
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: santa
     *         description: Santa object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Santa'
     *     responses:
     *       200:
     *         description: Successfully receieved
     */
    app.post('/myMatch', (req, res) => {
        if (req.body.name.length !== 0 ){
            db.collection('santas').find({ name: req.body.name.toLowerCase()}).toArray((err, results) => {
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

    /**
     * @swagger
     * /makeMatch:
     *   post:
     *     tags:
     *       - Santa
     *     description: Prodives match for each Santa if correct username and password is provided by admin. Shuffling technic is used.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: admin
     *         description: admin is in body. It has emailand password with it.
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/admin'
     *     responses:
     *       200:
     *         description: Successfully receieved
     */
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
                                        {name: santas[j].name}, {$set: {match: matches[j].name}}, {new: true}, (err, doc) => {
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


    /**
     * @swagger
     * /deletefamily:
     *   post:
     *     tags:
     *       - Santa
     *     description: Deletes full Santa collection if correct username and password is provided by admin
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: admin
     *         description: admin is in body. It has email and password with it.
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/admin'
     *     responses:
     *       200:
     *         description: Successfully receieved
     */
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

    // serve swagger
    app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
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
}