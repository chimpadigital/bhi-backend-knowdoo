/**
 * PaqueteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs').promises;
var base64Img = require('base64-img');
const moment = require('moment');

module.exports = {
    create: async function(req, res) {
        const data = req.body;
        var fecha = new Date(data.fecha);
          
        //registrar el objeto paquete
        var createdRegister = await Paquete.create({
            nombre_paquete: data.nombre,
            descripcion: data.descripcion,
            destino: data.destino,            
            fecha: fecha,   
            cantidad_noches: data.noches,
            lugar_salida: data.salida,
            edad_desde:data.desde,
            edad_hasta:data.hasta, 
            properties_paquete: data.detalles,
            id_tipoBus: data.transporte, 
            asientos: data.asientos,  
            id_hotel: data.hotel,
            observaciones_paquete: data.observaciones,
            titulo_observaciones: data.titulo_observaciones,
            id_estado: data.estado, 
        }).fetch();
        if(createdRegister !== null && createdRegister !== undefined) {
            return res.send({ code: "200", msg: "PACK_CREATED", data: createdRegister });     
        } else {
            return res.serverError("Something went wrong");
        }             
    },

    update: async function(req, res) {
        const data = req.body;     
        var fecha = new Date(data.fecha); 
             
        
        //actualizar el objeto paquete 
        var updatedRegister = await Paquete.updateOne({ id: data.id }).set({
            nombre_paquete: data.nombre,
            descripcion: data.descripcion,
            destino: data.destino,            
            fecha: fecha,   
            cantidad_noches: data.noches,
            lugar_salida: data.salida,
            edad_desde:data.desde,
            edad_hasta:data.hasta, 
            properties_paquete: data.detalles,
            id_tipoBus: data.transporte, 
            asientos: data.asientos,  
            id_hotel: data.hotel,
            observaciones_paquete: data.observaciones,
            titulo_observaciones: data.titulo_observaciones, 
            id_estado: data.estado           
        });
        if(updatedRegister !== null && updatedRegister !== undefined) {
            return res.send({ code: "200", msg: "PACK_EDIT_SUCCESS" });     
        } else {
            return res.serverError("Something went wrong");
        }             
    },

    updateObservaciones: async function(req, res) {
        const data = req.body;  
        //actualizar el objeto paquete 
        var updatedRegister = await Paquete.updateOne({ id: data.id }).set({
            observaciones_paquete: data.observaciones,
            titulo_observaciones: data.titulo_observaciones,            
        });
        if(updatedRegister !== null && updatedRegister !== undefined) {
            return res.send({ code: "200", msg: "PACK_EDIT_SUCCESS" });     
        } else {
            return res.serverError("Something went wrong");
        }             
    },

   

    changeEstado: async function(req, res, next) {
        const data = req.body;
        var state = await Estado.findOne({id: parseInt(data.estado)});
        if(state === null || state === undefined) {
            return res.badRequest("El identificador del estado no existe en la BD");    
        }

        var updated = await Paquete.updateOne({ id: data.id }).set({
            id_estado: state.id
        });
        
        if(updated !== null && updated !== undefined) {
            return res.send({ code: "OK", msg: "PACK_CHANGE_STATE_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "PACK_CHANGE_STATE_ERROR" });
        }    
    },

    delete: async function(req, res, next) {
        //Obtener imágenes del paquete y eliminarlas
        var imagenes = await  Imagen.find()
            .where({id_paquete: req.param('id')}); 
        for(var x = 0; x < imagenes.length; x++) {
            var nombre_imagen = imagenes[x].nombre;
            if(nombre_imagen !== ""){
                //código para eliminar fisicamente la imagen
                await fs.unlink('pictures/'+nombre_imagen);   
            }
        }
        //Obtener imágenes de las excursiones y eliminarlas
        var excursiones = await  Excursion.find()
            .where({id_paquete: req.param('id')}); 
        for(var x = 0; x < excursiones.length; x++) {
            var nombre_imagen = excursiones[x].imagen_excursion;
            if(nombre_imagen !== "" ){
                //código para eliminar fisicamente la imagen
                await fs.unlink('pictures/'+nombre_imagen);   
            }
        }
        //Obtener imagen del hotel
        var paquete = await Paquete.findOne(req.param('id'))
        var hotel = await  Hotel.findOne(paquete.id_hotel); 
        var nombre_imagen = hotel.imagen_hotel;
        if(nombre_imagen !== "" ){
            await fs.unlink('pictures/'+nombre_imagen);   
        }
        
        //Eliminar reservaciones del paquete
        var reservas = await Reservacion.find({ where: {id_paquete:req.param('id')},
                                                select: ['comprobante'] });
        for(var x = 0; x < reservas.length; x++)  {
            var reserva = reservas[x];
            //eliminar comprobante de reserva
            if(reserva.comprobante !== null && reserva.comprobante !== undefined && reserva.comprobante !== "") {
                await fs.unlink('comprobantes/'+reserva.comprobante); 
            }     
            //eliminar archivos de pasajeros
            var archivos = await  Pasajero.find({ where: {id_reservacion:reserva.id},
                                                select: ['comprobante'] });
            for(var y = 0; y < archivos.length; y++) {
                var archivo = archivos[y];
                if(archivo.comprobante !== null && archivo.comprobante !== undefined && archivo.comprobante !== "") {
                    await fs.unlink('comprobantes/'+archivo.comprobante); 
                } 
                //eliminar documentos de Pasajero
                var docs = await  Documentos.find({ where: {pasajero:archivo.id},
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
                var fichas = await  FichaMedica.find({ where: {pasajero:archivo.id},
                                                        select: ['nombre'] });
                for(let i=0; i<fichas.length; i++) {
                    //eliminar fichero
                    if(fichas[i].nombre !== null && fichas[i].nombre !== undefined && fichas[i].nombre !== "") {
                        await fs.unlink("documents/"+fichas[i].nombre); 
                    } 
                    //actualizar BD
                    await FichaMedica.destroyOne({ id: fichas[i].id });
                }                    
            }
            await Pasajero.destroy({id_reservacion: reserva.id});   
            //Eliminar los registros de la BD
            await Reservacion.destroyOne({id:reserva.id});               
        }     
        //Eliminar los registros de la BD
        await Imagen.destroy({id_paquete:req.param('id')}); ////eliminar imágenes del paquete
        await Actividad.destroy({id_paquete:req.param('id')});//eliminar itinerario del paquete
        await ExcursionOpcional.destroy({id_paquete:req.param('id')});//eliminar excursiones opcionales del paquete
        await Excursion.destroy({id_paquete:req.param('id')});//eliminar excursiones del paquete
        await Habitacion.destroy({id_hotel: paquete.id_hotel});
        await Hotel.destroy({id:paquete.id_hotel});        
        await Paquete.destroyOne({id:req.param('id')});         
        return res.send({ code: "OK", msg: "PACK_DELETE_SUCCESS" });       
     },

     

    show:async function(req, res, next) {
        var paquete = await Paquete.findOne(req.param('id'))
        .populate('id_tipoBus');            
        if(paquete !== null && paquete !== undefined) {
            return res.json(paquete);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    packs: async function(req, res, next) { //devuelve ls apquetes publicados (estado 1) con imagen
        var list = await Paquete.find().where({'id_estado': 1}).sort('nombre_paquete ASC')
            //.populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('imagenes');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },


    packsImg: async function(req, res, next) { //devuelve ls apquetes publicados (estado 1)
        var list = await Paquete.find().where({'id_estado': 1}).sort('nombre_paquete ASC')
            //.populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('reservaciones')
            .populate('imagenes');
        if(list !== null && list !== undefined) {
            lista_paquetes = [];
            for(var x = 0; x < list.length; x++) { 
                var tempImg = await Imagen.find({id_paquete: list[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                    }
                }
                else {
                    code = '';
                }
                var pack = {
                    paquete: list[x],
                    imagen: code,                    
                }
                lista_paquetes.push(pack);
            }           
           
            return res.json(lista_paquetes); //
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    packsImgID: async function(req, res, next) { //devuelve ls 
        var list = await Paquete.find().where({'id': req.param('id') })
            //.populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('reservaciones')
            .populate('imagenes');
        if(list !== null && list !== undefined) {
            lista_paquetes = [];
            for(var x = 0; x < list.length; x++) { 
                var tempImg = await Imagen.find({id_paquete: list[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                    }
                }
                else {
                    code = '';
                }
                var pack = {
                    paquete: list[x],
                    imagen: code,                    
                }
                lista_paquetes.push(pack);
            }           
            return res.json(lista_paquetes); //
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    packsImgConfirm: async function(req, res, next) { //devuelve ls apquetes publicados (estado 1)
        var list = await Paquete.find().where({'id_estado': 1}).sort('nombre_paquete ASC')
            //.populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('imagenes');
        if(list !== null && list !== undefined) {
            lista_paquetes = [];
            for(var x = 0; x < list.length; x++) { 
                var tempImg = await Imagen.find({id_paquete: list[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                    }
                }
                else {
                    code = '';
                }
                var pack = {
                    paquete: list[x],
                    imagen: code,                    
                }
                lista_paquetes.push(pack);
            }              
            return res.json(lista_paquetes); //
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    canceled: async function(req, res, next) { //devuelve ls paquetes cancelados (estado 2)
        var list = await Paquete.find().where({'id_estado': 2}).sort('nombre_paquete ASC')
            .populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('imagenes');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    index: async function(req, res, next) { //devuelve todos los paquetes
        var list = await Paquete.find().sort('nombre_paquete ASC')
            .populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('imagenes');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    indexByNombre: async function(req, res, next) { //devuelve todos los paquetes de un destino
        var value = req.body.search;
        var estado = req.body.estado;
        var list = await Paquete.find().where({
            or: [
                {'nombre_paquete': {contains: value}},
                {'destino': {contains: value}},
            ],
            'id_estado': estado
        });
        if(list !== null && list !== undefined) {
            lista_paquetes = [];
            for(var x = 0; x < list.length; x++) { 
                var tempImg = await Imagen.find({id_paquete: list[x].id, nivel: 0});
                var code = '';
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    
                    if(nombre_imagen !== ""){
                        try{
                           code = base64Img.base64Sync('pictures/'+nombre_imagen);
                        }catch(err){
                            code = '';
                        }
                        
                    }
                }
                else {
                    code = '';
                }
                moment.locale('es');
                var fecha = moment(list[x].fecha).format('MMMM [/] YYYY');
                var pack = {
                    paquete: list[x],
                    imagen: code,
                    fechaFormat: fecha
                }
                lista_paquetes.push(pack);
            }
            return res.json({count: lista_paquetes.length, list: lista_paquetes});
        } else {
            return res.serverError("Something went wrong"); 
        }
    },
    indexByMes: async function(req, res, next) { //devuelve los paquetes por mes segun estado
        var value = req.body.search;        
        //si es el nombre de un mes devolvemos el valor transformado
        if(value === 'enero') value = 1;
        if(value === 'febrero') value = 2;
        if(value === 'marzo') value = 3;
        if(value === 'abril') value = 4;
        if(value === 'mayo') value = 5;
        if(value === 'junio') value = 6;
        if(value === 'julio') value = 7;
        if(value === 'agosto') value = 8;
        if(value === 'septiembre') value = 9;
        if(value === 'octubre') value = 10;
        if(value === 'noviembre') value = 11;
        if(value === 'diciembre') value = 12;
        var SELECT_BY_DATE_RANGE = `SELECT * FROM paquete WHERE MONTH(fecha) = $1 `;
        
        await sails.sendNativeQuery(SELECT_BY_DATE_RANGE, [ value ]).exec(async function(err, list) {
            if (err) return res.serverError("Something went wrong");            
            lista_paquetes = [];
            for(var x = 0; x < list.rows.length; x++) {
                var tempImg = await Imagen.find({id_paquete: list.rows[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                    }
                }
                else {
                    code = '';
                   }
                var pack = {
                    paquete: list.rows[x],
                    imagen: code
                }
                lista_paquetes.push(pack);             
            }
            return res.json({count: lista_paquetes.length, list: lista_paquetes});
        });

    },

    searchPaquete: async function(req, res, next) { //devuelve todos los paquetes de un destino
        var nombre = req.body.destino;
        var fecha = req.body.fecha;
        var ordenar = req.body.ordenarPor;
        var p1 = req.body.destino == '' ? "!= $1" : "like '%"+nombre+"%'";
        if(ordenar === null || ordenar === undefined || ordenar === ''){
            ordenar='destino';
        }
        //si es el nombre de un mes devolvemos el valor transformado
        if(fecha === 'enero') fecha = 1;
        else if(fecha === 'febrero') fecha = 2;
        else  if(fecha === 'marzo') fecha = 3;
        else  if(fecha === 'abril') fecha = 4;
        else  if(fecha === 'mayo') fecha = 5;
        else  if(fecha === 'junio') fecha = 6;
        else  if(fecha === 'julio') fecha = 7;
        else  if(fecha === 'agosto') fecha = 8;
        else  if(fecha === 'septiembre') fecha = 9;
        else  if(fecha === 'octubre') fecha = 10;
        else  if(fecha === 'noviembre') fecha = 11;
        else  if(fecha === 'diciembre') fecha = 12;
        else fecha = 0;
        var p2 = fecha == 0 ? "!= 0" : "="+fecha + "";
        if(ordenar === 'destino'){
            var SELECT_ORDER = `SELECT
            paquete.id,
            paquete.nombre_paquete,
            paquete.descripcion,
            paquete.destino,
            paquete.fecha,
            paquete.lugar_salida,
            paquete.cantidad_noches
            FROM
            paquete
            WHERE
            (paquete.nombre_paquete ` + p1 + ` OR
            paquete.destino ` + p1 + `) AND
            MONTH(fecha) ` + p2 + ` AND
            paquete.id_estado = 1
            ORDER BY
            paquete.destino ASC
            `;
        } else {
            var SELECT_ORDER = `SELECT
            paquete.id,
            paquete.nombre_paquete,
            paquete.descripcion,
            paquete.destino,
            paquete.fecha,
            paquete.lugar_salida,
            paquete.cantidad_noches
            FROM
            paquete
            WHERE
            (paquete.nombre_paquete ` + p1 + ` OR
            paquete.destino ` + p1 + `) AND
            MONTH(fecha) ` + p2 + ` AND
            paquete.id_estado = 1
            ORDER BY
            paquete.fecha ASC
            `;
        }
        await sails.sendNativeQuery(SELECT_ORDER, [ nombre ]).exec(async function(err, list) {
            if (err) return res.serverError("Something went wrong");            
            lista_paquetes = [];
            for(var x = 0; x < list.rows.length; x++) {
                var tempImg = await Imagen.find({id_paquete: list.rows[x].id, nivel: 0});
                var code = '';
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        try{
                            code = base64Img.base64Sync('pictures/'+nombre_imagen);
                        }catch(err){
                            code = '';
                        }
                       
                    }
                }
                else {
                    code = '';
                }
                moment.locale('es');
                var fecha = moment(list.rows[x].fecha).format('dd [/] MMMM [/] YYYY');
                var pack = {
                    paquete: list.rows[x],
                    imagen: code,
                    fechaFormat: fecha
                }
                lista_paquetes.push(pack);             
            }
            return res.json({count: lista_paquetes.length, list: lista_paquetes});
        });
    },

    getHabitaciones: async function(req, res, next) { //devuelve precios de habitaciones de un paquete
        var id_hotel = await Paquete.findOne({ where: {'id': req.param('id_paquete')},
            select: ['id_hotel'] });
        if(id_hotel !== null && id_hotel !== undefined) {
            var list = await Habitacion.find().where({'id_hotel': id_hotel});
            if(list !== null && list !== undefined) {
                return res.json(list);
            } else {
                return res.serverError("Something went wrong"); 
            }
        } else {
            return res.serverError("Something went wrong"); 
        }       
        
    },

    getPacksReservadosByAgencia: async function(req, res, next) { //devuelve los paquetes reservados
        var user = parseInt(req.body.user);
        var estado = parseInt(req.body.estado);
        var agency = await Agencia.findOne().where({'id_user': user});
        
        var SELECT_RESERVAS = `SELECT
        paquete.id,
        paquete.nombre_paquete
        FROM
        reservacion
        INNER JOIN paquete ON reservacion.id_paquete = paquete.id
        INNER JOIN pasajero ON pasajero.id_reservacion = reservacion.id
        INNER JOIN agencia ON reservacion.id_agencia = agencia.id
        WHERE
        paquete.id_estado = 1 AND
        agencia.id = $1 AND
        pasajero.estado = $2
        GROUP BY
        paquete.nombre_paquete`;
        
        await sails.sendNativeQuery(SELECT_RESERVAS, [ agency.id , estado]).exec(async function(err, list) {
            if (err) return res.serverError("Something went wrong");            
            lista_paquetes = [];
            for(var x = 0; x < list.rows.length; x++) {
                var tempImg = await Imagen.find({id_paquete: list.rows[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                    }
                }
                else {
                    code = '';
                   }
                var pack = {
                    paquete: list.rows[x],
                    imagen: code
                }
                lista_paquetes.push(pack);             
            }
            return res.json({count: lista_paquetes.length, list: lista_paquetes});
        });
    }, 

    gettodosPacksReservados: async function(req, res, next) { //devuelve los paquetes reservados
        //var user = parseInt(req.body.user);
        var estado = parseInt(req.body.estado);
        //var agency = await Agencia.findOne().where({'id_user': user});
        
        var SELECT_RESERVAS = `SELECT
        paquete.id,
        paquete.nombre_paquete,
        paquete.asientos,
        paquete.id_tipoBus
        FROM
        reservacion
        INNER JOIN paquete ON reservacion.id_paquete = paquete.id
        INNER JOIN pasajero ON pasajero.id_reservacion = reservacion.id
        INNER JOIN agencia ON reservacion.id_agencia = agencia.id
        WHERE
        paquete.id_estado = 1 AND
        pasajero.estado = $1
        GROUP BY
        paquete.nombre_paquete`;
        
        await sails.sendNativeQuery(SELECT_RESERVAS, [estado]).exec(async function(err, list) {
            if (err) return res.serverError("Something went wrong");            
            lista_paquetes = [];
            for(var x = 0; x < list.rows.length; x++) {
                var tempImg = await Imagen.find({id_paquete: list.rows[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        try {
                            var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                        }
                        catch(err) {
                            code = '';
                        }
                       
                    }
                }
                else {
                    code = '';
                   }
                var pack = {
                    paquete: list.rows[x],
                    imagen: code
                }
                lista_paquetes.push(pack);             
            }
            return res.json({count: lista_paquetes.length, list: lista_paquetes});
        });
    }, 

    getPacksTop: async function(req, res, next) { //devuelve los paquetes reservados
        
        var SELECT_PACKS = `SELECT
        Count(reservacion.estado) AS CANTIDAD,
        paquete.id,
        paquete.nombre_paquete,
        paquete.descripcion,
        paquete.destino,
        paquete.fecha,
        paquete.lugar_salida,
        paquete.cantidad_noches
        FROM
        reservacion
        INNER JOIN paquete ON paquete.id = reservacion.id_paquete
        WHERE reservacion.estado = 2
        GROUP BY
        paquete.id
        ORDER BY
        CANTIDAD DESC
        LIMIT 6`;
        
        await sails.sendNativeQuery(SELECT_PACKS, []).exec(async function(err, list) {
            if (err) return res.serverError("Something went wrong");            
            lista_paquetes = [];
            for(var x = 0; x < list.rows.length; x++) {
                var tempImg = await Imagen.find({id_paquete: list.rows[x].id, nivel: 0});
                if(tempImg[0]){
                    var nombre_imagen = tempImg[0].nombre;
                    if(nombre_imagen !== ""){
                        try{
                            var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                        }catch(err){
                            code = '';
                        }
                        
                    }
                }
                else {
                    code = '';
                }
                moment.locale('es');
                var fecha = moment(list.rows[x].fecha).format('dd [/] MMMM [/] YYYY');
                var pack = {
                    paquete: list.rows[x],
                    imagen: code,
                    fechaFormat: list.rows[x].fecha
                }
                lista_paquetes.push(pack);             
            }
            return res.json({count: lista_paquetes.length, list: lista_paquetes});
        });

    }, 



    getPacksfiltrados: async function(req, res, next) { //devuelve los paquetes reservados
        var user = parseInt(req.body.user);
        var criterio = req.body.criterio;
        var estado = parseInt(req.body.estado);
        var agency = await Agencia.findOne().where({'id_user': user});
        var p1 = req.body.criterio == '' ? "!= $1" : "like '%"+criterio+"%'";
        var SELECT_ORDER = `SELECT
        paquete.id,
        paquete.nombre_paquete
        FROM
        reservacion
        INNER JOIN paquete ON reservacion.id_paquete = paquete.id
        INNER JOIN pasajero ON pasajero.id_reservacion = reservacion.id
        INNER JOIN agencia ON reservacion.id_agencia = agencia.id
        WHERE
        paquete.id_estado = 1 AND
        agencia.id = $1 AND
        pasajero.estado = $3 AND
        (paquete.destino = $2 OR
            pasajero.nombre_pasajero = $2 OR
            pasajero.numero_documento = $2 )
        GROUP BY
        paquete.nombre_paquete`;
        var parametro = criterio.toString(); sails.log(parametro);

            await sails.sendNativeQuery(SELECT_ORDER, [agency.id, parametro, estado]).exec(async function(err, list) {
                if (err) return res.serverError("Something went wrong");            
                lista_paquetes = [];
                for(var x = 0; x < list.rows.length; x++) {
                    var tempImg = await Imagen.find({id_paquete: list.rows[x].id, nivel: 0});
                    if(tempImg[0]){
                        var nombre_imagen = tempImg[0].nombre;
                        if(nombre_imagen !== ""){
                            var code = base64Img.base64Sync('pictures/'+nombre_imagen);
                        }
                    }
                    else {
                        code = '';
                       }
                    var pack = {
                        paquete: list.rows[x],
                        imagen: code
                    }
                    lista_paquetes.push(pack);             
                }
                return res.json({count: lista_paquetes.length, list: lista_paquetes});
            });

    }, 

    getHabitacionesPaquetePasajero: async function(req, res, next) { //devuelve habitaciones de un paquete dado un pasajero
        var pasajero = await Pasajero.findOne({ where: {'id': req.param('id_pasajero')},
        select: ['id_reservacion'] });
        var reservacion = await Reservacion.findOne({ where: {'id': pasajero.id_reservacion},
            select: ['id_paquete'] });
        var paquete = await Paquete.findOne({ where: {'id': reservacion.id_paquete},
        select: ['id_hotel'] });
        if(paquete !== null && paquete !== undefined) {
            var list = await Habitacion.find().where({'id_hotel': paquete.id_hotel}).populate('id_tipo_habitacion');
            if(list !== null && list !== undefined) {
                return res.json(list);
            } else {
                return res.serverError("Something went wrong"); 
            }
        } else {
            return res.serverError("Something went wrong"); 
        }       
        
    },

    hasItinerario: async function(req, res, next) { 
        var total = await Actividad.count({id_paquete: req.param('id')});;
        if(total !== null && total !== undefined) {
            return res.json(total);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },
    hasExcursiones: async function(req, res, next) { 
        var total = await Excursion.count({id_paquete: req.param('id')});
        if(total !== null && total !== undefined) {
            return res.json(total);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },


};

