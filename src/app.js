const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const roles = require('./modulos/roles/rutas');
const error = require('./red/errors');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración definimos la constante del puerto
app.set('port', config.app.port)

// rutas
app.use('/api/roles', roles)
app.use(error);

//exportamos app
module.exports = app;