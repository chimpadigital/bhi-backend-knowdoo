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
    createPasajeros: async function(req, res) {
        const id_reservacion = req.body.id_reservacion;
        const data = req.body.pasajeros;
        
        //preguntar por el id de la reservacion, si existe comprobarlo
        //comprobar reservacion
        if(id_reservacion !== null && id_reservacion !== undefined && id_reservacion !== ''){
            reservacion = await Reservacion.findOne({id: parseInt(id_reservacion)});
            if(reservacion === null || reservacion === undefined) {
                return res.badRequest("La reservación no existe en la BD.");    
            } 
        } else return res.badRequest("No está definida la reservación");

        //Registrar pasajeros de la reservacion
        var list = [];
        
        for(var x = 0; x < data.length; x++) {                        
            var psj = await Pasajero.create({
                nombre_pasajero: data[x].nombre,
                telefono_pasajero: data[x].telefono,
                email_pasajero: data[x].email,
                tipo_documento: data[x].tipoDocumento,
                numero_documento: data[x].numeroDocumento,  
                id_tipoHabitacion: data[x].habitacion,
                bebe: data[x].bebe,
                asiento: data[x].asiento,
                id_reservacion: id_reservacion,
            }).fetch(); 
            list.push(psj);
        }
        return res.send({ code: "200", msg: "PASAJEROS_CREATED", list: list });
                           
    },  

    /*create: async function(req, res) {
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
            return res.send({ code: "OK", msg: "PASAJERO_CREATED", obj: createdRegister });     
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_CREATED" });
        }               
    },*/

    update: async function(req, res) {
        const data = req.body;
        const pasajero = req.param('id');
        
        
        //actualizar el objeto reservacion 
        var updatedRegister = await Pasajero.updateOne({ id: pasajero}).set({
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
                if(files !== undefined){
                    for(var x = 0; x < files.length; x++) {
                        var pathfile = files[x].fd;
                        var name = pathfile.substr(
                            Math.max(
                                pathfile.lastIndexOf('\\'),
                                pathfile.lastIndexOf('/'),
                            ) + 1,
                        );     
                        Documentos.create({
                            nombre: name,
                            pasajero: pasajero,
                        }).exec((err, update)=>{
                            if (err) {
                                return res.serverError(err);
                            }                          
                        });  
                    }
                }
            });            
            //subir ficha medica
            var uploadFile = req.file('ficha');
            await uploadFile.upload({ dirname: '../../documents'},function onUploadComplete(err, files) {  
                if (err) {
                    return res.serverError(err);  // IF ERROR Return and send 500 error with error
                } 
                if(files !== undefined){
                    for(var x = 0; x < files.length; x++) {
                        var pathfile = files[x].fd;
                        var name = pathfile.substr(
                            Math.max(
                                pathfile.lastIndexOf('\\'),
                                pathfile.lastIndexOf('/'),
                            ) + 1,
                        );     
                        FichaMedica.create({
                            nombre: name,
                            pasajero: pasajero,
                        }).exec((err, update)=>{
                            if (err) {
                                return res.serverError(err);
                            }                          
                        });  
                    }
                }
            }); 
            return res.send({ code: "OK", msg: "PASAJERO_EDIT_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "PASAJERO_EDIT_ERROR" });
        }                  
    },

    /*updateDoc: async function(req, res, next) {
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
    },*/

    deleteDoc: async function(req, res, next) {
        var archivo = await  Documentos.findOne({ where: {id:req.param('id')},
                                                select: ['nombre'] });
        if(archivo !== null && archivo !== undefined) {
            //eliminar fichero
            if(archivo.nombre !== null && archivo.nombre !== undefined && archivo.nombre !== "") {
                await fs.unlink("documents/"+archivo.nombre); 
            } 
            //actualizar BD
            await Documentos.destroyOne({ id: req.param('id') });                                                    
            return res.send({ code: "OK", msg: "DOCUMENT_DELETED" });
        }  else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }     
    },
    
    downloadDoc: async function(req, res) {
        var archivo = await  Documentos.findOne({ where: {id:req.param('id')},
                                                select: ['nombre'] });
        if(archivo !== null && archivo !== undefined) {
            if(archivo.nombre !== null && archivo.nombre !== undefined && archivo.nombre !== "") {
                let file = path.resolve(sails.config.appPath, 'documents/'+archivo.nombre);
                //obtener extension del archivo
                let arr = archivo.nombre.split('.');
                let ext = arr[arr.length-1].toLowerCase();
                if(ext==='pdf'){                    
                    res.setHeader('content-type', 'application/pdf');
                } else if (ext ==='png'){
                    res.setHeader('content-type', 'image/png');
                } else if(ext ==='doc' || ext ==='docx'){
                    res.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                } else {
                    res.setHeader('content-type', 'image/jpeg');
                }
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

    /*updateFicha: async function(req, res, next) {
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
    },*/

    deleteFicha: async function(req, res, next) {        
        var archivo = await  FichaMedica.findOne({ where: {id:req.param('id')},
                                                select: ['nombre'] });
        if(archivo !== null && archivo !== undefined) {
            //eliminar fichero
            if(archivo.nombre !== null && archivo.nombre !== undefined && archivo.nombre !== "") {
                await fs.unlink("documents/"+archivo.nombre); 
            } 
            //actualizar BD
            await FichaMedica.destroyOne({ id: req.param('id') });                                                     
            return res.send({ code: "OK", msg: "DOCUMENT_DELETED" });
        }  else {
            return res.send({ code: "ERR", msg: "PASAJERO_NOT_FOUND" });
        }     
    },

    downloadFicha: async function(req, res) {
        var archivo = await  FichaMedica.findOne({ where: {id:req.param('id')},
                                                select: ['nombre'] });
        if(archivo !== null && archivo !== undefined) {
            if(archivo.nombre !== null && archivo.nombre !== undefined && archivo.nombre !== "") {
                let file = path.resolve(sails.config.appPath, 'documents/'+archivo.nombre);
                //obtener extension del archivo
                let arr = archivo.nombre.split('.');
                let ext = arr[arr.length-1].toLowerCase();
                if(ext==='pdf'){                    
                    res.setHeader('content-type', 'application/pdf');
                } else if (ext ==='png'){
                    res.setHeader('content-type', 'image/png');
                } else if(ext ==='doc' || ext ==='docx'){
                    res.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                } else {
                    res.setHeader('content-type', 'image/jpeg');
                }           
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
            var reserva = await Reservacion.updateOne({ id: updated.id_reservacion }).set({
                estado: 2 //confirmada con al menos un pasjero
            });
             return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });     
         } else {
             return res.send({ code: "ERR", msg: "PASAJERO_CHANGE_STATE_ERROR" });
         }    
    },

    changeEstadoReserva: async function(req, res, next) {
       var updated = await Pasajero.update({ id_reservacion: req.param('reservacion') }).set({
             estado: 2 //pagado
         }); 
         if(updated !== null && updated !== undefined) {
            var reserva = await Reservacion.updateOne({ id: updated.id_reservacion }).set({
                estado: 2 //confirmada con al menos un pasjero
            });
             return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });     
         } else {
             return res.send({ code: "ERR", msg: "PASAJERO_CHANGE_STATE_ERROR" });
         }      
        //return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });    
    },

    changeEstadoPasajeros: async function(req, res, next) {
        const data = req.body.list;               
        await Pasajero.update({ id: { in: data} }).set({
             estado: 2 //pagado
         });   
        var reservaciones = await Pasajero.find({ where: {id:{ in: data} },
            select: ['id_reservacion'] });
        var listReservaciones = [];
        for(let i = 0; i < reservaciones.length; i++){
            listReservaciones.push(reservaciones[i].id_reservacion);
        }
        await Reservacion.update({ id: { in: listReservaciones} }).set({
            estado: 2 //confirmada con al menos un pasjero
        });      
        return res.send({ code: "OK", msg: "PASAJERO_CHANGE_STATE_SUCCESS" });            
    },

    delete: async function(req, res, next) {
        var archivos = await  Pasajero.findOne({ where: {id:req.param('id')},
                                                 select: ['comprobante', 'id_reservacion', 'bebe'] });
        if(archivos !== null && archivos !== undefined) {              
            if(archivos.comprobante !== null && archivos.comprobante !== undefined && archivos.comprobante !== "") {
                await fs.unlink('comprobantes/'+archivos.comprobante); 
            }                      
        }
        //eliminar documentos de Pasajero
        var docs = await  Documentos.find({ where: {pasajero:req.param('id')},
                                            select: ['nombre'] });
        for(let i=0; i<docs.length; i++) {
            //eliminar fichero
            if(docs[i].nombre !== null && docs[i].nombre !== undefined && docs[i].nombre !== "") {
                await fs.unlink("documents/"+docs[i].nombre); 
            } 
            //actualizar BD
            await Documentos.destroyOne({ id: docs[i].id });
        }
        //eliminar ficha médica de pasajero
        var fichas = await  FichaMedica.find({ where: {pasajero:req.param('id')},
                                            select: ['nombre'] });
        for(let i=0; i<fichas.length; i++) {
            //eliminar fichero
            if(fichas[i].nombre !== null && fichas[i].nombre !== undefined && fichas[i].nombre !== "") {
                await fs.unlink("documents/"+fichas[i].nombre); 
            } 
            //actualizar BD
            await FichaMedica.destroyOne({ id: fichas[i].id });
        }
        if(archivos && !archivos.bebe){
            //obtener asientos de la reservacion
            var asientos = await Reservacion.findOne({ where: {id:archivos.id_reservacion},
                                                    select: ['asientos_reservados'] });
            var cadena = asientos.asientos_reservados;
            var tmp = cadena.split('*');
            if(tmp.length > 1){
                tmp.pop();                
                cadena = tmp.join('*')
            } else {
                cadena = '';
            }            
            //actualizar asientos de la reservacion
            await Reservacion.update({ id: archivos.id_reservacion }).set({
                asientos_reservados: cadena, 
            });         
        }        
        await Pasajero.destroy({id: req.param('id')});
        
        return res.send({ code: "OK", msg: "PASAJERO_DELETE_SUCCESS" });       
     },

     deleteOne: async function(req, res, next) {

       /*  var pasajero = await Pasajero.find().where({
            'id': req.param('id')})
        if(pasajero !== null && pasajero !== undefined) {
            {
                if(pasajero.imagen_documento !== null && pasajero.imagen_documento !== undefined && pasajero.imagen_documento !== "") {
                    await fs.unlink("documents/"+pasajero.imagen_documento); 
                }   
                if(pasajero.ficha_medica !== null && pasajero.ficha_medica !== undefined && pasajero.ficha_medica !== "") {
                    await fs.unlink("documents/"+pasajero.ficha_medica); 
                }
                if(pasajero.comprobante !== null && pasajero.comprobante !== undefined && pasajero.comprobante !== "") {
                    await fs.unlink('comprobantes/'+pasajero.comprobante); 
                }                      
            } */
            var exito = await Pasajero.destroyOne({id: req.param('id')});
            return res.send({ code: "OK", msg: "PASAJERO_DELETE_SUCCESS" }); 
        /* } else {
            return res.serverError("Something went wrong"); 
        } */
               
       
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
        var pasajero = await Pasajero.findOne(req.param('id'))
        .populate('id_tipoHabitacion');        
        if(pasajero !== null && pasajero !== undefined) {
            return res.json(pasajero);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    getDocs:async function(req, res, next) {
        var docs = await Documentos.find({ where: {pasajero:req.param('id')},
        select: ['nombre'] });
        if(docs !== null && docs !== undefined) {
            return res.json(docs);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 
    getFichas:async function(req, res, next) {
        var fichas = await FichaMedica.find({ where: {pasajero:req.param('id')},
        select: ['nombre'] });
        if(fichas !== null && fichas !== undefined) {
            return res.json(fichas);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    getPasajeros: async function(req, res, next) { //devuelve los pasajeros segun parametros
        var list = await Pasajero.find().where({
            'id_reservacion': req.param('reservacion'),             
        });
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
                var assetsPath=path.resolve(sails.config.appPath, 'assets');
                assetsPath=assetsPath.replace(new RegExp(/\\/g),'/');                
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",                    
                    "footer": {
                        "height": "20mm",
                    },
                    "base": "file:///" + assetsPath + '/'
                    
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

    /***Devolver los pasajeros segun su estado dado la agencia y el paquete */
    getPasajerosAgencia: async function(req, res, next) { //devuelve los paquetes por mes segun estado
        var user = parseInt(req.body.user);
        var estado = parseInt(req.body.estado);
        var paquete = parseInt(req.body.paquete);
        var agency = await Agencia.findOne().where({'id_user': user});
        
        var SELECT_PASAJEROS = `SELECT
        pasajero.id,
        pasajero.nombre_pasajero
        FROM
        pasajero
        INNER JOIN reservacion ON reservacion.id = pasajero.id_reservacion
        INNER JOIN agencia ON agencia.id = reservacion.id_agencia
        INNER JOIN paquete ON paquete.id = reservacion.id_paquete
        WHERE
        pasajero.estado = $1 AND
        agencia.id = $2 AND
        paquete.id = $3`;
        await sails.sendNativeQuery(SELECT_PASAJEROS, [ estado, agency.id,  paquete]).exec(async function(err, list) {
            if (err) return res.serverError("Something went wrong");            
            return res.json({count: list.rows.length, list: list.rows});
        });
    },

    /***Devolver los pasajeros segun su estado dado la agencia y parametro de busqueda */
    getPasajerosAgenciaSearch: async function(req, res, next) { //devuelve los paquetes por mes segun estado
        var user = parseInt(req.body.user);
        var estado = parseInt(req.body.estado);
        var search = req.body.search;
        var agency = await Agencia.findOne().where({'id_user': user});

        //si search es una fecha
        const meses=['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        if(meses.includes(search)){
            //obtener numero del mes
            var fecha;
            if(search === 'enero') fecha = 1;
            else if(search === 'febrero') fecha = 2;
            else  if(search === 'marzo') fecha = 3;
            else  if(search === 'abril') fecha = 4;
            else  if(search === 'mayo') fecha = 5;
            else  if(search === 'junio') fecha = 6;
            else  if(search === 'julio') fecha = 7;
            else  if(search === 'agosto') fecha = 8;
            else  if(search === 'septiembre') fecha = 9;
            else  if(search === 'octubre') fecha = 10;
            else  if(search === 'noviembre') fecha = 11;
            else  if(search === 'diciembre') fecha = 12;

            //Crear consulta
            var SELECT_PASAJEROS = `SELECT
            pasajero.id,
            pasajero.nombre_pasajero,
            paquete.destino
            FROM
            pasajero
            INNER JOIN reservacion ON reservacion.id = pasajero.id_reservacion
            INNER JOIN agencia ON agencia.id = reservacion.id_agencia
            INNER JOIN paquete ON paquete.id = reservacion.id_paquete
            WHERE
            pasajero.estado = $1 AND
            agencia.id = $2 AND
            MONTH(paquete.fecha) = $3`;
            //ejecutar consulta y devolver resultado
            await sails.sendNativeQuery(SELECT_PASAJEROS, [ estado, agency.id,  fecha]).exec(async function(err, list) {
                if (err) return res.serverError("Something went wrong");            
                return res.json({count: list.rows.length, list: list.rows});
            });
        } else {
            //trabajar search como un campo destino
            var p3 = "like '%"+search+"%'";
            var SELECT_PASAJEROS = `SELECT
            pasajero.id,
            pasajero.nombre_pasajero,
            paquete.destino
            FROM
            pasajero
            INNER JOIN reservacion ON reservacion.id = pasajero.id_reservacion
            INNER JOIN agencia ON agencia.id = reservacion.id_agencia
            INNER JOIN paquete ON paquete.id = reservacion.id_paquete
            WHERE
            pasajero.estado = $1 AND
            agencia.id = $2 AND
            paquete.destino ` + p3;
            await sails.sendNativeQuery(SELECT_PASAJEROS, [ estado, agency.id]).exec(async function(err, list) {
                if (err) return res.serverError("Something went wrong");    
                if(list.rows.length) {
                    return res.json({count: list.rows.length, list: list.rows});
                }  else {
                    ////trabajar search como un campo de nombre o DNI pasajero
                    var SELECT_PASAJEROS = `SELECT
                    pasajero.id,
                    pasajero.nombre_pasajero,
                    paquete.destino
                    FROM
                    pasajero
                    INNER JOIN reservacion ON reservacion.id = pasajero.id_reservacion
                    INNER JOIN agencia ON agencia.id = reservacion.id_agencia
                    INNER JOIN paquete ON paquete.id = reservacion.id_paquete
                    WHERE
                    pasajero.estado = $1 AND
                    agencia.id = $2 AND
                    (pasajero.numero_documento ` + p3 + ` OR
                    pasajero.nombre_pasajero ` + p3 + `)`;
                    await sails.sendNativeQuery(SELECT_PASAJEROS, [ estado, agency.id]).exec(async function(err, list) {
                        if (err) return res.serverError("Something went wrong");    
                        return res.json({count: list.rows.length, list: list.rows});
                    });
                }
            });
        }    
    },
};

