/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  UserController: { // Name of your controller
    'login': true,    
    'forgot': true,
    'reset': true,
    'resetPassword': true,
    'forgotPassword': true,
    'changePassword': ['isAuthorized'],  
    //'create': ['isAuthorized', 'isAdmin'],
    'getTotalNewUsers': ['isAuthorized', 'isAdmin'],      
  },
  

  AgenciaController: { 
    'createAgencyByUser': true, 
    'createAgency': ['isAuthorized', 'isAdmin'],  
    //'create': ['isAuthorized', 'isAdmin'],    

    'aprobarAgency': ['isAuthorized', 'isAdmin'], 
    'rechazarAgency': ['isAuthorized', 'isAdmin'], 
    'aprobarAgencias': ['isAuthorized', 'isAdmin'],

    'accepted': ['isAuthorized', 'isAdmin'],   
    'pending': ['isAuthorized', 'isAdmin'],
    'index': ['isAuthorized', 'isAdmin'],

    'indexByName': ['isAuthorized', 'isAdmin'],
    'getAgency': ['isAuthorized', 'isAdmin'],
    'show': ['isAuthorized'],
    'getAgenciasReservaciones': ['isAuthorized', 'isAdmin'],

    'updateMyAgency': ['isAuthorized'],
    'updateAgency': ['isAuthorized', 'isAdmin'],
    //'update': ['isAuthorized', 'isAdmin'],
  },

  MailController:{
    'send_email': ['isAuthorized', 'isAdmin'],
  },

  DestinoController:{
    'create': ['isAuthorized', 'isAdmin'],
    'update': ['isAuthorized', 'isAdmin'],
    'delete': ['isAuthorized', 'isAdmin'],
    'index': ['isAuthorized', 'isAdmin'],
    'edit': ['isAuthorized', 'isAdmin'],
    'deletePicture': ['isAuthorized', 'isAdmin'],
    'setPicture': ['isAuthorized', 'isAdmin'],
    'getPicture': ['isAuthorized', 'isAdmin'],
  },
    HotelController:{
    'create': ['isAuthorized', 'isAdmin'],
    'update': ['isAuthorized', 'isAdmin'],
    'delete': ['isAuthorized', 'isAdmin'],
    'index': ['isAuthorized', 'isAdmin'],
    'edit': ['isAuthorized'],
    'deletePicture': ['isAuthorized', 'isAdmin'],
    'setPicture': ['isAuthorized', 'isAdmin'],
    'getPicture': ['isAuthorized', 'isAdmin'],
  },
  HabitacionController:{
    'create': ['isAuthorized', 'isAdmin'],
    'createHabitaciones': ['isAuthorized', 'isAdmin'],
    'update': ['isAuthorized', 'isAdmin'],
    'updateHabitaciones': ['isAuthorized', 'isAdmin'],
    'index': ['isAuthorized', 'isAdmin'],
    'get': ['isAuthorized', 'isAdmin'],

  },
  ActividadController: {
    'createActividades': ['isAuthorized', 'isAdmin'],
    'editActividades': ['isAuthorized', 'isAdmin'],
    'deleteItinerario': ['isAuthorized', 'isAdmin'],
    'deleteActividades': ['isAuthorized', 'isAdmin'],
    'index': true, 
    'getItinerarioSlider': ['isAuthorized'],        
  },

  ExcursionOpcionalController:{
    'createExcursiones': ['isAuthorized', 'isAdmin'],
    'getExcursionesSlider': ['isAuthorized'],
    'index': true,
    'deleteExcursiones': ['isAuthorized', 'isAdmin'],
  },

  ExcursionController: {
    'createExcursiones': ['isAuthorized', 'isAdmin'],
    'editExcursiones': ['isAuthorized', 'isAdmin'],
    'deleteExcursionesPack': ['isAuthorized', 'isAdmin'],
    'deleteExcursiones': ['isAuthorized', 'isAdmin'],
    'index': true,
    'deletePicture': ['isAuthorized', 'isAdmin'],
    'setPicture': ['isAuthorized', 'isAdmin'],
    'getPicture': ['isAuthorized', 'isAdmin'],
  },

  ImagenController: {
    'create': ['isAuthorized', 'isAdmin'],
    'index': true,
    'getPicture': ['isAuthorized', 'isAdmin'],
    'deletePicture': ['isAuthorized', 'isAdmin'],
    'deleteImagenesPack': ['isAuthorized', 'isAdmin'],
    'deleteImagenes': ['isAuthorized', 'isAdmin'],
    
  },
  
  PaqueteController:{
    'create': ['isAuthorized', 'isAdmin'], 
    'show': ['isAuthorized'], 
    'update':  ['isAuthorized', 'isAdmin'],
    'updateObservaciones':  ['isAuthorized', 'isAdmin'],
    'changeEstado': ['isAuthorized', 'isAdmin'],
    'delete':  ['isAuthorized', 'isAdmin'],
    'packs': true,
    'canceled':  ['isAuthorized', 'isAdmin'],
    'index': ['isAuthorized', 'isAdmin'],
    'indexByNombre': true,
    'indexByMes': true, 
    'searchPaquete': ['isAuthorized'],
    'getPacksReservadosByAgencia': ['isAuthorized'],
    'getPacksTop': true,
    'getHabitacionesPaquetePasajero': ['isAuthorized'],
    'hasExcursiones': ['isAuthorized', 'isAdmin'],
    'hasItinerario': ['isAuthorized', 'isAdmin'],
  },

  TipoTransporteController:{
    'get': ['isAuthorized'],
    'index': ['isAuthorized'],
    'getById': ['isAuthorized'],
  },

  TipoHabitacionController:{
    'index': ['isAuthorized'], 
    'getById': ['isAuthorized'],   
  },
  TipoCamaController:{
    'index': ['isAuthorized'],    
  },

  ReservacionController:{
    'create': ['isAuthorized'],
    'update': ['isAuthorized'], 
    'getCodeReservacion': ['isAuthorized'],   
    'show': ['isAuthorized'],  
    'changeEstado': ['isAuthorized'],
    'delete':  ['isAuthorized'],
    'indexByCode': ['isAuthorized'],
    'getReservaciones': ['isAuthorized'],
    'comprobante': ['isAuthorized'],
    'getTotalVentasMes': ['isAuthorized'],
    'getAsientosPaquete': ['isAuthorized'],
    'mostrarResumenReservacion': ['isAuthorized'],
    'getCantidadReservaciones': ['isAuthorized', 'isAdmin'],
  },

  PasajeroController:{
    'create': ['isAuthorized'],
    'createPasajeros': ['isAuthorized'],
    'update': ['isAuthorized'], 
    'show': ['isAuthorized'],  
    'changeEstado': ['isAuthorized'],
    'changeEstadoPasajeros': ['isAuthorized'],
    'changeEstadoReserva': ['isAuthorized'],
    'delete':  ['isAuthorized'],
    'deletePasajeros':  ['isAuthorized'],
    'deletePasajerosReserva':  ['isAuthorized'],
    'getPasajeros': ['isAuthorized'],
    'comprobante': ['isAuthorized'],    
    'deleteDoc': ['isAuthorized'],    
    'deleteFicha': ['isAuthorized'],
    'downloadDoc': ['isAuthorized'],
    'downloadFicha': ['isAuthorized'],
    'getPasajerosAgencia': ['isAuthorized'],
    'getPasajerosAgenciaSearch': ['isAuthorized'],
    'getDocs': ['isAuthorized'],
    'getFichas': ['isAuthorized'],    
  }

};
