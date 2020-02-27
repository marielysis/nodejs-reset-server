// Uso de express
const express = require('express');
// Para encriptar la contraseña
const bcrypt = require('bcrypt');
// Hace una copia del objeto filtrando válidos
const _ = require('underscore');
// Interfaz o modelo para la coleccion usuario de db
const Usuario = require('../models/usuario');

const app = express();

// Peticion Get listar registros
app.get('/usuario', function(req, res) {

    Usuario.find({})
            // .limit(5)
            .exec( (err, usuarios) =>{

                if( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarios
                });

            });
    

});

// Peticion Post insertar nuevo registro
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

// Peticion Put actualizar registro
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    // Aplicamos pick de underscore para filtar propiedades válidas
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'] );

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

// Peticion Delete eliminar registro
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

module.exports = app;