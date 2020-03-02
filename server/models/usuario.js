// conexiones con base de datos de mongodb
const mongoose = require('mongoose');
// Validacion para que no se repita un valor 
const uniqueValidator = require('mongoose-unique-validator');

// Objeto que guarda validacion de datos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

// Estructura o modelo, llamado esquema.
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // propiedad de valor único
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Metodo para eliminar de la impresion del json con el toJson la propiedad password
usuarioSchema.methods.toJSON = function () {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

// uso de plugin para que el valor sea único
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único'});

module.exports = mongoose.model('usuario', usuarioSchema);