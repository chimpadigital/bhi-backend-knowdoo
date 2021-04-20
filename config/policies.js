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
  },
  

  AgenciaController: { 
    'createAgencyByUser': true, 
    'createAgency': ['isAuthorized', 'isAdmin'],  
    //'create': ['isAuthorized', 'isAdmin'],    

    'aprobarAgency': ['isAuthorized', 'isAdmin'], 
    'rechazarAgency': ['isAuthorized', 'isAdmin'], 

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
    'edit': ['isAuthorized', 'isAdmin'],
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
    'show': ['isAuthorized', 'isAdmin'], 
    'update':  ['isAuthorized', 'isAdmin'],
    'changeEstado': ['isAuthorized', 'isAdmin'],
    'delete':  ['isAuthorized', 'isAdmin'],
    'packs': true,
    'canceled':  ['isAuthorized', 'isAdmin'],
    'index': ['isAuthorized', 'isAdmin'],
    'indexByName': true,
    'indexByDestino': true,
  },

  ReservacionController:{
    'create': ['isAuthorized', 'isAdmin'],
    'update': ['isAuthorized', 'isAdmin'], 
    'getCodeReservacion': ['isAuthorized', 'isAdmin'],   
    'show': ['isAuthorized', 'isAdmin'],  
    'changeEstado': ['isAuthorized', 'isAdmin'],
    'delete':  ['isAuthorized', 'isAdmin'],
    'indexByCode': ['isAuthorized', 'isAdmin'],
    'getReservaciones': ['isAuthorized', 'isAdmin'],
    'comprobante': ['isAuthorized', 'isAdmin'],
  },

  PasajeroController:{
    'create': ['isAuthorized', 'isAdmin'],
    'update': ['isAuthorized', 'isAdmin'], 
    'show': ['isAuthorized', 'isAdmin'],  
    'changeEstado': ['isAuthorized', 'isAdmin'],
    'changeEstadoPasajeros': ['isAuthorized', 'isAdmin'],
    'changeEstadoReserva': ['isAuthorized', 'isAdmin'],
    'delete':  ['isAuthorized', 'isAdmin'],
    'deletePasajeros':  ['isAuthorized', 'isAdmin'],
    'deletePasajerosReserva':  ['isAuthorized', 'isAdmin'],
    'getPasajeros': ['isAuthorized', 'isAdmin'],
    'comprobante': ['isAuthorized', 'isAdmin'],
    'updateDoc': ['isAuthorized', 'isAdmin'],
    'deleteDoc': ['isAuthorized', 'isAdmin'],
    'updateFicha': ['isAuthorized', 'isAdmin'],
    'deleteFicha': ['isAuthorized', 'isAdmin'],
    'downloadDoc': ['isAuthorized', 'isAdmin'],
    'downloadFicha': ['isAuthorized', 'isAdmin'],
  }

};
