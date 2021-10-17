const moment = require('moment');
const fs = require('fs').promises;

module.exports.cron = {

    deleteReservaAfter48h: {
      schedule: '0 0 */1 * * *', //Comprobar cada una hora
      onTick: async function () {
        //obtener reserva con más de 48 horas sin confirmar
        var data = moment().subtract(48, 'hours').format('YYYY-MM-DD HH:mm:ss');
        
        var reservaciones = await  Reservacion.find().where({'fecha_registro':{"<":data}, 'estado':{ '!=' : 2}});
        
        //eliminar reservas obtenidas
        for(var x = 0; x < reservaciones.length; x++) {
            //eliminar comprobante de reserva 
            var reserva = reservaciones[x];
            if(reserva.comprobante !== null && reserva.comprobante !== undefined && reserva.comprobante !== "") {
                fs.unlink('comprobantes/'+reserva.comprobante, (err => {
                    if (err) console.log(err);                            
                }));
            }
            //eliminar archivos de pasajeros     
            var archivos = await  Pasajero.find({ where: {id_reservacion: reserva.id},
                                                select: ['comprobante'] });                  
            for(var y = 0; y < archivos.length; y++) {
                var archivo = archivos[y];
                if(archivo.comprobante !== null && archivo.comprobante !== undefined && archivo.comprobante !== "") {
                    await fs.unlink('comprobantes/'+archivo.comprobante); 
                }  
                //eliminar documentos de Pasajero
                var docs = await  Documentos.find({ where: {pasajero:archivo.id},
                    select: ['nombre'] });
                for(let i=0; i<docs.length; i++) {
                    //eliminar fichero
                    if(docs[i].nombre !== null && docs[i].nombre !== undefined && docs[i].nombre !== "") {
                        await fs.unlink("documents/"+docs[i].nombre); 
                    } 
                    //actualizar BD
                    await Documentos.destroyOne({ id: docs[i].id });
                }   
                //eliminar ficha médica de pasajero
                var fichas = await  FichaMedica.find({ where: {pasajero:archivo.id},
                                                        select: ['nombre'] });
                for(let i=0; i<fichas.length; i++) {
                    //eliminar fichero
                    if(fichas[i].nombre !== null && fichas[i].nombre !== undefined && fichas[i].nombre !== "") {
                        await fs.unlink("documents/"+fichas[i].nombre); 
                    } 
                    //actualizar BD
                    await FichaMedica.destroyOne({ id: fichas[i].id });
                }                          
            }
            //Eliminar los registros de la BD
            await Pasajero.destroy({id_reservacion:reserva.id}); 
            await Reservacion.destroyOne({id:reserva.id});  
        }   
      }
    }
  };