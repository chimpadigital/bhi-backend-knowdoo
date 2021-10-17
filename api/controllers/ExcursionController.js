/**
 * ExcursionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base64Img = require('base64-img');
const fs = require('fs').promises;
                           
module.exports = {
    index: async function(req, res, next) {
        var excursiones = await  Excursion.find()
            .where({id_paquete: req.param('id_paquete')});
        var list = [];
        for(var x = 0; x < excursiones.length; x++) {
            var value  = excursiones[x];
            var imagen = "";
            if(value.imagen_excursion !==""){
                imagen = base64Img.base64Sync('pictures/'+value.imagen_excursion);
            }
            var item = {
                id: value.id,
                titulo_excursion: value.titulo_excursion,
                descripcion_excursion: value.descripcion_excursion,
                observaciones_excursion: value.observaciones_excursion,
                imagen_excursion: value.imagen_excursion,
                imagen: imagen,                                
                id_paquete: value.id_paquete,
            };
            list.push(item);
        };
        return res.json(list);        
    },

    editExcursiones: async function(req, res, next) {
        const data = req.body;
        for(var x = 0; x < data.length; x++) {
            var registro = await Excursion.updateOne({ id: data[x].id }).set({
                titulo_excursion: data[x].titulo,
                descripcion_excursion: data[x].descripcion,
                observaciones_excursion: data[x].observaciones,                 
            });
            //Trabajar la imagen
            if(registro !== null && registro !== undefined) {                
                //Obtener la imagen anterior para eliminarla fisicamente
                var old_imagen = registro.imagen_excursion;
                var old_ext = registro.ext_imagen;
                if(data[x].imagen!== null && data[x].imagen !== undefined && data[x].imagen !=='') {
                    var date =  new Date();
                    var namePhoto  = 'excursion' + registro.id +'_'+ date.getTime();
                    var filepath = base64Img.imgSync(data[x].imagen, 'pictures', namePhoto); // pictures it is folder so save image
                    if(filepath !== null && filepath !== undefined) {
                        var upRecord = await Excursion.updateOne({ id: registro.id }).set({
                            imagen_excursion: namePhoto,    
                            ext_imagen: data[x].ext,                               
                        }); 
                        if(upRecord !== null && upRecord !== undefined){
                            //Eliminar fisicamente la imagen anterior si existe
                            if(old_imagen !== "" && old_ext !== ""){
                                //código para eliminar fisicamente la imagen anterior
                                await fs.unlink('pictures/'+old_imagen+'.'+old_ext);                           
                            }
                        } else { //eliminar la imagen nueva que no pudo ser actualizada en BD
                            await fs.unlink('pictures/'+namePhoto+'.'+data[x].ext);
                        }
                    } 
                }                     
            } 
        };
        return res.send({ code: "OK", msg: "EXCURSIONES_EDIT_SUCCESS" });    
    },

    deleteExcursionesPack: async function(req, res, next) {
       //Eliminar las imágenes físicas de las excursiones del paquete
       var excursiones = await  Excursion.find()
            .where({id_paquete: req.param('id_paquete')}); 
       for(var x = 0; x < excursiones.length; x++) {
            var nombre_imagen = excursiones[x].imagen_excursion;
            var ext = excursiones[x].ext_imagen;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen anterior
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
       }
       await Excursion.destroy({id_paquete:req.param('id_paquete')}); 
       return res.send({ code: "OK", msg: "EXCURSIONES_DELETE_SUCCESS" });       
    },

    deleteExcursiones: async function(req, res, next) {
        const data = req.body;
        //Eliminar las imágenes físicas de las excursiones a eliminar
        var excursiones = await  Excursion.find()
            .where({id: { in: data}}); 
        for(var x = 0; x < excursiones.length; x++) {
            var nombre_imagen = excursiones[x].imagen_excursion;
            if(nombre_imagen !== ""){
                //código para eliminar fisicamente la imagen anterior
                await fs.unlink('pictures/'+nombre_imagen);   
            }
        }
       await Excursion.destroy( {id: { in: data} }); 
       return res.send({ code: "OK", msg: "EXCURSIONES_DELETE_SUCCESS" });       
     },

    createExcursiones: async function(req, res) {
        const id_paquete = req.body.id_paquete;
        const data = req.body.excursiones;
        
        //preguntar por el id del paquete, si existe comprobarlo
        var paquete = await Paquete.findOne({id: parseInt(id_paquete )});
        if(paquete === null || paquete === undefined) {
            return res.badRequest("El paquete turístico no está registrado en la BD.");    
        } else { //Registrar excursiones
            var list = [];
            for(var x = 0; x < data.length; x++) {                
                var registro = await Excursion.create({
                    titulo_excursion: data[x].titulo,
                    descripcion_excursion: data[x].descripcion,
                    observaciones_excursion: data[x].observaciones,  
                    id_paquete: id_paquete,
                }).fetch();
                list.push(registro.id);
                //Trabajar la imagen
                if(data[x].imagen!== null && data[x].imagen !== undefined && data[x].imagen !=='') {
                    var date =  new Date();
                    var namePhoto  = 'excursion' + registro.id +'_'+ date.getTime();
                    var filepath = base64Img.imgSync(data[x].imagen, 'pictures', namePhoto); // pictures it is folder so save image
                     
                    if(filepath !== null && filepath !== undefined) {
                        var name = filepath.substr(
                            Math.max(
                                filepath.lastIndexOf('\\'),
                                filepath.lastIndexOf('/'),
                            ) + 1,
                        );  
                        var upRegister = await Excursion.updateOne({ id: registro.id }).set({
                            imagen_excursion: name                                                      
                        }); 
                        if(upRegister === null || upRegister === undefined){
                            //Incorporar código para eliminar fisicamente la imagen creada
                            await fs.unlink('pictures/'+name);                               
                        }
                    }
                }
            }
            return res.send({ code: "OK", msg: "EXCURSIONES_CREATED", list: list }); 
        }                 
    }, 

    getPicture: async function(req, res) {
        var registro = await Excursion.findOne({id: parseInt(req.param('id') )});
        if(registro !== null && registro !== undefined) {
            var nombre_imagen = registro.imagen_excursion;
            var ext = registro.ext_imagen;
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
            return res.send({ code: "ERR", msg: "EXCURSION_NOT_EXIST" }); 
        }
    },
    setPicture: async function(req, res) {
        const data = req.body;
        var registro = await Excursion.findOne({id: parseInt(data.id )});
        if(registro !== null && registro !== undefined) {
            var old_imagen = registro.imagen_excursion; //recuperar la imagen anterior si existe
            var old_ext = registro.ext_imagen;
            if(data.imagen!== null && data.imagen !== undefined && data.imagen !=='') {
                var date =  new Date();
                var namePhoto  = 'excursion' + registro.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(data.imagen, 'pictures', namePhoto); // pictures it is folder so save image
                if(filepath !== null && filepath !== undefined) {
                    var upregistro = await Excursion.updateOne({ id: registro.id }).set({
                        imagen_excursion: namePhoto,
                        ext_imagen: data.ext,                                
                    }); 
                    if(upregistro !== null && upregistro !== undefined){
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
            return res.send({ code: "ERR", msg: "EXCURSION_NOT_EXIST" }); 
        }        
    },

    deletePicture: async function(req, res) {
        var registro = await Excursion.findOne({id: parseInt(req.param('id') )});
        if(registro !== null && registro !== undefined) {
            var nombre_imagen = registro.imagen_excursion;
            var ext = registro.ext_imagen;
            if(nombre_imagen !== "" && ext !== ""){
                //actualizar tabla
                var upregistro = await Excursion.updateOne({ id: registro.id }).set({
                    imagen_excursion: "", 
                    ext_imagen: "",                               
                }); 
                if(upregistro !== null && upregistro !== undefined){
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
            return res.send({ code: "ERR", msg: "EXCURSION_NOT_EXIST" }); 
        }

    }
};

