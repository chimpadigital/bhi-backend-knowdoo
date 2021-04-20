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
var fsd = require('fs');

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
            nombre_emergencia: data.nombreEmergencia,
            telefono_emergencia: data.telefonoEmergencia,
            facebook_pasajero: data.facebook,
            twitter_pasajero: data.twitter,
            instagram_pasajero: data.instagram,
            
            id_tipoHabitacion: data.habitacion,
            id_reservacion: id_reservacion,       
        }).fetch();
        if(createdRegister !== null && createdRegister !== undefined) { 
            //subir documentos
           var uploadFile = req.file('documento');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files[0] !== undefined){
                    var pathfile = files[0].fd;
                    var name = pathfile.substr(
                        Math.max(
                            pathfile.lastIndexOf('\\'),
                            pathfile.lastIndexOf('/'),
                        ) + 1,
                    );     
                    Pasajero.updateOne({ id: createdRegister.id }).set({
                        imagen_documento: name,
                    }).exec((err, update)=>{
                        if (err) {
                            return res.serverError(err);
                        }                          
                    });  
                }
            });
            //subir ficha medica
            var uploadFile = req.file('ficha');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files[0] !== undefined){
                    var pathfile = files[0].fd;
                    var name = pathfile.substr(
                        Math.max(
                            pathfile.lastIndexOf('\\'),
                            pathfile.lastIndexOf('/'),
                        ) + 1,
                    );     
                    Pasajero.updateOne({ id: createdRegister.id }).set({
                        ficha_medica: name,
                    }).exec((err, update)=>{
                        if (err) {
                            return res.serverError(err);
                        }                          
                    });  
                }
            });           
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
            nombre_emergencia: data.nombreEmergencia,
            telefono_emergencia: data.telefonoEmergencia,
            facebook_pasajero: data.facebook,
            twitter_pasajero: data.twitter,
            instagram_pasajero: data.instagram,
            
            id_tipoHabitacion: data.habitacion,           
        });
        if(updatedRegister !== null && updatedRegister !== undefined) {
            //subir documentos
            var uploadFile = req.file('documento');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files[0] !== undefined){
                    var oldname = updatedRegister.imagen_documento;
                    if(oldname !== null && oldname !== undefined && oldname !== ''){
                        fs.unlink("documents/"+oldname, (err => {
                            if (err) console.log(err);                                
                        }));                   
                    }
                    var pathfile = files[0].fd;
                    var name = pathfile.substr(
                        Math.max(
                            pathfile.lastIndexOf('\\'),
                            pathfile.lastIndexOf('/'),
                        ) + 1,
                    );     
                    Pasajero.updateOne({ id: updatedRegister.id }).set({
                        imagen_documento: name,
                    }).exec((err, update)=>{
                        if (err) {
                            return res.serverError(err);
                        }                          
                    });  
                }
            });
            var uploadFile = req.file('ficha');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files[0] !== undefined){
                    var oldname = updatedRegister.ficha_medica;
                    if(oldname !== null && oldname !== undefined && oldname !== ''){
                        fs.unlink("documents/"+oldname, (err => {
                            if (err) console.log(err);                                
                        }));                   
                    }
                    var pathfile = files[0].fd;
                    var name = pathfile.substr(
                        Math.max(
                            pathfile.lastIndexOf('\\'),
                            pathfile.lastIndexOf('/'),
                        ) + 1,
                    );     
                    Pasajero.updateOne({ id: updatedRegister.id }).set({
                        ficha_medica: name,
                    }).exec((err, update)=>{
                        if (err) {
                            return res.serverError(err);
                        }                          
                    });  
                }
            });
            return res.send({ code: "OK", msg: "PASAJERO_EDIT_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_EDIT_ERROR" });
        }                  
    },

    updateDoc: async function(req, res, next) {
        const data = req.body;
        var archivo = await  Pasajero.findOne({ where: {id: data.id},
                                                 select: ['imagen_documento'] });
        if(archivo !== null && archivo !== undefined) {
            //subir documentos
            var uploadFile = req.file('documento');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files[0] !== undefined){
                    var oldname = archivo.imagen_documento;
                    if(oldname !== null && oldname !== undefined && oldname !== ''){
                        fs.unlink("documents/"+oldname, (err => {
                            if (err) console.log(err);                                
                        }));                   
                    }
                    var pathfile = files[0].fd;
                    var name = pathfile.substr(
                        Math.max(
                            pathfile.lastIndexOf('\\'),
                            pathfile.lastIndexOf('/'),
                        ) + 1,
                    );     
                    Pasajero.updateOne({ id: data.id }).set({
                        imagen_documento: name,
                    }).exec((err, update)=>{
                        if (err) {
                            return res.serverError(err);
                        }                          
                    }); 
                    return res.send({ code: "OK", msg: "DOCUMENT_UPLOADED" });
                } else {
                    return res.send({ code: "ERR", msg: "DOCUMENT_NOT_UPLOADED" });
                }
            });            
        }  else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }      
    },

    deleteDoc: async function(req, res, next) {
        var archivo = await  Pasajero.findOne({ where: {id:req.param('id')},
                                                select: ['imagen_documento'] });
        if(archivo !== null && archivo !== undefined) {
            //eliminar fichero
            if(archivo.imagen_documento !== null && archivo.imagen_documento !== undefined && archivo.imagen_documento !== "") {
                await fs.unlink("documents/"+archivo.imagen_documento); 
            } 
            //actualizar BD
            await Pasajero.updateOne({ id: req.param('id') }).set({
                imagen_documento: '',
            });                                                    
            return res.send({ code: "OK", msg: "DOCUMENT_DELETED" });
        }  else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }     
    },
    
    downloadDoc: async function(req, res) {
        var archivo = await  Pasajero.findOne({ where: {id:req.param('id')},
                                                select: ['imagen_documento'] });
        if(archivo !== null && archivo !== undefined) {
            if(archivo.imagen_documento !== null && archivo.imagen_documento !== undefined && archivo.imagen_documento !== "") {
                let file = path.resolve(sails.config.appPath, 'documents/'+archivo.imagen_documento);
                res.setHeader('Content-disposition', 'attachment; filename=' + archivo.imagen_documento);
                let filestream = fsd.createReadStream(file);
                filestream.on('open', function () {
                    // This just pipes the read stream to the response object (which goes to the client)
                    filestream.pipe(res);                    
                });
                filestream.on('error', function(err) {
                    res.end(err);
                });               
            } else {
                return res.send({ code: "ERR", msg: "DOCUMENTO_NOT_FOUND" });
            }
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }    
       
    },

    updateFicha: async function(req, res, next) {
        const data = req.body;
        var archivo = await  Pasajero.findOne({ where: {id: data.id},
                                                 select: ['ficha_medica'] });
        if(archivo !== null && archivo !== undefined) {
            //subir documentos
            var uploadFile = req.file('ficha');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files[0] !== undefined){
                    var oldname = archivo.ficha_medica;
                    if(oldname !== null && oldname !== undefined && oldname !== ''){
                        fs.unlink("documents/"+oldname, (err => {
                            if (err) console.log(err);                                
                        }));                   
                    }
                    var pathfile = files[0].fd;
                    var name = pathfile.substr(
                        Math.max(
                            pathfile.lastIndexOf('\\'),
                            pathfile.lastIndexOf('/'),
                        ) + 1,
                    );     
                    Pasajero.updateOne({ id: data.id }).set({
                        ficha_medica: name,
                    }).exec((err, update)=>{
                        if (err) {
                            return res.serverError(err);
                        }                          
                    });  
                    return res.send({ code: "OK", msg: "DOCUMENT_UPLOADED" });
                } else {
                    return res.send({ code: "ERR", msg: "DOCUMENT_NOT_UPOADED" });
                }
            });            
        }  else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }     
    },

    deleteFicha: async function(req, res, next) {
        var archivo = await  Pasajero.findOne({ where: {id:req.param('id')},
                                                select: ['ficha_medica'] });
        if(archivo !== null && archivo !== undefined) {
            //eliminar fichero
            if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                await fs.unlink("documents/"+archivo.ficha_medica); 
            } 
            //actualizar BD
            await Pasajero.updateOne({ id: req.param('id') }).set({
                ficha_medica: '',
            });                                                    
            return res.send({ code: "OK", msg: "DOCUMENT_DELETED" });
        }  else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }     
    },

    downloadFicha: async function(req, res) {
        var archivo = await  Pasajero.findOne({ where: {id:req.param('id')},
                                                select: ['ficha_medica'] });
        if(archivo !== null && archivo !== undefined) {
            if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                let file = path.resolve(sails.config.appPath, 'documents/'+archivo.ficha_medica);
                res.setHeader('content-type', 'application/pdf');
                //res.setHeader('Content-disposition', 'attachment; filename=' + archivo.ficha_medica);
                let filestream = fsd.createReadStream(file);
                filestream.on('open', function () {
                    // This just pipes the read stream to the response object (which goes to the client)
                    filestream.pipe(res);                    
                });
                filestream.on('error', function(err) {
                    res.end(err);
                });               
            } else {
                return res.send({ code: "ERR", msg: "DOCUMENTO_NOT_FOUND" });
            }
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
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
                await fs.unlink("documents/"+archivos.imagen_documento); 
            }   
            if(archivos.ficha_medica !== null && archivos.ficha_medica !== undefined && archivos.ficha_medica !== "") {
                await fs.unlink("documents/"+archivos.ficha_medica); 
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
                await fs.unlink("documents/"+archivo.imagen_documento); 
            }   
            if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                await fs.unlink("documents/"+archivo.ficha_medica); 
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
                await fs.unlink("documents/"+archivo.imagen_documento); 
            }   
            if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                await fs.unlink("documents/"+archivo.ficha_medica); 
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
                        //return res.send(pdfres)
                        //Devolver comprobante
                        let file = path.resolve(sails.config.appPath, 'comprobantes/'+comprobante);
                        res.setHeader('content-type', 'application/pdf');
                        let filestream = fsd.createReadStream(file);
                        filestream.on('open', function () {
                            // This just pipes the read stream to the response object (which goes to the client)
                            filestream.pipe(res);                    
                        });
                        filestream.on('error', function(err) {
                            res.end(err);
                        });   
                    }
                });
            }
        });
    }, 

};

