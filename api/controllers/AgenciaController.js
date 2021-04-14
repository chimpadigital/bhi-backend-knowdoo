/**
 * AgenciaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  
    createAgencyByUser: async function(req, res) { //Crea una agencia como ususario sin ser usuario del sistema
        const data = req.body;        
        
        //Crear el objeto usuario si no existe usuario con el mismo email
        var existUser = await User.findOne({ email_user: data.email });
        if(existUser === null || existUser === undefined) {
            var createdUser = await User.create({
                email_user: data.email,
                password_user: data.password,
                id_roll_user: 2,
                id_estado_user: 2,                
            }).fetch();
            //Crear el objeto Agencia si se crea el objeto User
            if(createdUser !== null && createdUser !== undefined) {
                var createdAgencia = await Agencia.create({
                    nombre_agencia: data.name,
                    id_estado: 2,
                    email_agencia: data.email,
                    nombre_vendedor: data.vendedor,
                    direccion_vendedor: data.direccion,
                    telefono_agencia: data.telefono,
                    facebook_agencia: data.facebook,
                    twitter_agencia: data.twitter,
                    instagram_agencia: data.instagram,
                    id_user: createdUser.id,
                }).fetch(); 
                //Actualizar token con id de user y enviar email
                if(createdAgencia !== null && createdAgencia !== undefined) {
                    // Set token del user
                    createdUser = await User.updateOne({ id: createdUser.id })
                        .set({token: jwToken.issue({ id: createdUser.id })});
                    // Send email de notifcación al usuario creado
                    var notificacion = {
                        email: createdUser.email_user,
                        msg: 'Usted se ha registrado en el Sistema BIH Viajes. Espere un correo de confirmación para usar sus credenciales.',
                    };
                    Mailer.sendNotificacionMail(notificacion, res); 
                    // Send email de notifcación al administrador del sitio
                    var adminUser = await User.findOne({ id: 1 });
                    var notificacion = {
                        email: adminUser.email_user,
                        msg: 'Una Agencia nueva se ha registrado en el sitio y espera confirmación.',
                    };
                    Mailer.sendNotificacionMail(notificacion, res); 
                } else {
                    await User.destroyOne({id: createdUser.id});
                    return res.serverError("Something went wrong"); 
                }    
            } 
        } else {
            return res.send({ code: "ERR", msg: "USER_EMAIL_EXIST" });
        }
    },

    createAgency: async function(req, res) { //Crea una agencia como ususario
        const data = req.body;

        //Obtener el objeto rol según el identificador, por defecto para una agencia es el rol Agencia
        var userType = await TipoUsuario.findOne({id: parseInt(data.rol)});
        if(userType === null || userType === undefined) {
            return res.badRequest("There is no user type in the database.");    
        }

        //obtener el estado según el identificador, por defecto para e registro de una agencia es estado Inactivo 
        var state = await Estado.findOne({id: parseInt(data.estado)});
        if(state === null || state === undefined) {
            return res.badRequest("There is no user state in the database.");    
        }
        
        //Crear el objeto usuario si no existe usuario con el mismo email
        var existUser = await User.findOne({ email_user: data.email });
        if(existUser === null || existUser === undefined) {
            var createdUser = await User.create({
                email_user: data.email,
                password_user: data.password,
                id_roll_user: userType.id,
                id_estado_user: state.id,                
            }).fetch();
            //Crear el objeto Agencia si se crea el objeto User
            if(createdUser !== null && createdUser !== undefined) {
                var createdAgencia = await Agencia.create({
                    nombre_agencia: data.name,
                    id_estado: state.id,
                    email_agencia: data.email,
                    nombre_vendedor: data.vendedor,
                    direccion_vendedor: data.direccion,
                    telefono_agencia: data.telefono,
                    facebook_agencia: data.facebook,
                    twitter_agencia: data.twitter,
                    instagram_agencia: data.instagram,
                    id_user: createdUser.id,
                }).fetch(); 
                //Actualizar token con id de user y enviar email
                if(createdAgencia !== null && createdAgencia !== undefined) {
                    // Set token del user
                    createdUser = await User.updateOne({ id: createdUser.id })
                        .set({token: jwToken.issue({ id: createdUser.id })});   
                    return res.send({ code: "OK", msg: "AGENCY_CREATED", data: createdAgencia });                      
                } else {
                    await User.destroyOne({id: createdUser.id});
                    return res.serverError("Something went wrong"); 
                }    
            } 
        } else {
            return res.send({ code: "ERR", msg: "USER_EMAIL_EXIST" });
        }
    },

    create: async function(req, res) {
        const data = req.body;

        //obtener el estado según el identificador, por defecto para e registro de una agencia es estado Inactivo 
        var state = await Estado.findOne({id: parseInt(data.estado)});
        if(state === null || state === undefined) {
            return res.badRequest("There is no user state in the database.");    
        }
        
        //Crear el objeto usuario si no existe usuario con el mismo email
        var existUser = await User.findOne({ id: parseInt(data.id_user) });
        //Crear el objeto Agencia si existe el objeto User
        if(existUser !== null && existUser !== undefined) {
            var createdAgencia = await Agencia.create({
                nombre_agencia: data.name,
                id_estado: state.id,
                email_agencia: data.email,
                nombre_vendedor: data.vendedor,
                direccion_vendedor: data.direccion,
                telefono_agencia: data.telefono,
                facebook_agencia: data.facebook,
                twitter_agencia: data.twitter,
                instagram_agencia: data.instagram,
                id_user: existUser.id,
            }).fetch(); 
            //Enviar email
            if(createdAgencia !== null && createdAgencia !== undefined) {
                return res.send({ code: "OK", msg: "AGENCY_CREATED", data: createdAgencia }); 
            } else {
                await User.destroyOne({id: createdUser.id});
                return res.serverError("Something went wrong"); 
            }    
        } else {
            return res.send({ code: "ERR", msg: "USER_NO_EXIST" });
        }
    },

    changeEstado: async function(req, res, next) {
        const data = req.body;
        var state = await Estado.findOne({id: parseInt(data.estado)});
        if(state === null || state === undefined) {
            return res.badRequest("El identificador del estado no existe en la BD");    
        }

        var updatedAgency = await Agencia.updateOne({ id: data.id }).set({
            id_estado: state.id
        });
        
        if(updatedAgency !== null && updatedAgency !== undefined) {
            return res.send({ code: "OK", msg: "AGENCY_CHANGE_STATE_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "AGENCY_CHANGE_STATE_ERROR" });
        }    
    },

    aprobarAgency: async function(req, res, next) {
        const data = req.body;
        //cambiar el estado de la agencia a Activo
        var updatedAgency = await Agencia.updateOne({ id: data.id }).set({
            id_estado: 1
        });            
        if(updatedAgency !== null && updatedAgency !== undefined) {
            updatedAgency = await Agencia.findOne({ id: data.id }).populate('id_user');
            if(updatedAgency !== null && updatedAgency !== undefined) {
                //cambiAr el estado del usuario a activo
                var user = await User.findOne({id: updatedAgency.id_user.id});
                if (user !== null && user !== undefined){
                    var updatedUser = await User.updateOne({ id: user.id }).set({
                        id_estado_user: 1
                    });
                    //enviar notificacion por email
                    if (updatedUser !== null && updatedUser !== undefined){
                        var notificacion = {
                            email: updatedAgency.email_agencia,
                            msg: 'Su registro ha sido aceptado en BIH Viajes. Utilice sus credenciales para ingresar al Sistema',
                        };
                        Mailer.sendNotificacionMail(notificacion, res); 
                    } else {
                        return res.serverError("Something went wrong");   
                    }
                } else {
                    return res.serverError("Something went wrong");
                }   
            } else {
                return res.send({ code: "ERR", msg: "AGENCY_NOT_FOUND" });  
            }                                       
        } else {
            return res.send({ code: "ERR", msg: "AGENCY_CHANGE_STATE_ERROR" });
        }                
    },

    rechazarAgency: async function(req, res, next) {
        const data = req.body;
        var deleteAgency = await Agencia.findOne({ id: data.id }).populate('id_user');
        if(deleteAgency !== null && deleteAgency !== undefined) {
            var email = deleteAgency.email_agencia;
            var idUser  = deleteAgency.id_user.id;
            var idAgencia = deleteAgency.id;
            await Agencia.destroyOne({id: idAgencia}); //eliminar agencia
            await User.destroyOne({id: idUser}); //eliminar usuario
            //enviar correo de notificacion
            var notificacion = {
                email: email,
                msg: 'Su registro no ha sido aceptado en BIH Viajes. Sus datos han sido eliminados del Sistema.',
            };
            Mailer.sendNotificacionMail(notificacion, res); 

        } else {
            return res.send({ code: "ERR", msg: "AGENCY_NOT_FOUND" });
        }
    },


    delete: async function(req, res, next) {
        User.destroy(req.param('id'), function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.send({ code: "ERR", msg: "AGENCY_DELETE_sUCCESS" });
        });
    },

    accepted: async function(req, res, next) {
        var list = await Agencia.find().where({'id_estado': 1})
            .sort('nombre_agencia ASC').populate('id_user').populate('id_estado');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    pending: async function(req, res, next) {
        var list = await Agencia.find().where({'id_estado': 2})
            .sort('id ASC').populate('id_user').populate('id_estado');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    index: async function(req, res, next) {
        var list = await Agencia.find()
            .sort('nombre_agencia ASC').populate('id_user').populate('id_estado');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    indexByName:async function(req, res, next) {
        const data = req.body;
        var list = await Agencia.find().where({
            or: [
                {'nombre_agencia': {contains: data.search}},
                {'email_agencia': {contains: data.search}},
            ]
        }).sort('nombre_agencia ASC').populate('id_user').populate('id_estado');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    getAgency:async function(req, res, next) {
        var agency = await Agencia.findOne(req.param('id')).populate('id_user').populate('id_estado');
        if(agency !== null && agency !== undefined) {
            return res.json(agency);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    show: async function(req, res, next) { //devuelve la agencia del usuario autenticado
        token = req.headers.authorization;
        var foundedUser = await User.findOne({ token: token.replace("Bearer ", "")})
            .populate('id_roll_user').populate('id_estado_user');
        if(foundedUser !== null && foundedUser !== undefined) {
            if(foundedUser.id_roll_user.nombre === 'Agencia'){
                var agency = await Agencia.findOne().where({'id_user': foundedUser.id})
                    .populate('id_user').populate('id_estado');
                if(agency !== null && agency !== undefined) {
                    return res.json(agency);
                } else {
                    return res.serverError("Something went wrong"); 
                }
            } else {
                return res.send({ code: "ERR", msg: "USER_WHITOUT_AGENCY" });
            }            
        } else {
            return res.send({ code: "ERR", msg: "USER_NOT_FOUND" }); 
        }
    },

    updateMyAgency: async function(req, res, next) { //usuario actualiza su agencia
        var token = req.headers.authorization;
        const data = req.body;

        //Obtener usuario del token
        var foundedUser = await User.findOne({ token: token.replace("Bearer ", "")});
        if(foundedUser === null || foundedUser === undefined) {
            return res.send({ code: "ERR", msg: "USER_NOT_FOUND" });    
        }
        //Obtener agencia 
        var agency = await Agencia.findOne({'id': data.id});
        if(agency === null || agency === undefined) {
            return res.send({ code: "ERR", msg: "AGENCY_NOT_FOUND" });    
        }
        //Verificar que la agencia sea del usuario autenticado
        if(agency.id_user !== foundedUser.id || foundedUser.id_estado_user === 2){
            return res.send({ code: "ERR", msg: "NOT_AUTHORIZED" });    
        }
        //Actualizar datos de usuario
        var updatedRecords = await User.updateOne({ id: foundedUser.id }).set({
            email_user: data.email,            
        });
        //Actualizar datos de agencia
        if(updatedRecords !== null && updatedRecords !== undefined) {
            updatedRecords = await Agencia.updateOne({ id: agency.id }).set({
                nombre_agencia: data.name,
                email_agencia: data.email,
                nombre_vendedor: data.vendedor,
                direccion_vendedor: data.direccion,
                telefono_agencia: data.telefono,  
                facebook_agencia: data.facebook,
                twitter_agencia: data.twitter,
                instagram_agencia: data.instagram,          
            });
            if(updatedRecords !== null && updatedRecords !== undefined) {
                return res.send({ code: "OK", msg: "AGENCY_EDIT_SUCCESS" });
            } else {
                return res.send({ code: "ERR", msg: "AGENCY_EDIT_ERROR" });
            };                 
        } else {
            return res.send({ code: "ERR", msg: "USER_EDIT_ERROR" });
        }
    },

    updateAgency: async function(req, res, next) { //actualizar agencia por admin
        const data = req.body;

        //Obtener agencia 
        var agency = await Agencia.findOne({'id': data.id});
        if(agency === null || agency === undefined) {
            return res.send({ code: "ERR", msg: "AGENCY_NOT_FOUND" });    
        }
        
        //Actualizar datos de usuario
        var updatedRecords = await User.updateOne({ id: agency.id_user }).set({
            email_user: data.email,            
        });
        //Actualizar datos de agencia
        if(updatedRecords !== null && updatedRecords !== undefined) {
            updatedRecords = await Agencia.updateOne({ id: agency.id }).set({
                nombre_agencia: data.name,
                email_agencia: data.email,
                nombre_vendedor: data.vendedor,
                direccion_vendedor: data.direccion,
                telefono_agencia: data.telefono,  
                facebook_agencia: data.facebook,
                twitter_agencia: data.twitter,
                instagram_agencia: data.instagram,          
            });
            if(updatedRecords !== null && updatedRecords !== undefined) {
                return res.send({ code: "OK", msg: "AGENCY_EDIT_SUCCESS" });
            } else {
                return res.send({ code: "ERR", msg: "AGENCY_EDIT_ERROR" });
            };                 
        } else {
            return res.send({ code: "ERR", msg: "USER_EDIT_ERROR" });
        }
    },

    update: async function(req, res, next) { //actualizar agencia sin usuario
        const data = req.body;

        //Obtener agencia 
        var agency = await Agencia.findOne({'id': data.id});
        if(agency === null || agency === undefined) {
            return res.send({ code: "ERR", msg: "AGENCY_NOT_FOUND" });    
        }
        
        //Actualizar datos de agencia
        updatedRecords = await Agencia.updateOne({ id: agency.id }).set({
            nombre_agencia: data.name,
            email_agencia: data.email,
            nombre_vendedor: data.vendedor,
            direccion_vendedor: data.direccion,
            telefono_agencia: data.telefono,  
            facebook_agencia: data.facebook,
            twitter_agencia: data.twitter,
            instagram_agencia: data.instagram,          
        });
        if(updatedRecords !== null && updatedRecords !== undefined) {
            return res.send({ code: "OK", msg: "AGENCY_EDIT_SUCCESS" });
        } else {
            return res.send({ code: "ERR", msg: "AGENCY_EDIT_ERROR" });
        };   
    },

    getAgenciasReservaciones: async function(req, res, next) {
        var list = await Agencia.find().populate('reservaciones', {
           where: { 'estado': req.param('estado') } 
        });
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },
}

