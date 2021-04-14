/**
 * HotelController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var base64Img = require('base64-img');
const fs = require('fs').promises;

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
        var value = await  Hotel.findOne(req.param('id')).populate('habitaciones');
        if(value !== null && value !== undefined) {
            var imagen = "";
            if(value.imagen_hotel !==""){
                imagen = base64Img.base64Sync('pictures/'+value.imagen_hotel+'.'+value.ext);
            }
            var item = {
                id: value.id,
                nombre_hotel: value.nombre_hotel,
                categoria_hotel: value.categoria_hotel,
                imagen_destino: value.imagen_hotel,
                imagen: imagen,                
                ext: value.ext,
                habitaciones: value.habitaciones,
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
        });
        
        if(updatedRecord !== null && updatedRecord !== undefined) {
            //Trabajar la imagen
            //Obtener la imagen anterior para eliminarla fisicamente
            var old_imagen = updatedRecord.imagen_hotel;
            var old_ext = updatedRecord.ext;
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'hotel' + updatedRecord.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var upRecord = await Hotel.updateOne({ id: updatedRecord.id }).set({
                        imagen_hotel: namePhoto, 
                        ext: data.ext,                               
                    }); 
                    if(upRecord !== null && upRecord !== undefined){
                        //Eliminar fisicamente la imagen anterior si existe
                        if(old_imagen !== "" && old_ext !== ""){
                            //código para eliminar fisicamente la imagen anterior
                            await fs.unlink('pictures/'+old_imagen+'.'+old_ext);                           
                        }
                        return res.send({ code: "OK", msg: "HOTEL_EDIT_SUCCESS", data: upRecord });
                    } else {
                        //eliminar fisicamente la imagen actual
                        await fs.unlink('pictures/'+namePhoto+'.'+data.ext);
                        return res.send({ code: "ERR", msg: "IMAGEN_NOT_SAVED" });
                    }
                } else {
                    return res.send({ code: "ERR", msg: "IMAGEN_NOT_SAVED" });
                }
            }
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
            var ext = hotel.ext;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen anterior
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
        } 
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
        }).fetch(); 
    
        if(createdRegister !== null && createdRegister !== undefined){
            //Trabajar la imagen
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'hotel' + createdRegister.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var upRegister = await Hotel.updateOne({ id: createdRegister.id }).set({
                        imagen_hotel: namePhoto,    
                        ext: data.ext,                            
                    }); 
                    if(upRegister !== null && upRegister !== undefined){
                        return res.send({ code: "OK", msg: "HOTEL_CREATED", data: upRegister });
                    } else {
                        //Incorporar código para eliminar fisicamente la imagen
                        await fs.unlink('pictures/'+namePhoto+'.'+data.ext);   
                        return res.send({ code: "ERR", msg: "IMAGE_NOT_SAVED" });
                    }
                } else {
                    return res.send({ code: "ERR", msg: "IMAGE_NOT_SAVED" });
                }
            }
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
            if(nombre_imagen !== "" && ext !== ""){
                //actualizar tabla
                var uphotel = await Hotel.updateOne({ id: hotel.id }).set({
                    imagen_hotel: "", 
                    ext: "",                               
                }); 
                if(uphotel !== null && uphotel !== undefined){
                    //borrar fichero
                    await fs.unlink('pictures/'+nombre_imagen+'.'+ext);
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

