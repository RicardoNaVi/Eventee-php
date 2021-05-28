'use strict';
const express = require('express');
var bodyParser = require('body-parser');
var app = express();
const logger = require('morgan');

//Midlewares:
app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 1000000}))
app.use(express.static('public', {index:false}));

//---------------Routes---------------

const r_index = require('./routes/index');
const r_API = require('./routes/webservices');

app.use('/',r_index);
app.use('/webservices',r_API);

//------------------------------------

// ERROR 404 Handling
app.use(function(req, res, next) {
    res.status(404).send('No se encontró el contenido solicitado');
});

// ERROR 500 Handling
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});


// Starting the server
var port = process.env.PORT || 3000;
app.listen(port, function (err) {
    if (err) throw err;
    console.log("Development mode:\nActived in http://localhost:"+(process.env.PORT || 3000));
});
