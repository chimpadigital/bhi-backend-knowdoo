module.exports = {

    index: async function(req, res) {
        var list = await TipoCama.find();
        if(list !== null && list !== undefined) {
            return res.json(list);                       
        } else {
            return res.send({ code: "404", msg: "TIPO_NOT_EXIST" }); 
        }
    },   
    

};