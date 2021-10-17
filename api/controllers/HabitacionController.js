/**
 * HabitacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
    create: async function(req, res) {
        const data = req.body;

        //comprobar si el tipo de habitacion existe
        var registro = await TipoHabitacion.findOne({id: parseInt(data.tipo_habitacion)});
        if(registro === null || registro === undefined) {
            return res.badRequest("El tipo de habitación no está registrado en la BD");    
        }

        //comprobar si el hotel existe
        var registro = await Hotel.findOne({id: parseInt(data.hotel)});
        if(registro === null || registro === undefined) {
            return res.badRequest("El hotel no está registrado en la BD");    
        }
        
        var createdRegister = await Habitacion.create({
            id_tipo_habitacion:data.tipo_habitacion,
            precio: data.precio,            
            id_hotel: data.hotel,              
        }).fetch(); 
    
        if(createdRegister !== null && createdRegister !== undefined) {
            return res.send({ code: "OK", msg: "HABITACION_CREATED", data: createdRegister });     
        } else {
            return res.send({ code: "ERR", msg: "HABITACION_NOT_CREATED" });
        }        
    }, 

    createHabitaciones: async function(req, res) {
        const id_hotel = req.body.id_hotel;
        const data = req.body.habitaciones;

        //preguntar por el id del hotel, si existe comprobarlo
        var hotel = await Hotel.findOne({id: parseInt(id_hotel )});
        if(hotel === null || hotel === undefined) {
            return res.badRequest("El Hotel no está registrado en la BD.");    
        } else { //Registrar habitaciones del hotel
            for(var x = 0; x < data.length; x++) {
                await Habitacion.create({
                    id_tipo_habitacion:data[x].tipo_habitacion,
                    precio: data[x].precio,                    
                    id_hotel: id_hotel ,              
                });
            }
        }
        return res.send({ code: "OK", msg: "HABITACIONES_CREATED" });         
    }, 

    update: async function(req, res, next) {
        const data = req.body;
        var registro = await Habitacion.updateOne({ id: data.id }).set({
            precio: data.precio,                         
        });
        if(registro !== null && registro !== undefined) {
            return res.send({ code: "OK", msg: "HABITACION_EDIT_SUCCESS", data: registro });     
        } else {
            return res.send({ code: "ERR", msg: "HABITACION_NOT_EDIT" });
        }      
    },

    updateHabitaciones: async function(req, res, next) {
        const data = req.body;
        for(var x = 0; x < data.length; x++) {
            await Habitacion.updateOne({ id: data[x].id }).set({
                precio: data[x].precio,                                
            });
        };
        return res.send({ code: "OK", msg: "HABITACIONES_EDIT_SUCCESS" });    
    },

    index: async function(req, res, next) {
        var list = await Habitacion.find()
            .where({id_hotel: req.param('id_hotel')});
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }
    },

    get:async function(req, res, next) {
        var habitacion = await Habitacion.findOne(req.param('id'))
            .populate('id_tipo_habitacion')            
            .populate('id_hotel');
        if(habitacion !== null && habitacion !== undefined) {
            return res.json(habitacion);
        } else {
            return res.serverError("Something went wrong"); 
        }
    }, 

    deleteHabitaciones: async function(req, res, next) {
        await Habitacion.destroy({id_hotel:req.param('id_hotel')}); 
        return res.send({ code: "OK", msg: "HABITACIONES_DELETE_SUCCESS" });       
     },
 
    delete: async function(req, res, next) {
        await Habitacion.destroyOne( {id: parseInt(req.param('id'))}); 
        return res.send({ code: "OK", msg: "HABITACION_DELETE_SUCCESS" });       
    },
    
    

};

