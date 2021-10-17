/**
 * TipoTransporteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {

    get: async function(req, res) {
        const data = req.body;
        var tipoTransporte = await TipoTransporte.findOne({tipo: data.tipo});
        if(tipoTransporte !== null && tipoTransporte !== undefined) {
            return res.json(tipoTransporte);                       
        } else {
            return res.send({ code: "404", msg: "TIPO_NOT_EXIST" }); 
        }
    },  

    index: async function(req, res) {
        var list = await TipoTransporte.find();
        if(list !== null && list !== undefined) {
            return res.json(list);                       
        } else {
            return res.send({ code: "404", msg: "TIPO_NOT_EXIST" }); 
        }
    }, 
    
    getById: async function(req, res) {
        const data = req.body;
        var tipoTransporte = await TipoTransporte.findOne({id: data.id});
        if(tipoTransporte !== null && tipoTransporte !== undefined) {
            return res.json(tipoTransporte);                       
        } else {
            return res.send({ code: "404", msg: "TIPO_NOT_EXIST" }); 
        }
    },  

};