require('./config/config');

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

// Inicialización o carga del express
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Rutas o colecciones en DB
app.use(require('./routes/usuario'));

// Conexión de base de datos
mongoose.connect(process.env.URLDB, 
                {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
                (err, res) => {
 
if (err) throw err;
console.log('Base de datos ONLINE');

});

// salida de puerto
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});