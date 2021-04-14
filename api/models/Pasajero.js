/**
 * Pasajero.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombre_pasajero:{ type: 'string', required: true },
    telefono_pasajero:{ type: 'string', required: false },
    email_pasajero:{ type: 'string', required: false },
    tipo_documento:{ type: 'string', required: false },
    numero_documento:{ type: 'number', required: false },
    observaciones_pasajero:{ type: 'string', required: false },
    imagen_documento:{ type: 'string', required: false },
    ficha_medica:{ type: 'string', required: false },
    nombre_emergencia:{ type: 'string', required: false },
    telefono_emergencia:{ type: 'number', required: false },
    comprobante:{ type: 'string', required: false },
    facebook_pasajero:{ type: 'string', required: false },
    twitter_pasajero:{ type: 'string', required: false },
    instagram_pasajero:{ type: 'string', required: false },
    estado: { type: 'number', defaultsTo: 1 },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    id_tipoHabitacion: { model: 'tipoHabitacion'},
    id_reservacion: { model: 'reservacion'}

  },

};

