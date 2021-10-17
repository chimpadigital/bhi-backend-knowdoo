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
const { resolve } = require('path');

module.exports = {
    create: async function(req, res) {
        const data = req.body;
        var user = parseInt(req.body.user);
        var id_agencia = await Agencia.findOne().where({'id_user': user});
        var agenciaObject = id_agencia;
        
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
        
            if(id_agencia === null || id_agencia === undefined) {
                return res.badRequest("La agencia no existe en la BD.");    
            } else {
                id_agencia = id_agencia.id;
            }
         
        
        //registrar el objeto Reservacion
        var createdRegister = await Reservacion.create({
            cantidad_adultos: data.adultos,
            cantidad_menores: data.menores,
            cantidad_bebes: data.bebes,
            asientos_reservados: data.asientos,

            cantidad_doble: data.doble,
            cantidad_individual: data.individual,
            cantidad_triple: data.triple,
            cantidad_cuadruple: data.cuadruple,

            cantidad_twin: data.twin,
            cantidad_matrimonial: data.matrimonial,
                       
            id_agencia: id_agencia,
            id_paquete: id_paquete,       
        }).fetch();
        if(createdRegister !== null && createdRegister !== undefined) {
            //registrar asientos reservados
            /*for(var x = 0; x < data.asientos.length; x++) {
                await AsientoReservado.create({
                    etiqueta: data.asientos[x],
                    id_reserva: createdRegister.id,  
                    id_paquete: id_paquete,
                });
            }*/
            await Mailer.sendNotificacionMailReservacion({msg: agenciaObject.nombre_agencia, email: agenciaObject.email_agencia}); 
            

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
            codigo: code,
            estado: 1, //en espera de confirmación
            fecha_registro:  moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        
        if(updated !== null && updated !== undefined) {
            return res.send({ code: "OK", msg: "RESERVACION_CHANGE_STATE_SUCCESS", codigo: updated.codigo });     
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
            asientos_reservados: data.asientos,
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
            //await AsientoReservado.destroy({id_reserva: updatedRegister.id});
            //registrar nuevos asientos de la reserva
            /*for(var x = 0; x < data.asientos.length; x++) {
                await AsientoReservado.create({
                    etiqueta: data.asientos[x],
                    id_reserva: updatedRegister.id,  
                    id_paquete: updatedRegister.id_paquete,
                });
            }*/
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
        var reservacion = await Reservacion.findOne(req.param('id'));
            //.populate('asientos_reservados');
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
        })//.populate('asientos_reservados')
          .populate('id_agencia')
          .populate('pasajeros')
          .populate('id_paquete');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    //*devuelve pasajeros sin confirmar de una reservacion (conformada o no)
    getPasajerosSC: async function(req, res, next) { 
        const estadoPasajero = req.param('estado');  
        var list = await Reservacion.find().where({ 
            'id_agencia': req.param('agencia'),
            'id_paquete': req.param('paquete')
        }).populate('id_agencia')
          .populate('pasajeros')
          .populate('id_paquete');
        if(list !== null && list !== undefined) {
            var pasajerosSC = [];
            for (var x = 0; x < list.length; x++){
                if(list[x].pasajeros !== null && list[x].pasajeros !== undefined){
                    var pasajeros = list[x].pasajeros; sails.log(pasajeros);
                        for(var y = 0; y < pasajeros.length; y++){
                            if(pasajeros[y].estado == estadoPasajero){
                                var item = {
                                    nombre_pasajero: pasajeros[y].nombre_pasajero,
                                    id: pasajeros[y].id,
                                    reservacion: list[x].id,
                                    paquete: list[x].id_paquete.id
                                };
                                pasajerosSC.push(item);
                            }
                        }
                }
            }
            sails.log(pasajerosSC);
            return res.json(pasajerosSC);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    //*devuelve las agencias (simplificadas a ua sola intancia) con reservaciones de un pacquete dado
    getAgenciasXpack: async function(req, res, next) { 
        var list = await Reservacion.find().where({
            'id_paquete': req.param('paquete')
        })//.populate('asientos_reservados')
          .populate('id_agencia')
          .populate('pasajeros')
          .populate('id_paquete');
        if(list !== null && list !== undefined) {
            var agencias =[];
            var ids =[];
            for (var x = 0; x < list.length; x++){
                var clasifica = false;
                if(list[x].estado == 1){
                    clasifica = true;     //*se incluye porque es no confirmada
                }else {
                    if(list[x].pasajeros !== null && list[x].pasajeros !== undefined){
                        var pasajeros = list[x].pasajeros;
                        for(var y = 0; y < pasajeros.length; y++){
                            if(pasajeros[y].estado == 1){
                                clasifica = true;   //*se incluye porque tiene al menos un pasajero sin confirmar    
                            }
                        }
                    }
                }
                if(clasifica){
                    ids.push(list[x].id_agencia.id);
                }
            }
            var uniqueIds = ids.filter(function(elem, index, self) { //*obtener id unicos
                return index === self.indexOf(elem); 
            }); 
            for(var i = 0; i < uniqueIds.length; i++){
                var AG = await Agencia.findOne().where({'id': uniqueIds[i]});
                if(AG !== null && AG !== undefined){
                    var tempAgencia = {
                        nombre_agencia: AG.nombre_agencia,
                        id: AG.id
                    };
                    agencias.push(tempAgencia);
                }
            }
            return res.json(agencias);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    //*devuelve las agencias (simplificadas a ua sola intancia) con reservaciones de un pacquete dado
    getAgenciasConfXpack: async function(req, res, next) { 
        var list = await Reservacion.find().where({
            'id_paquete': req.param('paquete')
        })//.populate('asientos_reservados')
          .populate('id_agencia')
          .populate('pasajeros')
          .populate('id_paquete');
        if(list !== null && list !== undefined) {
            var agencias =[];
            var ids =[];
            for (var x = 0; x < list.length; x++){
                var clasifica = false;
                if(list[x].estado == 2){
                    clasifica = true;     //*se incluye porque es no confirmada
                }
                if(clasifica){
                    ids.push(list[x].id_agencia.id);
                }
            }
            var uniqueIds = ids.filter(function(elem, index, self) { //*obtener id unicos
                return index === self.indexOf(elem); 
            }); 
            for(var i = 0; i < uniqueIds.length; i++){
                var AG = await Agencia.findOne().where({'id': uniqueIds[i]});
                if(AG !== null && AG !== undefined){
                    var tempAgencia = {
                        nombre_agencia: AG.nombre_agencia,
                        id: AG.id
                    };
                    agencias.push(tempAgencia);
                }
            }
            return res.json(agencias);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    //*devuelve las reservaciones de estado 1 y las estado 2 con pasajeros sin confirmar
    getXPasajeroNoConfirmado: async function(req, res, next) {  
        var list = await Reservacion.find().where({
            'estado': req.param('estado'), 
            'id_agencia': req.param('agencia'),
            'id_paquete': req.param('paquete')
        })//.populate('asientos_reservados')
          .populate('id_agencia')
          .populate('pasajeros')
          .populate('id_paquete');
        if(list !== null && list !== undefined) {
            var reservaciones = [];
            
            for (var x = 0; x < list.length; x++){
                var clasifica = false;
                if(list[x].estado == 1){
                    clasifica = true;     //*se incluye porque es no confirmada
                }else {
                    if(list[x].pasajeros !== null && list[x].pasajeros !== undefined){
                        var pasajeros = list[x].pasajeros;
                        for(var y = 0; y < pasajeros.length; y++){
                            if(pasajeros[y].estado == 1){
                                clasifica = true;   //*se incluye porque tiene al menos un pasajero sin confirmar    
                            }
                        }
                    }
                }
                if(clasifica){
                    reservaciones.push(list[x]);
                }
            }
            return res.json(reservaciones);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    getPasajerosxreservacion: async function(req, res, next) { //devuelve las reservaciones segun parametros
        var list = await Reservacion.find().where({
            //'estado': req.param('estado'), 
            //'id_agencia': req.param('agencia'),
            'id_paquete': req.param('paquete')
        })//.populate('asientos_reservados')
          //.populate('id_agencia')
          .populate('pasajeros')
          //.populate('id_paquete');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    comprobante: async function(req, res, next) { //generar comprobante
        var registro = await Reservacion.findOne().where({'id': req.param('id')});
        if(registro !== null && registro !== undefined) {

            var paquete = await Paquete.findOne().where({'id': registro.id_paquete})
                                                .populate('id_hotel')
                                                .populate('id_tipoBus');
            if(paquete !== null && paquete !== undefined) {
                var tmp =  registro.asientos_reservados.split('*');
                var asientos = tmp.join(' - ');                
                moment.locale('es');
                var fecha = moment(paquete.fecha).format('MMMM [/] YYYY');
                reserva = {
                    codigoReserva: registro.codigo,
                    destino:paquete.destino,
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
                    fecha: fecha,
                    observaciones: paquete.observaciones_paquete,
                    asientos: asientos                    
                };    
                
            } else {
                return res.serverError("Something went wrong");
            }               
        } else {
            return res.serverError("Something went wrong"); 
        }
        var comprobante = 'res'+registro.id+'paq'+paquete.id+'.pdf';       
        var templateDir = path.resolve(sails.config.appPath, 'views/pdfTemplates');
        ejs.renderFile(path.join(templateDir, "reservacion.ejs"), {reservacion: reserva}, (err, data) => {
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
    
    getTotalVentasMes: async function(req, res, next) { //devuelve las reservaciones segun parametros
        var dataInic = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        var dataFin = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
        //sails.log('start ' + dataInic);
        //sails.log('end ' + dataFin);
        var total = await Reservacion.count({
            estado:2, 
            fecha_registro:{
                ">=":dataInic,
                "<":dataFin,
            },
        });
        if(total !== null && total !== undefined) {
            return res.json(total);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    getAsientosPaquete: async function(req, res, next) { //devuelve todos los asientos reservados de un paquete
        var list = await Reservacion.find({ where: {id_paquete:req.param('id_paquete')},
            select: ['asientos_reservados'] });
        if(list !== null && list !== undefined) {            
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    mostrarResumenReservacion: async function(req, res, next) { //devuelve todos los asientos reservados de un paquete
        var reservacion = await Reservacion.findOne({ id:parseInt(req.param('id'))});
        if(reservacion !== null && reservacion !== undefined) {
            
            var resp = new Object();
            var destino = await Paquete.findOne({ where: {id:reservacion.id_paquete},
            select: ['destino', 'id_hotel'] });
           
            var hotel = await Hotel.findOne({ where: {id: destino.id_hotel},
                select: ['nombre_hotel'] });
            resp.destino = destino.destino;
            resp.hotel = hotel.nombre_hotel;
            resp.habitacion = {
                doble: (reservacion.cantidad_doble !=='')?reservacion.cantidad_doble:0,
                individual: (reservacion.cantidad_individual !=='')?reservacion.cantidad_individual:0,
                triple: (reservacion.cantidad_triple !=='')?reservacion.cantidad_triple:0,
                cuadruple: (reservacion.cantidad_cuadruple !=='')?reservacion.cantidad_cuadruple:0,
            };
            resp.pasajeros = {
                adultos: (reservacion.cantidad_adultos !=='')?reservacion.cantidad_adultos:0,
                menores: (reservacion.cantidad_menores !=='')?reservacion.cantidad_menores:0,
                bebes: (reservacion.cantidad_bebes !=='')?reservacion.cantidad_bebes:0,               
            };
            var tmp =  reservacion.asientos_reservados.split('*');
            var asientos = tmp.join(' - ');
            resp.asientos =asientos;
            
            
            resp.codigo = reservacion.codigo;
           
            return res.json(resp);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    getCantidadReservaciones: async function(req, res, next) { //devuelve las reservaciones segun parametros
        var total = await Reservacion.count({
            estado:[1, 2], 
            id_paquete: req.param('paquete')
        });
        return res.json(total);        
    },

};

