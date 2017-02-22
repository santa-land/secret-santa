/*
* @Author: Ali
* @Date:   2017-02-22 11:00:40
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-22 14:09:04
*/

/******** Requiring libraries ********/
var express = require('express');
var bodyParser= require('body-parser');
var app = express();


/******** Setting ********/
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 3000);


/******** Routing ********/
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
});

app.post('/register', (req, res) => {
    console.log('Hellooooooooooooooooo!');
    console.log(req.body);
});

app.listen(app.get('port'), function(){
    console.log('Server is listening on port ' + app.get('port') + '. Press CTRL-C to terminate.');
});