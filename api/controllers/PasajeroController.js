/**
 * PasajeroController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var pdf = require('html-pdf');
var ejs = require("ejs");
var path = require('path');
const fs = require('fs').promises;

module.exports = {
    create: async function(req, res) {
        const data = req.body;
        
        //comprobar reservacion
        if(data.reservacion !== null && data.reservacion !== undefined && data.reservacion !== ''){
            var id_reservacion = await Reservacion.findOne({id: parseInt(data.reservacion)});
            if(id_reservacion === null || id_reservacion === undefined) {
                return res.badRequest("La reservación no existe en la BD.");    
            } else {
                id_reservacion = id_reservacion.id;
            }
        } else return res.badRequest("No está definida la reservación");  

        //registrar el objeto Pasajero
        var createdRegister = await Pasajero.create({
            nombre_pasajero: data.nombre,
            telefono_pasajero: data.telefono,
            email_pasajero: data.email,
            tipo_documento: data.tipoDocumento,
            numero_documento: data.numeroDocumento,
            observaciones_pasajero: data.observaciones,
            imagen_documento: data.documento,
            ficha_medica: data.ficha,
            nombre_emergencia: data.nombreEmergencia,
            telefono_emergencia: data.telefonoEmergencia,
            facebook_pasajero: data.facebook,
            twitter_pasajero: data.twitter,
            instagram_pasajero: data.instagram,
            
            id_tipoHabitacion: data.habitacion,
            id_reservacion: id_reservacion,       
        }).fetch();
        if(createdRegister !== null && createdRegister !== undefined) {
            return res.send({ code: "OK", msg: "PASAJERO_CREATED" });     
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_CREATED" });
        }             
    },

    update: async function(req, res) {
        const data = req.body;
        
        //actualizar el objeto reservacion 
        var updatedRegister = await Pasajero.updateOne({ id: data.id }).set({
            nombre_pasajero: data.nombre,
            telefono_pasajero: data.telefono,
            email_pasajero: data.email,
            tipo_documento: data.tipoDocumento,
            numero_documento: data.numeroDocumento,
            observaciones_pasajero: data.observaciones,
            imagen_documento: data.documento,
            ficha_medica: data.ficha,
            nombre_emergencia: data.nombreEmergencia,
            telefono_emergencia: data.telefonoEmergencia,
            facebook_pasajero: data.facebook,
            twitter_pasajero: data.twitter,
            instagram_pasajero: data.instagram,
            
            id_tipoHabitacion: data.habitacion,           
        });
        if(updatedRegister !== null && updatedRegister !== undefined) {
            return res.send({ code: "OK", msg: "PASAJERO_EDIT_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_EDIT_ERROR" });
        }                  
    },

    changeEstado: async function(req, res, next) {
        var updated = await Pasajero.updateOne({ id: req.param('id') }).set({
             estado: 2 //pagado
         });         
         if(updated !== null && updated !== undefined) {
             return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });     
         } else {
             return res.send({ code: "ERR", msg: "PASAJERO_CHANGE_STATE_ERROR" });
         }    
    },

    changeEstadoReserva: async function(req, res, next) {
        await Pasajero.update({ id_reservacion: req.param('reservacion') }).set({
             estado: 2 //pagado
         });     
         return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });    
    },

    changeEstadoPasajeros: async function(req, res, next) {
        const data = req.body;
        await Pasajero.update({ id: { in: data} }).set({
             estado: 2 //pagado
         });         
         return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });            
    },

    delete: async function(req, res, next) {
        var archivos = await  Pasajero.findOne({ where: {id:req.param('id')},
                                                 select: ['comprobante', 'ficha_medica','imagen_documento'] });
        if(archivos !== null && archivos !== undefined) {
            if(archivos.imagen_documento !== null && archivos.imagen_documento !== undefined && archivos.imagen_documento !== "") {
                await fs.unlink('comprobantes/'+archivos.imagen_documento); 
            }   
            if(archivos.ficha_medica !== null && archivos.ficha_medica !== undefined && archivos.ficha_medica !== "") {
                await fs.unlink('comprobantes/'+archivos.ficha_medica); 
            }
            if(archivos.comprobante !== null && archivos.comprobante !== undefined && archivos.comprobante !== "") {
                await fs.unlink('comprobantes/'+archivos.comprobante); 
            }                      
        }
        await Pasajero.destroy({id: req.param('id')}); 
        return res.send({ code: "OK", msg: "PASAJERO_DELETE_SUCCESS" });       
     },

     deletePasajerosReserva: async function(req, res, next) {
        var archivos = await  Pasajero.find({ where: {id_reservacion:req.param('reservacion')},
                                            select: ['comprobante', 'ficha_medica','imagen_documento'] });
        for(var x = 0; x < archivos.length; x++) {
            var archivo = archivos[x];
            if(archivo.imagen_documento !== null && archivo.imagen_documento !== undefined && archivo.imagen_documento !== "") {
                await fs.unlink('comprobantes/'+archivo.imagen_documento); 
            }   
            if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                await fs.unlink('comprobantes/'+archivo.ficha_medica); 
            }
            if(archivo.comprobante !== null && archivo.comprobante !== undefined && archivo.comprobante !== "") {
                await fs.unlink('comprobantes/'+archivo.comprobante); 
            }                      
        }
        await Pasajero.destroy({id_reservacion:req.param('reservacion')}); 
        return res.send({ code: "OK", msg: "PASAJEROS_DELETE_SUCCESS" });       
     },
 
     deletePasajeros: async function(req, res, next) {
        const data = req.body;
        var archivos = await  Pasajero.find({ where: {id: { in: data}},
                                            select: ['comprobante', 'ficha_medica','imagen_documento'] });
        for(var x = 0; x < archivos.length; x++) {
            var archivo = archivos[x];
            if(archivo.imagen_documento !== null && archivo.imagen_documento !== undefined && archivo.imagen_documento !== "") {
                await fs.unlink('comprobantes/'+archivo.imagen_documento); 
            }   
            if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                await fs.unlink('comprobantes/'+archivo.ficha_medica); 
            }
            if(archivo.comprobante !== null && archivo.comprobante !== undefined && archivo.comprobante !== "") {
                await fs.unlink('comprobantes/'+archivo.comprobante); 
            }                      
        }
        await Pasajero.destroy( {id: { in: data} }); 
        return res.send({ code: "OK", msg: "PASAJEROS_DELETE_SUCCESS" });       
      },

    show:async function(req, res, next) {
        var pasajero = await Pasajero.findOne(req.param('id'));
        if(pasajero !== null && pasajero !== undefined) {
            return res.json(pasajero);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    getPasajeros: async function(req, res, next) { //devuelve los pasajeros segun parametros
        var list = await Pasajero.find().where({
            'estado': req.param('estado'), 
            'id_reservacion': req.param('reservacion')
        }).populate('id_reservacion');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    comprobante: async function(req, res, next) { //generar comprobante
        var registro = await Pasajero.findOne(req.param('id')).populate('id_tipoHabitacion').populate('id_reservacion');
        if(registro !== null && registro !== undefined) {
            pasajero = {
                codigoReserva: registro.id_reservacion.codigo,
                nombre:registro.nombre_pasajero,
                telefono: registro.telefono_pasajero,
                correo: registro.email_pasajero,
                documento: registro.tipo_documento,
                numero:registro.numero_documento,
                habitacion:registro.id_tipoHabitacion.tipo,
                nombreEmergencia: registro.nombre_emergencia,
                telefonoEmergencia: registro.telefono_emergencia,
                facebook: registro.facebook_pasajero,
                twitter:  registro.twitter_pasajero,
                instagram:  registro.instagram_pasajero,
                observaciones:  registro .observaciones_pasajero
            }            
        } else {
            return res.serverError("Something went wrong"); 
        }
        var comprobante = 'pas'+registro.id+'res'+registro.id_reservacion.id+'.pdf';       
        var templateDir = path.resolve(sails.config.appPath, 'views/pdfTemplates');
        ejs.renderFile(path.join(templateDir, "pasajero.ejs"), {pasajero: pasajero}, (err, data) => {
            if (err) {
                  res.send(err);
            } else {
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",
                    "header": {
                        "height": "20mm"
                    },
                    "footer": {
                        "height": "20mm",
                    },
                };
                pdf.create(data, options).toFile('./comprobantes/'+comprobante, function(err, pdfres) {
                    if (err) {
                        return err;
                    } else {
                        Pasajero.updateOne({ id: req.param('id') }).set({
                            comprobante: comprobante,                            
                        }).exec((err, update)=>{
                            if (err) {
                              return res.serverError(err);
                            }                          
                          });                        
                        return res.send(pdfres)
                    }
                });
            }
        });
    }, 

};

