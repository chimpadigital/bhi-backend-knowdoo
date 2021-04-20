/**
 * ReservacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');
var pdf = require('html-pdf');
var ejs = require("ejs");
var path = require('path');
const fs = require('fs').promises;
var fsd = require('fs');

module.exports = {
    create: async function(req, res) {
        const data = req.body;
        
        //comprobar paquete
        if(data.paquete !== null && data.paquete !== undefined && data.paquete !== ''){
            var id_paquete = await Paquete.findOne({id: parseInt(data.paquete)});
            if(id_paquete === null || id_paquete === undefined) {
                return res.badRequest("El paquete turístico no existe en la BD.");    
            } else {
                id_paquete = id_paquete.id;
            }
        } else return res.badRequest("No está definido el paquete turístico");  

        //comprobar agencia
        if(data.agencia !== null && data.agencia !== undefined && data.agencia !== ''){
            var id_agencia = await Agencia.findOne({id: parseInt(data.agencia)});
            if(id_agencia === null || id_agencia === undefined) {
                return res.badRequest("La agencia no existe en la BD.");    
            } else {
                id_agencia = id_agencia.id;
            }
        } else return res.badRequest("No está definida la agencia");  
        
        //registrar el objeto Reservacion
        var createdRegister = await Reservacion.create({
            cantidad_adultos: data.adultos,
            cantidad_menores: data.menores,
            cantidad_bebes: data.bebes,

            cantidad_doble: data.doble,
            cantidad_individual: data.individual,
            cantidad_triple: data.tripe,
            cantidad_cuadruple: data.cuadruple,

            cantidad_twin: data.twin,
            cantidad_matrimonial: data.matrimonial,
                       
            id_agencia: id_agencia,
            id_paquete: id_paquete,       
        }).fetch();
        if(createdRegister !== null && createdRegister !== undefined) {
            //registrar asientos reservados
            for(var x = 0; x < data.asientos.length; x++) {
                await AsientoReservado.create({
                    etiqueta: data.asientos[x],
                    id_reserva: createdRegister.id,  
                    id_paquete: id_paquete,
                });
            }
            return res.send({ code: "OK", msg: "RESERVACION_CREATED", obj: createdRegister  });     
        } else {
            return res.send({ code: "ERR", msg: "RESERVACION_NOT_CREATED" });
        }             
    },

    getCodeReservacion: async function(req, res) {
        const reservacion = req.param('id');
        
        //Obtener reservacion
        if(reservacion !== null && reservacion !== undefined && reservacion !== ''){
            var reserva = await Reservacion.findOne({id: parseInt(reservacion)});
            if(reserva === null || reserva === undefined) {
                return res.badRequest("La reservacion no existe en la BD.");    
            } else {
                code = reserva.createdAt;
            }
        } else return res.badRequest("No está definida la reservación"); 
        
        var updated = await Reservacion.updateOne({ id: reservacion }).set({
            codigo: 'RC'+code,
            estado: 1, //en espera de confirmación
            fecha_registro:  moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        
        if(updated !== null && updated !== undefined) {
            return res.send({ code: "OK", msg: "RESERVACION_CHANGE_STATE_SUCCESS", obj: updated });     
        } else {
            return res.send({ code: "ERR", msg: "RESERVACION_CHANGE_STATE_ERROR" });
        }   

    },

    update: async function(req, res) {
        const data = req.body;
        
        //actualizar el objeto reservacion 
        var updatedRegister = await Reservacion.updateOne({ id: data.id }).set({
            cantidad_adultos: data.adultos,
            cantidad_menores: data.menores,
            cantidad_bebes: data.bebes,

            cantidad_doble: data.doble,
            cantidad_individual: data.individual,
            cantidad_triple: data.tripe,
            cantidad_cuadruple: data.cuadruple,

            cantidad_twin: data.twin,
            cantidad_matrimonial: data.matrimonial,             
        });
        if(updatedRegister !== null && updatedRegister !== undefined) {
            //Actualizar asientos reservados
            //eliminar asientos reservados
            await AsientoReservado.destroy({id_reserva: updatedRegister.id});
            //registrar nuevos asientos de la reserva
            for(var x = 0; x < data.asientos.length; x++) {
                await AsientoReservado.create({
                    etiqueta: data.asientos[x],
                    id_reserva: updatedRegister.id,  
                    id_paquete: updatedRegister.id_paquete,
                });
            }
            return res.send({ code: "OK", msg: "RESERVACION_EDIT_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "RESERVACION_EDIT_ERROR" });
        }                  
    },

    changeEstado: async function(req, res, next) {
       var updated = await Reservacion.updateOne({ id: req.param('id') }).set({
            estado: 2 //pagado
        });
        
        if(updated !== null && updated !== undefined) {
            return res.send({ code: "OK", msg: "RESERVACION_CHANGE_STATE_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "RESERVACION_CHANGE_STATE_ERROR" });
        }    
    },

    delete: async function(req, res, next) {
        //eliminar comprobante de reserva
        var reserva = await Reservacion.findOne({ where: {id:req.param('id')},
                                                select: ['comprobante'] });
        if(reserva !== null && reserva !== undefined) {
            if(reserva.comprobante !== null && reserva.comprobante !== undefined && reserva.comprobante !== "") {
                await fs.unlink('comprobantes/'+reserva.comprobante); 
            }                      
        }                                        
        //eliminar archivos de pasajeros y pasajeros
        var archivos = await  Pasajero.find({ where: {id_reservacion:req.param('id')},
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
        await Pasajero.destroy({id_reservacion:req.param('id')}); 
        //Eliminar los registros de la BD
        await AsientoReservado.destroy({id_reserva: req.param('id')});
        await Reservacion.destroyOne({id:req.param('id')});        
        return res.send({ code: "OK", msg: "RESERVACION_DELETE_SUCCESS" });       
     },

    show:async function(req, res, next) {
        var reservacion = await Reservacion.findOne(req.param('id'))
            .populate('asientos_reservados');
        if(reservacion !== null && reservacion !== undefined) {
            return res.json(reservacion);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    indexByCode: async function(req, res, next) { //devuelve la reservación dado un código
        const data = req.body;
        var reservacion = await Reservacion.findOne().where({'codigo': data.code})
            .populate('asientos_reservados');
            
        if(reservacion !== null && reservacion !== undefined) {
            return res.json(reservacion);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    getReservaciones: async function(req, res, next) { //devuelve las reservaciones segun parametros
        var list = await Reservacion.find().where({
            'estado': req.param('estado'), 
            'id_agencia': req.param('agencia'),
            'id_paquete': req.param('paquete')
        }).populate('asientos_reservados');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    comprobante: async function(req, res, next) { //generar comprobante
        var registro = await Reservacion.findOne().where({'id': req.param('id')})
                                                .populate('asientos_reservados');
        if(registro !== null && registro !== undefined) {
            var paquete = await Paquete.findOne().where({'id': registro.id_paquete})
                                                .populate('id_destino')
                                                .populate('id_hotel')
                                                .populate('id_tipoBus');
            if(paquete !== null && paquete !== undefined) {
                var asientos = [];
                for(var x = 0; x < registro.asientos_reservados.length; x++) {
                    asientos.push(registro.asientos_reservados[x].etiqueta);                   
                }
                data = {
                    codigoReserva: registro.codigo,
                    destino:paquete.id_destino.nombre_destino,
                    adultos: registro.cantidad_adultos,
                    menores: registro.cantidad_menores,
                    bebes: registro.cantidad_bebes,
                    tipoBus: paquete.id_tipoBus.tipo,
                    hotel: paquete.id_hotel.nombre_hotel,
                    hab_doble: registro.cantidad_doble,
                    hab_individual: registro.cantidad_individual,
                    hab_triple: registro.cantidad_triple,
                    hab_cuadruple: registro.cantidad_cuadruple,
                    noches: paquete.cantidad_noches,
                    salida: paquete.lugar_salida,
                    fecha: paquete.fecha,
                    observaciones: paquete.observaciones_paquete,
                    asientos: asientos                    
                }         
            } else {
                return res.serverError("Something went wrong");
            }               
        } else {
            return res.serverError("Something went wrong"); 
        }
        var comprobante = 'res'+registro.id+'paq'+paquete.id+'.pdf';       
        var templateDir = path.resolve(sails.config.appPath, 'views/pdfTemplates');
        ejs.renderFile(path.join(templateDir, "reservacion.ejs"), {reservacion: data}, (err, data) => {
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
                        Reservacion.updateOne({ id: req.param('id') }).set({
                            comprobante: comprobante,                            
                        }).exec((err, update)=>{
                            if (err) {
                              return res.serverError(err);
                            }                          
                          });                        
                        //return res.send(pdfres);
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

