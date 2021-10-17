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

    nombre_paquete:{ type: 'string', required: false },
    descripcion:{type: 'string', required: false },
    destino:{ type: 'string', required: false },
    fecha:{ type: 'ref', columnType: 'DateTime', required: false },
    cantidad_noches:{type: 'string',required: false },
    lugar_salida:{type: 'string', required: false },
    properties_paquete:{type: 'string', required: false },
    edad_desde:{type: 'string', required: false },
    edad_hasta: {type: 'string', required: false }, 
    asientos: {type: 'string', required: false },
    observaciones_paquete:{type: 'string', columnType: 'text', required: false },
    titulo_observaciones:{type: 'string',  required: false },


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
    //id_destino: { model: 'destino'},
    id_tipoBus: { model: 'tipoTransporte'},
    id_estado: { model: 'estado'},

  },

};

