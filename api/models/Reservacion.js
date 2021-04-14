/**
 * Reservacion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    
    cantidad_adultos:{ type: 'number', required: true },
    cantidad_menores:{ type: 'number', required: true },
    cantidad_bebes:{ type: 'number', required: false },

    cantidad_doble:{ type: 'number', required: false },
    cantidad_individual:{ type: 'number', required: false },
    cantidad_triple:{ type: 'number', required: false },
    cantidad_cuadruple:{ type: 'number', required: false },

    cantidad_twin:{ type: 'number', required: false },
    cantidad_matrimonial:{ type: 'number', required: false },

    codigo: { type: 'string', required: false },
    estado: { type: 'number', defaultsTo: 0 },
    fecha_registro: { type: 'string', columnType: 'DateTime', required: false },
    comprobante: { type: 'string', required: false },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    pasajeros: { collection: 'pasajero', via: 'id_reservacion' },
    asientos_reservados: {collection: 'asientoReservado', via: 'id_reserva' },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    id_agencia: { model: 'agencia'},
    id_paquete: { model: 'paquete'},
    //id_transporte: { model: 'transporte'}

  },

};

