/**
 * DestinoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base64Img = require('base64-img');
const fs = require('fs').promises;

module.exports = {
    index: async function(req, res, next) {
        var list = await Destino.find().sort('nombre_destino ASC');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }        
    },

    edit: async function(req, res, next) {
        var value = await  Destino.findOne(req.param('id'));
        if(value !== null && value !== undefined) {
            var imagen = "";
            if(value.imagen_destino !==""){
                imagen = base64Img.base64Sync('pictures/'+value.imagen_destino+'.'+value.ext);
            }
            var item = {
                id: value.id,
                nombre_destino: value.nombre_destino,
                descripcion_destino: value.descripcion_destino,
                imagen_destino: value.imagen_destino,
                imagen: imagen,                
                ext: value.ext,
            };
            return res.send({ code: "OK", msg: "DESTINO_FOUND", data: item });
        } else {
            res.send({ code: "OK", msg: "DESTINO_NOT_FOUND" });   
        }
    }, 


    update: async function(req, res, next) {
        const data = req.body;
        var imagen = data.imagen;
        

        var updatedRecord = await Destino.updateOne({ id: data.id }).set({
            nombre_destino: data.name,
            descripcion_destino: data.descripcion,            
        });
        
        if(updatedRecord !== null && updatedRecord !== undefined) {
            //Trabajar la imagen
            //Obtener la imagen anterior para eliminarla fisicamente
            var old_imagen = updatedRecord.imagen_destino;
            var old_ext = updatedRecord.ext;
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'destino' + updatedRecord.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var upRecord = await Destino.updateOne({ id: updatedRecord.id }).set({
                        imagen_destino: namePhoto, 
                        ext: data.ext,                               
                    }); 
                    if(upRecord !== null && upRecord !== undefined){
                        //Eliminar fisicamente la imagen anterior si existe
                        if(old_imagen !== "" && old_ext !== ""){
                            //código para eliminar fisicamente la imagen anterior
                            await fs.unlink('pictures/'+old_imagen+'.'+old_ext);                           
                        }
                        return res.send({ code: "OK", msg: "DESTINO_EDIT_SUCCESS", data: upRecord });
                    } else {
                        //Incorporar código para eliminar fisicamente la imagen
                        await fs.unlink('pictures/'+namePhoto+'.'+data.ext);
                        return res.send({ code: "ERR", msg: "IMAGEN_NOT_SAVED" });
                    }
                } else {
                    return res.send({ code: "ERR", msg: "IMAGEN_NOT_SAVED" });
                }
            }
            return res.send({ code: "OK", msg: "DESTINO_EDIT_SUCCESS", data: updatedRecord });     
        } else {
            return res.send({ code: "ERR", msg: "DESTINO_EDIT_ERROR" });
        }
    
    },

    delete: async function(req, res, next) {
        //recuperar el nombre de la imagen para borrarla fisicamente
        var destino = await Destino.findOne({id: parseInt(req.param('id') )});
        if(destino !== null && destino !== undefined) {
            var nombre_imagen = destino.imagen_destino;
            var ext = destino.ext;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen anterior
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
        } 
        //Eliminar registro
        Destino.destroyOne(req.param('id'), function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.send({ code: "OK", msg: "DESTINO_DELETE_SUCCESS" }); 
        });
    },

    create: async function(req, res) {
        const data = req.body;
        var imagen = data.imagen;
                
        var createdRegister = await Destino.create({
            nombre_destino: data.name,
            descripcion_destino: data.descripcion,
        }).fetch(); 
        
        if(createdRegister !== null && createdRegister !== undefined){

            //Trabajar la imagen
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'destino' + createdRegister.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var upRegister = await Destino.updateOne({ id: createdRegister.id }).set({
                        imagen_destino: namePhoto,    
                        ext: data.ext,                            
                    }); 
                    if(upRegister !== null && upRegister !== undefined){
                        return res.send({ code: "OK", msg: "DESTINO_CREATED", data: upRegister });
                    } else {
                        //Incorporar código para eliminar fisicamente la imagen
                        await fs.unlink('pictures/'+namePhoto+'.'+data.ext);   
                        return res.send({ code: "ERR", msg: "IMAGE_NOT_SAVED" });
                    }
                } else {
                    return res.send({ code: "ERR", msg: "IMAGE_NOT_SAVED" });
                }
            }
            return res.send({ code: "OK", msg: "DESTINO_CREATED", data: createdRegister });
        }  else {
            return res.send({ code: "ERR", msg: "DESTINO_NOT_CREATED" });
        }              
    }, 

    getPicture: async function(req, res) {
        var destino = await Destino.findOne({id: parseInt(req.param('id') )});
        if(destino !== null && destino !== undefined) {
            var nombre_imagen = destino.imagen_destino;
            var ext = destino.ext;
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
            return res.send({ code: "ERR", msg: "DESTINO_NOT_EXIST" }); 
        }
    },

    setPicture: async function(req, res) {
        const data = req.body;
        var destino = await Destino.findOne({id: parseInt(data.id )});
        if(destino !== null && destino !== undefined) {
            var old_imagen = destino.imagen_destino; //recuperar la imagen anterior si existe
            var old_ext = destino.ext;
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'destino' + destino.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(data.imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var updestino = await Destino.updateOne({ id: destino.id }).set({
                        imagen_destino: namePhoto,
                        ext: data.ext,                                
                    }); 
                    if(updestino !== null && updestino !== undefined){
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
            return res.send({ code: "ERR", msg: "DESTINO_NOT_EXIST" }); 
        }        
    },

    deletePicture: async function(req, res) {
        var destino = await Destino.findOne({id: parseInt(req.param('id') )});
        if(destino !== null && destino !== undefined) {
            var nombre_imagen = destino.imagen_destino;
            var ext = destino.ext;
            if(nombre_imagen !== "" && ext !== ""){
                //actualizar tabla
                var updestino = await Destino.updateOne({ id: destino.id }).set({
                    imagen_destino: "", 
                    ext: "",                               
                }); 
                if(updestino !== null && updestino !== undefined){
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
            return res.send({ code: "ERR", msg: "DESTINO_NOT_EXIST" }); 
        }

    }


};

