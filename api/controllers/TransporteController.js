/**
 * TransporteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {

    index: async function(req, res, next) {
        var list = await Transporte.find().sort('id ASC');
        if(list !== null && list !== undefined) {
            return res.json(list);
        } else {
            return res.serverError("Something went wrong"); 
        }          
    },
  
    create: async function(req, res) {
        const data = req.body;
        //var imagen = data.imagen;
        
        var createdRegister = await Transporte.create({
            tipo_transporte: data.tipo_transporte,
            cantidad_asientos: data.cantidad_asientos, 
            asientos_libres: data.asientos_libres,
            asientos_ocupados: data.asientos_ocupados 
        }).fetch(); 
    
        if(createdRegister !== null && createdRegister !== undefined){
            
            return res.send({ code: "OK", msg: "TRANSPORTE_CREATED", data: createdRegister });
        }  else {
            return res.send({ code: "ERR", msg: "TRANSPORTE_NOT_CREATED" });
        }         
    }, 

    delete: async function(req, res, next) {
               
          Transporte.destroyOne(req.param('id'), function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.send({ code: "OK", msg: "TRANSPORTE_DELETE_SUCCESS" }); 
        });
    },

};

