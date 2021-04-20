/**
 * PaqueteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs').promises;

module.exports = {
    create: async function(req, res) {
        const data = req.body;
        var id_destino = 0;
        var id_hotel = 0;
        
        //preguntar por el id del destino, si existe comprobarlo
        if(data.id_destino !== null && data.id_destino !== undefined && data.id_destino !== ''){
            var id_destino = await Destino.findOne({id: parseInt(data.id_destino)});
            if(id_destino === null || id_destino === undefined) {
                return res.badRequest("El destino no existe en la BD.");    
            } else {
                id_destino = id_destino.id;
            }
        } else { //si no existe crearlo, solo con el nombre
            if(data.destino !== null && data.destino !== undefined && data.destino !== ''){
                var created = await Destino.create({
                    nombre_destino: data.destino,
                }).fetch(); 
                if(created !== null && created !== undefined){
                    id_destino = created.id;
                }  else {
                    return res.badRequest("No existe un destino para el paquete turístico.");
                }
            } else {
                return res.badRequest("No existe un destino para el paquete turístico.");
            }
        }

        //preguntar por el id del hotel, si existe comprobarlo
        if(data.id_hotel !== null && data.id_hotel !== undefined && data.id_hotel !== ''){
            var id_hotel = await Hotel.findOne({id: parseInt(data.id_hotel)});
            if(id_hotel === null || id_hotel === undefined) {
                return res.badRequest("El hotel no existe en la BD.");    
            } else {
                id_hotel = id_hotel.id;
            }
        } else { //si no existe crearlo, solo con el nombre y la categoria
            if(data.hotel !== null && data.hotel !== undefined && data.hotel !== ''){
                var created = await Hotel.create({
                    nombre_hotel: data.hotel,
                    categoria_hotel: data.categoria,
                }).fetch(); 
                if(created !== null && created !== undefined){
                    id_hotel = created.id;
                }  else {
                    return res.badRequest("No existe un hotel para el paquete turístico.");
                }
            } else {
                return res.badRequest("No existe un hotel para el paquete turístico.");
            }
        }
        
        //preguntar por el id del transporte, si existe comprobarlo
        var id_transporte = await TipoTransporte.findOne({id: parseInt(data.id_transporte )});
        if(id_transporte === null || id_transporte === undefined) {
            return res.badRequest("El tipo de bus no está registrado en la BD.");    
        } else {
            id_transporte = id_transporte.id;
        }

        //registrar el objeto paquete
        var createdRegister = await Paquete.create({
            nombre_paquete: data.nombre,
            cantidad_noches: data.noches,
            lugar_salida: data.salida,
            fecha: data.fecha,
            observaciones_paquete: data.observaciones,
            edad_desde:data.ageInic,
            edad_hasta:data.ageEnd, 
            properties_paquete: data.properties,
            id_destino: id_destino,
            id_hotel: id_hotel,
            id_tipoBus: id_transporte,
            id_estado: 1, 
        }).fetch();
        if(createdRegister !== null && createdRegister !== undefined) {
            return res.send({ code: "OK", msg: "PACK_CREATED" });     
        } else {
            return res.send({ code: "ERR", msg: "PACK_NOT_CREATED" });
        }             
    },

    update: async function(req, res) {
        const data = req.body;
        
        var id_destino = 0;
        var id_hotel = 0;
        
        //preguntar por el id del destino, si existe comprobarlo
        if(data.id_destino !== null && data.id_destino !== undefined && data.id_destino !== ''){
            var id_destino = await Destino.findOne({id: parseInt(data.id_destino)});
            if(id_destino === null || id_destino === undefined) {
                return res.badRequest("El destino no existe en la BD.");    
            } else {
                id_destino = id_destino.id;
            }
        } else { //si no existe crearlo, solo con el nombre
            if(data.destino !== null && data.destino !== undefined && data.destino !== ''){
                var created = await Destino.create({
                    nombre_destino: data.destino,
                }).fetch(); 
                if(created !== null && created !== undefined){
                    id_destino = created.id;
                }  else {
                    return res.badRequest("No existe un destino para el paquete turístico.");
                }
            } else {
                return res.badRequest("No existe un destino para el paquete turístico.");
            }
        }

        //preguntar por el id del hotel, si existe comprobarlo
        if(data.id_hotel !== null && data.id_hotel !== undefined && data.id_hotel !== ''){
            var id_hotel = await Hotel.findOne({id: parseInt(data.id_hotel)});
            if(id_hotel === null || id_hotel === undefined) {
                return res.badRequest("El hotel no existe en la BD.");    
            } else {
                id_hotel = id_hotel.id;
            }
        } else { //si no existe crearlo, solo con el nombre y la categoria
            if(data.hotel !== null && data.hotel !== undefined && data.hotel !== ''){
                var created = await Hotel.create({
                    nombre_hotel: data.hotel,
                    categoria_hotel: data.categoria,
                }).fetch(); 
                if(created !== null && created !== undefined){
                    id_hotel = created.id;
                }  else {
                    return res.badRequest("No existe un hotel para el paquete turístico.");
                }
            } else {
                return res.badRequest("No existe un hotel para el paquete turístico.");
            }
        }
        
        //preguntar por el id del transporte, si existe comprobarlo
        var id_transporte = await TipoTransporte.findOne({id: parseInt(data.id_transporte )});
        if(id_transporte === null || id_transporte === undefined) {
            return res.badRequest("El tipo de bus no está registrado en la BD.");    
        } else {
            id_transporte = id_transporte.id;
        }

        //actualizar el objeto paquete 
        var updatedRegister = await Paquete.updateOne({ id: data.id }).set({
            nombre_paquete: data.nombre,
            cantidad_noches: data.noches,
            lugar_salida: data.salida,
            fecha: data.fecha,
            observaciones_paquete: data.observaciones,
            edad_desde:data.ageInic,
            edad_hasta:data.ageEnd, 
            properties_paquete: data.properties,
            id_destino: id_destino,
            id_hotel: id_hotel,
            id_tipoBus: id_transporte,             
        });
        if(updatedRegister !== null && updatedRegister !== undefined) {
            return res.send({ code: "OK", msg: "PACK__EDIT_SUCCESS" });     
        } else {
            return res.send({ code: "ERR", msg: "PACK_EDIT_ERROR" });
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
            var ext = imagenes[x].ext;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
        }
        //Obtener imágenes de las excursiones y eliminarlas
        var excursiones = await  Excursion.find()
            .where({id_paquete: req.param('id')}); 
        for(var x = 0; x < excursiones.length; x++) {
            var nombre_imagen = excursiones[x].imagen_excursion;
            var ext = excursiones[x].ext_imagen;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
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
                                                select: ['comprobante', 'ficha_medica','imagen_documento'] });
            for(var y = 0; y < archivos.length; y++) {
                var archivo = archivos[y];
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
            await Pasajero.destroy({id_reservacion: reserva.id});   
            //Eliminar los registros de la BD
            await AsientoReservado.destroy({id_reserva: reserva.id});
            await Reservacion.destroyOne({id:reserva.id});               
        }     
        //Eliminar los registros de la BD
        await Imagen.destroy({id_paquete:req.param('id')}); ////eliminar imágenes del paquete
        await Actividad.destroy({id_paquete:req.param('id')});//eliminar itinerario del paquete
        await Excursion.destroy({id_paquete:req.param('id')});//eliminar excursiones del paquete
        await Paquete.destroyOne({id:req.param('id')});         
        return res.send({ code: "OK", msg: "PACK_DELETE_SUCCESS" });       
     },

     

    show:async function(req, res, next) {
        var paquete = await Paquete.findOne(req.param('id'))
            .populate('id_destino')
            .populate('id_hotel')
            .populate('id_tipoBus')
            .populate('itinerario')
            .populate('excursiones')
            .populate('imagenes');
        if(paquete !== null && paquete !== undefined) {
            return res.json(paquete);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    packs: async function(req, res, next) { //devuelve ls apquetes publicados (estado 1)
        var list = await Paquete.find().where({'id_estado': 1}).sort('nombre_paquete ASC')
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

    indexByDestino: async function(req, res, next) { //devuelve todos los paquetes de un destino
        var list = await Paquete.find().where({'id_destino': req.param('id_destino')})
            .sort('nombre_paquete ASC')
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
    indexByName: async function(req, res, next) { //devuelve los paquetes por nombre o mes
        var value = req.body.search;
        //si es el nombre de un mes devolvemos el valor transformado
        if(value === 'enero') value = '/01/';
        if(value === 'febrero') value = '/02/';
        if(value === 'marzo') value = '/03/';
        if(value === 'abril') value = '/04/';
        if(value === 'mayo') value = '/05/';
        if(value === 'junio') value = '/06/';
        if(value === 'julio') value = '/07/';
        if(value === 'agosto') value = '/08/';
        if(value === 'septiembre') value = '/09/';
        if(value === 'octubre') value = '/10/';
        if(value === 'noviembre') value = '/11/';
        if(value === 'diciembre') value = '/12/';

        var list = await Paquete.find().where({
                or: [
                    {'nombre_paquete': {contains: value}},
                    {'fecha': {contains: value}},
                ]
            }).sort('nombre_paquete ASC')
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

  

};

