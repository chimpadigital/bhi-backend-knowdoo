module.exports = {

    index: async function(req, res) {
        var list = await TipoHabitacion.find();
        if(list !== null && list !== undefined) {
            return res.json(list);                       
        } else {
            return res.send({ code: "404", msg: "TIPO_NOT_EXIST" }); 
        }
    },  
    
    getById: async function(req, res) {
        const data = req.body;
        var tipoHabitacion = await TipoHabitacion.findOne({id: data.id});
        if(tipoHabitacion !== null && tipoHabitacion !== undefined) {
            return res.json(tipoHabitacion);                       
        } else {
            return res.send({ code: "404", msg: "TIPO_NOT_EXIST" }); 
        }
    },  
    

};