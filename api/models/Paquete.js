/**
 * Paquete.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombre_paquete:{ type: 'string', required: true },
    cantidad_noches:{type: 'number',required: true },
    lugar_salida:{type: 'string', required: true },
    fecha:{type: 'string', required: true },
    observaciones_paquete:{type: 'string', required: false },
    edad_desde:{type: 'number', required: true },
    edad_hasta: {type: 'number', required: true }, 
    properties_paquete:{type: 'string', required: true },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    imagenes: {collection: 'imagen', via: 'id_paquete' },
    reservaciones: {collection: 'reservacion', via: 'id_paquete' },
    itinerario: {collection: 'actividad', via: 'id_paquete' },
    excursiones: {collection: 'excursion', via: 'id_paquete' },
    asientos_reservados: {collection: 'asientoReservado', via: 'id_paquete' },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    id_hotel: { model: 'hotel'},
    id_destino: { model: 'destino'},
    id_tipoBus: { model: 'tipoTransporte'},
    id_estado: { model: 'estado'},

  },

};

