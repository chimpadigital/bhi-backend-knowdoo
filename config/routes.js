/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const ActividadController = require("../api/controllers/ActividadController");

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
  /** APIS de USER */
  'POST /api/user/login': 'UserController.login',
  'POST /api/user/resetPassword': 'UserController.forgotPassword', //ENVÍA NUEVA CONTRASEÑA VÍA CORREO ELECTRÓNICO
  'POST /api/user/updatePassword': 'UserController.changePassword', //CAMBIA CONTRASEÑA DENTRO DE LA SESION DEL USUARIO
  'POST /api/user/forgotPassword': 'UserController.forgot',        //ENVIA LINK DE RESTAURACION DE CONTRASEÑA 

  'GET /api/user/reset': 'UserController.reset',  //VERIFICA SI EL TOKEN DE RECUPERACION ES VALIDO
  'POST /api/user/reset': 'UserController.resetPassword',  //CAMBIA CONTRASEÑA A PARTIR DE TOKEN VALIDO

  /**APIS de AGENCIA */
  'POST /api/agency/create': 'AgenciaController.createAgencyByUser',
  'POST /api/agency/createAgency': 'AgenciaController.createAgency', 
  

  'POST /api/agency/activate': 'AgenciaController.aprobarAgency',
  'POST /api/agency/refuse': 'AgenciaController.rechazarAgency',

  'POST /api/agency/update': 'AgenciaController.updateMyAgency',
  'POST /api/agency/updateAgency': 'AgenciaController.updateAgency',
  

  'GET /api/agency/list_accepted': 'AgenciaController.accepted',
  'GET /api/agency/list_pending': 'AgenciaController.pending',
  'GET /api/agency/list': 'AgenciaController.index',

  'GET /api/agency/get': 'AgenciaController.getAgency',
  'GET /api/agency/show': 'AgenciaController.show',
  'POST /api/agency/get': 'AgenciaController.indexByName',

  'GET /api/agency/getAgenciasByReservaciones': 'AgenciaController.getAgenciasReservaciones',
  
  /** API de SENDMAIL */
  'POST /api/sendMail': 'MailController.send_email', //No se utiliza, los correos se mandan desde las acciones hasta ahora

  /** APIs de DESTINO */
  'POST /api/destino/create': 'DestinoController.create',
  'POST /api/destino/update': 'DestinoController.update',
  'GET /api/destino/delete': 'DestinoController.delete',
  'GET /api/destino/list': 'DestinoController.index',
  'GET /api/destino/get': 'DestinoController.edit',
  'POST /api/destino/updateImage': 'DestinoController.setPicture',
  'GET /api/destino/getImage': 'DestinoController.getPicture',
  'GET /api/destino/deleteImage': 'DestinoController.deletePicture',
  

  /** APIs de HOTEL */
  'POST /api/hotel/create': 'HotelController.create',
  'POST /api/hotel/update': 'HotelController.update',
  'GET /api/hotel/delete': 'HotelController.delete',
  'GET /api/hotel/list': 'HotelController.index',
  'GET /api/hotel/get': 'HotelController.edit',
  'POST /api/hotel/updateImage': 'HotelController.setPicture',
  'GET /api/hotel/getImage': 'HotelController.getPicture',
  'GET /api/hotel/deleteImage': 'HotelController.deletePicture',

  /** APIs de HABITACIONES */
  'POST /api/habitacion/create': 'HabitacionController.create',
  'POST /api/habitacion/createHabitaciones': 'HabitacionController.createHabitaciones',
  'POST /api/habitacion/update': 'HabitacionController.update',
  'POST /api/habitacion/updateHabitaciones': 'HabitacionController.updateHabitaciones',
  'GET /api/habitacion/delete': 'HabitacionController.delete',
  'GET /api/habitacion/deleteHabitaciones': 'HabitacionController.deleteHabitaciones',
  'GET /api/habitacion/list': 'HabitacionController.index',
  'GET /api/habitacion/get': 'HabitacionController.get',

  /* APIs del ITINERARIO*/
  'POST /api/itinerario/create': 'ActividadController.createActividades',
  'POST /api/itinerario/edit': 'ActividadController.editActividades',
  'POST /api/itinerario/deleteActividades': 'ActividadController.deleteActividades',
  'GET /api/itinerario/list': 'ActividadController.index',
  'GET /api/itinerario/delete': 'ActividadController.deleteItinerario',

  /* APIs de EXCURSION*/
  'POST /api/excursion/create': 'ExcursionController.createExcursiones',
  'POST /api/excursion/edit': 'ExcursionController.editExcursiones',
  'POST /api/excursion/deleteExcursiones': 'ExcursionController.deleteExcursiones',
  'GET /api/excursion/list': 'ExcursionController.index',
  'GET /api/excursion/delete': 'ExcursionController.deleteExcursionesPack',
  'POST /api/excursion/updateImage': 'ExcursionController.setPicture',
  'GET /api/excursion/getImage': 'ExcursionController.getPicture',
  'GET /api/excursion/deleteImage': 'ExcursionController.deletePicture',

  /** APIs de IMAGENES */
  'POST /api/imagen/create': 'ImagenController.create',
  'GET /api/imagen/list': 'ImagenController.index',
  'GET /api/imagen/getImage': 'ImagenController.getPicture',
  'POST /api/imagen/deleteImagenes': 'ImagenController.deleteImagenes',
  'GET /api/imagen/delete': 'ImagenController.deleteImagenesPack',
  'GET /api/imagen/deleteImage': 'ImagenController.deletePicture',


  /** APIs de PAQUETE */
  'POST /api/paquete/create': 'PaqueteController.create',
  'POST /api/paquete/update': 'PaqueteController.update',
  'POST /api/paquete/change': 'PaqueteController.changeEstado',
  'GET /api/paquete/delete': 'PaqueteController.delete',
  'GET /api/paquete/get': 'PaqueteController.show',
  'GET /api/paquete/list': 'PaqueteController.packs',
  'GET /api/paquete/all': 'PaqueteController.index',
  'GET /api/paquete/canceled': 'PaqueteController.canceled',
  'POST /api/paquete/search': 'PaqueteController.indexByName',
  'GET /api/paquete/listByDestino': 'PaqueteController.indexByDestino',

  /** APIs de RESERVACION */
  'POST /api/reservacion/create': 'ReservacionController.create',
  'POST /api/reservacion/update': 'ReservacionController.update',
  'POST /api/reservacion/getByCode': 'ReservacionController.indexByCode',
  'GET /api/reservacion/getCode': 'ReservacionController.getCodeReservacion',
  'GET /api/reservacion/check': 'ReservacionController.comprobante',
  'GET /api/reservacion/change': 'ReservacionController.changeEstado',
  'GET /api/reservacion/delete': 'ReservacionController.delete',
  'GET /api/reservacion/get': 'ReservacionController.show',
  'GET /api/reservacion/list': 'ReservacionController.getReservaciones',

  /** APIs de PASAJEROS */
  'POST /api/pasajero/create': 'PasajeroController.create',
  'POST /api/pasajero/update': 'PasajeroController.update',
  'POST /api/pasajero/changeEstados': 'PasajeroController.changeEstadoPasajeros',
  'POST /api/pasajero/deletePasajeros': 'PasajeroController.deletePasajeros',
  'POST /api/pasajero/updateDocumento': 'PasajeroController.updateDoc',
  'POST /api/pasajero/updateFichaMedica': 'PasajeroController.updateFicha',
  'GET /api/pasajero/changeEstadosReserva': 'PasajeroController.changeEstadoReserva',
  'GET /api/pasajero/change': 'PasajeroController.changeEstado',
  'GET /api/pasajero/delete': 'PasajeroController.delete',
  'GET /api/pasajero/deleteReserva': 'PasajeroController.deletePasajerosReserva',
  'GET /api/pasajero/get': 'PasajeroController.show',
  'GET /api/pasajero/list': 'PasajeroController.getPasajeros',
  'GET /api/pasajero/check': 'PasajeroController.comprobante',
  'GET /api/pasajero/deleteDocumento':'PasajeroController.deleteDoc',
  'GET /api/pasajero/deleteFichaMedica':'PasajeroController.deleteFicha',
  'GET /api/pasajero/downloadDocumento': 'PasajeroController.downloadDoc',
  'GET /api/pasajero/downloadFichaMedica': 'PasajeroController.downloadFicha',
};
