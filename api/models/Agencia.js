/**
 * Agencia.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombre_agencia:{ type: 'string', required: true },
    id_estado: {
      model: "estado"
    },
    email_agencia:{ type: 'string', required: true },
    nombre_vendedor:{ type: 'string', required: true },
    direccion_vendedor:{ type: 'string', required: true },
    telefono_agencia:{ type: 'number', required: true },
    facebook_agencia:{ type: 'string', required: false },
    twitter_agencia:{ type: 'string', required: false },
    instagram_agencia:{ type: 'string', required: false },
    razon_social:{ type: 'string', required: false },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    reservaciones: { collection: 'reservacion', via: 'id_agencia' },


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    id_user: { model: 'user'}

  },

};

