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
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true})
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) =>{

                if( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                    
                }


                // para llevar un conteo de registros al final de la busqueda
                Usuario.count({estado: true}, (err, conteo) => {
                   
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });
                
                }); 
            });
});

// Peticion Post insertar nuevo registro
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // metodo bcrypt para encriptar la contraseña
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
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioBorrado)=>{

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !usuarioBorrado ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

});

module.exports = app;