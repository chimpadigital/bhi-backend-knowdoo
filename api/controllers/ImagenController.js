var base64Img = require('base64-img');
const fs = require('fs').promises;
                           
module.exports = {
    create: async function(req, res) {
        const id_paquete = req.body.id_paquete;
        const data = req.body.imagenes;
        
        //preguntar por el id del paquete, si existe comprobarlo
        var paquete = await Paquete.findOne({id: parseInt(id_paquete )});
        if(paquete === null || paquete === undefined) {
            return res.badRequest("El paquete turístico no está registrado en la BD.");    
        } else { //Registrar imágenes
            for(var x = 0; x < data.length; x++) {
                //guardar imagen fisica
                var date =  new Date();
                var namePhoto  = 'pack' + paquete.id +'_'+ date.getTime();
                var filepath = base64Img.imgSync(data[x].imagen, 'pictures', namePhoto); // pictures it is folder so save image
                //guardar en BD  
                if(filepath !== null && filepath !== undefined) {
                    var registro = await Imagen.create({
                        nombre: namePhoto,
                        ext: data[x].ext,
                        nivel: data[x].nivel,
                        id_paquete: id_paquete,                             
                    }).fetch(); 
                    if(registro === null || registro === undefined){
                        //Eliminar fisicamente la imagen creada
                        await fs.unlink('pictures/'+namePhoto+'.'+data[x].ext);                               
                    }
                }                  
            }
        }
        return res.send({ code: "OK", msg: "IMAGENES_SAVED" });          
    }, 

    //obtener la imagen por id o por nombre
    getPicture: async function(req, res) {
        var id = req.param('id');
        var name = req.param('name');
        if(id !== null && id !== undefined){
            var registro = await Imagen.findOne({id: parseInt(id)});
        } else {
            if(name !== null && name !== undefined){
                var registro = await Imagen.findOne({nombre: name});
            }
        }
        if(registro !== null && registro !== undefined) {
            var nombre_imagen = registro.nombre;
            var ext = registro.ext;
            if(nombre_imagen !== "" && ext !==""){
                var code = base64Img.base64Sync('pictures/'+nombre_imagen+'.'+ext);
                var image = {
                    nombre_imagen: nombre_imagen,
                    ext_imagen: ext,
                    id_paquete: registro.id_paquete,
                    nivel: registro.nivel,
                    imagen: code,     
                }
                return res.json(image);
            } else {
                return res.send({ code: "ERR", msg: "IMAGE_NOT_EXIST" }); 
            }            
        } else {
            return res.send({ code: "ERR", msg: "IMAGE_NOT_EXIST" }); 
        }
    },
    

    index: async function(req, res, next) {
        var tipo = req.param('tipo');
        var imagenes = []; 
        if(tipo !== null && tipo !== undefined){
            if(tipo === '1') { //imagenes del paquete
               imagenes = await  Imagen.find()
                    .where({
                        id_paquete: req.param('id_paquete'),
                        nivel: 0,
                    });
            } else {
                if(tipo === '2') { //imagenes del itinerario del paquete
                    imagenes = await  Imagen.find()
                         .where({
                             id_paquete: req.param('id_paquete'),
                             nivel: 1,
                         });
                } else { //todas las imagenes del paquete
                    imagenes = await  Imagen.find().where({id_paquete: req.param('id_paquete')});
                }
            }            
        } else { //si tipo no está definido se devuelven todas imagenes del paquete
            imagenes = await  Imagen.find().where({id_paquete: req.param('id_paquete')});
        }
        if (imagenes.length >= 1){
            var list = [];
            for(var x = 0; x < imagenes.length; x++) {
                var value  = imagenes[x];
                var imagen = "";
                if(value.nombre !=="" && value.ext !==""){
                    imagen = base64Img.base64Sync('pictures/'+value.nombre+'.'+value.ext);
                }
                var item = {
                    nombre_imagen: value.nombre,
                    ext_imagen: value.ext,
                    id_paquete: value.id_paquete,
                    nivel: value.nivel,
                    imagen: imagen,     
                };
                list.push(item);
            };
        return res.json(list); 
        } else {
            return res.send({ code: "OK", msg: "IMAGENS_NOT_FOUND" });
        }               
    },

    deleteImagenesPack: async function(req, res, next) {
       //Eliminar las imágenes físicas del paquete
       var imagenes = await  Imagen.find()
            .where({id_paquete: req.param('id_paquete')}); 
       for(var x = 0; x < imagenes.length; x++) {
            var nombre_imagen = imagenes[x].nombre;
            var ext = imagenes[x].ext;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
       }
       await Imagen.destroy({id_paquete:req.param('id_paquete')}); 
       return res.send({ code: "OK", msg: "IMAGENS_DELETE_SUCCESS" });       
    },

    deleteImagenes: async function(req, res, next) {
        const data = req.body;
        //Eliminar las imágenes físicas de las imagines a eliminar
        var imagenes = await  Imagen.find()
            .where({id: { in: data}}); 
        for(var x = 0; x < imagenes.length; x++) {
            var nombre_imagen = imagenes[x].nombre;
            var ext = imagenes[x].ext;
            if(nombre_imagen !== "" && ext !==""){
                //código para eliminar fisicamente la imagen anterior
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);   
            }
        }
       await Imagen.destroy( {id: { in: data} }); 
       return res.send({ code: "OK", msg: "IMAGENS_DELETE_SUCCESS" });       
     },

    deletePicture: async function(req, res) {
        var registro = await Imagen.findOne({id: parseInt(req.param('id') )});
        if(registro !== null && registro !== undefined) {
            var nombre_imagen = registro.nombre;
            var ext = registro.ext;
            if(nombre_imagen !== "" && ext !== ""){
                await fs.unlink('pictures/'+nombre_imagen+'.'+ext);
            }  
            await Imagen.destroyOne({id: parseInt(req.param('id'))});  
            return res.send({ code: "OK", msg: "IMAGE_DELETE_SUCCESS" });                           
        } else {
            return res.send({ code: "ERR", msg: "IMAGE_NOT_EXIST" }); 
        }
    } 
};
