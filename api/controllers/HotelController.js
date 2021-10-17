/**
 * HotelController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var base64Img = require('base64-img');
const fs = require('fs').promises;
var path = require('path');

module.exports = {
    index: async function(req, res, next) {
        var list = await Hotel.find().sort('nombre_hotel ASC').populate('habitaciones');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }          
    },

    edit: async function(req, res, next) {
        var value = await  Hotel.findOne(req.param('id')).
            populate('habitaciones');
        if(value !== null && value !== undefined) {
            var imagen = "";
            if(value.imagen_hotel !==""){
                try{
                    imagen = base64Img.base64Sync('pictures/'+value.imagen_hotel);
                }catch(err){
                    imagen = '';
                }
                
            }
            //for para recorrer las habitaciones y devolver lo que se necesita
            habitaciones = [];
            for(var x = 0; x < value.habitaciones.length; x++) {
                var hab = await TipoHabitacion.findOne({id: value.habitaciones[x].id_tipo_habitacion});
                if(hab){
                   var item = {
                        id: hab.id,                        
                        tipo: hab.tipo,
                        precio: value.habitaciones[x].precio,
                    }
                    habitaciones.push(item);
                }                
            }
            
            var item = {
                id: value.id,
                nombre_hotel: value.nombre_hotel,
                categoria_hotel: value.categoria_hotel,
                cama_simple: value.cama_simple,
                cama_doble: value.cama_doble,
                imagen_hotel: value.imagen_hotel,
                imagen: imagen,                
                ext: value.ext,
                habitaciones: habitaciones,
            };
            
            return res.send({ code: "OK", msg: "HOTEL_FOUND", data: item });
        } else {
            res.send({ code: "OK", msg: "HOTEL_NOT_FOUND" });   
        }        
    },

    update: async function(req, res, next) {
        const data = req.body;
        var imagen = data.imagen;
        

        var updatedRecord = await Hotel.updateOne({ id: data.id }).set({
            nombre_hotel: data.nombre,
            categoria_hotel: data.categoria,
            cama_simple: data.simple,
            cama_doble: data.doble,            
        });
        
        if(updatedRecord !== null && updatedRecord!== undefined) {
            //Trabajar la imagen
            //Obtener la imagen anterior para eliminarla fisicamente
            var old_imagen = updatedRecord.imagen_hotel;
            
            var uploadFile = req.file('imagen');
            await uploadFile.upload({ dirname: '../../pictures'},function onUploadComplete(err, files) {  
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
                    //eliminar imagen del sistema de archivos
                    if(old_imagen!==null || old_imagen !=='') {
                        fs.unlink('pictures/'+old_imagen, (err => {
                            if (err) console.log(err);                            
                        }));
                    }  
                    Hotel.updateOne({ id: data.id }).set({
                        imagen_hotel: name,
                    }).exec((err, update)=>  {
                        if (err) {                                    
                            return res.serverError(err);
                        }                          
                    });  
                }
            });              
            return res.send({ code: "OK", msg: "HOTEL_EDIT_SUCCESS", data: updatedRecord });     
        } else {
            return res.send({ code: "ERR", msg: "HOTEL_EDIT_ERROR" });
        }
    
    },

    delete: async function(req, res, next) {
        //recuperar el nombre de la imagen para borrarla fisicamente
        var hotel = await Hotel.findOne({id: parseInt(req.param('id') )});
        if(hotel !== null && hotel !== undefined) {
            var nombre_imagen = hotel.imagen_hotel;
            
            if(nombre_imagen !== ""){
                //código para eliminar fisicamente la imagen anterior
                await fs.unlink('pictures/'+nombre_imagen);   
            }
        } 
        await Habitacion.destroy({id_hotel:req.param('id')});   
        Hotel.destroyOne(req.param('id'), function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.send({ code: "OK", msg: "HOTEL_DELETE_SUCCESS" }); 
        });
    },

    create: async function(req, res) {
        const data = req.body;
        var imagen = data.imagen;
        
        var createdRegister = await Hotel.create({
            nombre_hotel: data.nombre,
            categoria_hotel: data.categoria,  
            cama_simple: data.simple,
            cama_doble: data.doble,
        }).fetch(); 
    
        if(createdRegister !== null && createdRegister !== undefined){
            //Trabajar la imagen
            var uploadFile = req.file('imagen');
            await uploadFile.upload({ dirname: '../../pictures'},function onUploadComplete(err, files) {  
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
                    Hotel.updateOne({ id: createdRegister.id }).set({
                        imagen_hotel: name,
                    }).exec((err, update)=>  {
                        if (err) {                                    
                            return res.serverError(err);
                        }                          
                    });  
                }
            });           
            
            return res.send({ code: "OK", msg: "HOTEL_CREATED", data: createdRegister });
        }  else {
            return res.send({ code: "ERR", msg: "HOTEL_NOT_CREATED" });
        }         
    }, 

    getPicture: async function(req, res) {
        var hotel = await Hotel.findOne({id: parseInt(req.param('id') )});
        if(hotel !== null && hotel !== undefined) {
            var nombre_imagen = hotel.imagen_hotel;
            var ext = hotel.ext;
            if(nombre_imagen !== "" && ext !==""){
                var code = base64Img.base64Sync('pictures/'+nombre_imagen+'.'+ext);
                var image = {
                    nombre_imagen: nombre_imagen,
                    ext_imagen: ext,
                    imagen: code,
                }
                return res.json(image);
            } else {
                return res.send({ code: "ERR", msg: "IMAGE_NOT_EXIST" }); 
            }            
        } else {
            return res.send({ code: "ERR", msg: "HOTEL_NOT_EXIST" }); 
        }
    },

    setPicture: async function(req, res) {
        const data = req.body;
        var hotel = await Hotel.findOne({id: parseInt(data.id )});
        if(hotel !== null && hotel !== undefined) {
            var old_imagen = hotel.imagen_hotel; //recuperar la imagen anterior si existe
            var old_ext = hotel.ext;
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'hotel' + hotel.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(data.imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var uphotel = await Hotel.updateOne({ id: hotel.id }).set({
                        imagen_hotel: namePhoto,
                        ext: data.ext,                                
                    }); 
                    if(uphotel !== null && uphotel !== undefined){
                        //Eliminar fisicamente la imagen anterior si existe
                        if(old_imagen !== "" && old_ext !== ""){
                             //código para eliminar fisicamente la imagen anterior
                            await fs.unlink('pictures/'+old_imagen+'.'+old_ext);   
                        }
                        return res.send({ code: "OK", msg: "IMAGE_UPDATE" });
                    } else {
                        //Incorporar código para eliminar fisicamente la imagen
                        await fs.unlink('pictures/'+namePhoto+'.'+data.ext);
                        return res.send({ code: "ERR", msg: "IMAGE_NOT_UPDATE" });
                    }
                } else {
                    return res.send({ code: "ERR", msg: "IMAGE_NOT_UPDATE" });
                }
            }
        } else {
            return res.send({ code: "ERR", msg: "HOTEL_NOT_EXIST" }); 
        }        
    },

    deletePicture: async function(req, res) {
        var hotel = await Hotel.findOne({id: parseInt(req.param('id') )});
        if(hotel !== null && hotel !== undefined) {
            var nombre_imagen = hotel.imagen_hotel;
            var ext = hotel.ext;
            if(nombre_imagen !== "" ){
                //actualizar tabla
                var uphotel = await Hotel.updateOne({ id: hotel.id }).set({
                    imagen_hotel: "", 
                                                  
                }); 
                if(uphotel !== null && uphotel !== undefined){
                    //borrar fichero
                    await fs.unlink('pictures/'+nombre_imagen);
                    return res.send({ code: "OK", msg: "IMAGE_DELETE" });
                } else {
                    return res.send({ code: "ERR", msg: "IMAGE_NOT_DELETE" });
                }               
            } else {
                return res.send({ code: "ERR", msg: "IMAGE_NOT_EXIST" }); 
            }                 
        } else {
            return res.send({ code: "ERR", msg: "HOTEL_NOT_EXIST" }); 
        }

    }


};

