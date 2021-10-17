/**
 * ActividadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var base64Img = require('base64-img');

module.exports = {
    index: async function(req, res, next) {
        await Actividad.find({ id_paquete: req.param('id_paquete') })
            .exec(function(err, list) {
                if (err) return Error('Error');
                return res.json(list);
        });
    },

    editActividades: async function(req, res, next) {
        const data = req.body;
        for(var x = 0; x < data.length; x++) {
            await Actividad.updateOne({ id: data[x].id }).set({
                titulo_actividad: data[x].dia,
                descripcion_actividad: data[x].actividad                 
            });
        };
        return res.send({ code: "OK", msg: "ITINERARIO_EDIT_SUCCESS" });    
    },

    deleteItinerario: async function(req, res, next) {
        var id_paquete = req.param('id_paquete');
        await Actividad.destroy({id_paquete:parseInt(id_paquete )}).exec(function(err) {
         if (err) return Error('Error');
            return res.send({ code: "OK", msg: "ITINERARIO_DELETE_SUCCESS" });
        }); 
    },

    deleteActividades: async function(req, res, next) {
        const data = req.body;
        await Actividad.destroy( {id: { in: data} }).exec(function(err) {
            if (err) return Error('Error');
                return res.send({ code: "OK", msg: "ITINERARIO_DELETE_SUCCESS" });
        });            
     },

    createActividades: async function(req, res) {
        const id_paquete = req.body.id_paquete;
        const data = req.body.actividades;
        
        //preguntar por el id del paquete, si existe comprobarlo
        var paquete = await Paquete.findOne({id: parseInt(id_paquete )});
        if(paquete === null || paquete === undefined) {
            return res.badRequest("El paquete turístico no está registrado en la BD.");    
        } else { //Registrar actividades del itinerario
            var list = [];
            for(var x = 0; x < data.length; x++) {
                var act = await Actividad.create({
                    titulo_actividad: data[x].dia,
                    descripcion_actividad: data[x].actividad,  
                    id_paquete: id_paquete,
                }).fetch(); 
                list.push(act.id);
            }
            return res.send({ code: "200", msg: "ITINERARIO_CREATED", list: list });
        }                   
    },  

    getItinerarioSlider: async function(req, res, next) {
        var listSlider = [];

        var list = await Actividad.find({ id_paquete: req.param('id_paquete') });
        var imagenes =  await  Imagen.find().where({id_paquete: req.param('id_paquete'), nivel: 1});
        var countlist = list.length;
        var countimagenes = imagenes.length;
        
        //si no hay imagenes obtener una imagen del padre
        if (!imagenes.length){
            var imagenAux = await Imagen.find().where({id_paquete: req.param('id_paquete'), nivel: 0});
        }
        var j = 0;  //contador para las imagenes
        actividades = [];
        for(var x = 0; x < list.length; x++){
            var item = {
                titulo_actividad: list[x].titulo_actividad,
                descripcion_actividad: list[x].descripcion_actividad,
            }
            actividades.push(item);
            if(x % 4 === 3 || x === countlist-1){ //si hay 4 elementos o se acabó la lista, guardar la imagen y la sublista de actividades
                //buscar el nombre de la imagen
                var nombre_imagen;
                if(countimagenes === 0){ //cargar la imagen del paquete
                    nombre_imagen = imagenAux[0].nombre;
                }
                else if (j < countimagenes){ //se encontró imagen
                    nombre_imagen = imagenes[j].nombre;
                    j++;
                }
                else { //coge la imagen anterior
                    nombre_imagen = imagenes[j-1].nombre; 
                }
                //devolver la imagen en code 64
                imagen = base64Img.base64Sync('pictures/'+nombre_imagen);
                //crear item slider y colocarlo en la lista de sliders
                var slider = {
                    imagen: imagen,
                    list: actividades,
                }
                listSlider.push(slider);
                actividades = [];
            }            
        }
        return res.send({ itinerario_slider: listSlider });  
    },

};

