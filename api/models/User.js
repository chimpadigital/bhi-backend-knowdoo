/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
'use strict';
const bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email_user: { type: 'string', required: true, unique: true },
    password_user: { type: 'string', required: true },
    password_user_temp: { type: 'string' },
    id_roll_user: {
      model: "tipoUsuario"
    },
    id_estado_user: {
      model: "estado"
    },    
    token:{ type: 'string'},


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    agencias: { collection: 'agencia', via: 'id_user' },


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    //Para recuperar contraseñas via link de restauración
    //resetPasswordToken: { type: 'string' },
    //resetPasswordExpires: {   type: 'ref'},

  },

  // Here we encrypt password before creating a User
  beforeCreate(values, next) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            sails.log.error(err);
            return next();
        }

        bcrypt.hash(values.password_user, salt, (err, hash) => {
            if (err) {
                sails.log.error(err);
                return next();
            }
            values.password_user = hash; // Here is our encrypted password
            return next();
        });
    });
},

comparePassword(password, encryptedPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, encryptedPassword, (err, match) => {
            if (err) {
                sails.log.error(err);
                return reject("Something went wrong!");
            }
            if (match) return resolve();
            else return reject("Mismatch passwords");
        });
    });
},
 //para resetear contraseña
generatePassword(pass) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                sails.log.error(err);
                return reject("ERROR");
            }

            bcrypt.hash(pass, salt, (err, hash) => {
                if (err) {
                    sails.log.error(err);
                    return reject("ERROR");
                }
                return resolve(hash);
            });
        });
    });
},

};

