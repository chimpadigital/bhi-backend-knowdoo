/**
 * ActividadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var base64Img = require('base64-img');

 module.exports = {
    index: async function(req, res, next) {
        await ExcursionOpcional.find({ id_paquete: req.param('id_paquete') })
            .exec(function(err, list) {
                if (err) return Error('Error');
                return res.json(list);
        });
    },
/*
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
*/
    deleteExcursionesItinerario: async function(req, res, next) {
        var id_paquete = req.param('id_paquete');
        await ExcursionOpcional.destroy({id_paquete:parseInt(id_paquete )}).exec(function(err) {
         if (err) return Error('Error');
            return res.send({ code: "OK", msg: "EXCURSIONES_DELETE_SUCCESS" });
        });        
    },

    deleteExcursiones: async function(req, res, next) {
        const data = req.body;
        await ExcursionOpcional.destroy( {id: { in: data} }).exec(function(err) {
            if (err) return Error('Error');
                return res.send({ code: "OK", msg: "EXCURSIONES_DELETE_SUCCESS" });
        });           
     },

    createExcursiones: async function(req, res) {
        const id_paquete = req.body.id_paquete;
        const data = req.body.excursiones;
        //preguntar por el id del paquete, si existe comprobarlo
        var paquete = await Paquete.findOne({id: parseInt(id_paquete )});
        if(paquete === null || paquete === undefined) {
            return res.badRequest("El paquete turístico no está registrado en la BD.");    
        } else { //Registrar actividades del itinerario
            var list = [];
            for(var x = 0; x < data.length; x++) {
                var act = await ExcursionOpcional.create({
                    titulo: data[x].titulo,                     
                    id_paquete: id_paquete,
                }).fetch();
                list.push(act.id);
            }
            return res.send({ code: "OK", msg: "EXCURSIONES_CREATED", list: list }); 
        }                  
    },  

    getExcursionesSlider: async function(req, res, next) {
        var listSlider = [];

        var list = await ExcursionOpcional.find({ id_paquete: req.param('id_paquete') });
        var imagenes =  await  Imagen.find().where({id_paquete: req.param('id_paquete'), nivel: 2});
        var countlist = list.length;
        var countimagenes = imagenes.length;
        
        //si no hay imagenes obtener una imagen del padre
        if (!imagenes.length){
            var imagenAux = await Imagen.find().where({id_paquete: req.param('id_paquete'), nivel: 0});
        }
        var j = 0;  //contador para las imagenes
        excursiones = [];
        for(var x = 0; x < list.length; x++){
            var item = {
                titulo: list[x].titulo,                
            }
            excursiones.push(item);
            if(x % 5 === 4 || x === countlist-1){ //si hay 5 elementos o se acabó la lista, guardar la imagen y la sublista de actividades
                //buscar el nombre de la imagen para la slide
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
                    list: excursiones,
                }
                listSlider.push(slider);
                excursiones = [];
            }            
        }
        return res.send({ excursiones_slider: listSlider });  
    },


};