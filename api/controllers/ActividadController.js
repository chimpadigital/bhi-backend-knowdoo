/**
 * ActividadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


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
       await Actividad.destroy({id_paquete:req.param('id_paquete')}); 
       return res.send({ code: "OK", msg: "ITINERARIO_DELETE_SUCCESS" });       
    },

    deleteActividades: async function(req, res, next) {
        const data = req.body;
       await Actividad.destroy( {id: { in: data} }); 
        return res.send({ code: "OK", msg: "ITINERARIO_DELETE_SUCCESS" });       
     },

    createActividades: async function(req, res) {
        const id_paquete = req.body.id_paquete;
        const data = req.body.actividades;
        
        //preguntar por el id del paquete, si existe comprobarlo
        var paquete = await Paquete.findOne({id: parseInt(id_paquete )});
        if(paquete === null || paquete === undefined) {
            return res.badRequest("El paquete turístico no está registrado en la BD.");    
        } else { //Registrar actividades del itinerario
            for(var x = 0; x < data.length; x++) {
                await Actividad.create({
                    titulo_actividad: data[x].dia,
                    descripcion_actividad: data[x].actividad,  
                    id_paquete: id_paquete,
                });
            }
        }
        return res.send({ code: "OK", msg: "ITINERARIO_CREATED" });           
    },  

};

