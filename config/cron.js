const moment = require('moment');
const fs = require('fs').promises;

module.exports.cron = {

    deleteReservaAfter48h: {
      schedule: '0 0 */1 * * *', //Comprobar cada una hora
      onTick: async function () {
        //obtener reserva con más de 48 horas sin confirmar
        var data = moment().subtract(48, 'hours').format('YYYY-MM-DD HH:mm:ss');
        
        var reservaciones = await  Reservacion.find().where({'fecha_registro':{"<":data}, 'estado':1});
        
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
                                                select: ['comprobante', 'ficha_medica','imagen_documento'] });                  
            for(var y = 0; y < archivos.length; y++) {
                var archivo = archivos[y];
                if(archivo.imagen_documento !== null && archivo.imagen_documento !== undefined && archivo.imagen_documento !== "") {
                    await fs.unlink("documents/"+archivo.imagen_documento); 
                }   
                if(archivo.ficha_medica !== null && archivo.ficha_medica !== undefined && archivo.ficha_medica !== "") {
                    await fs.unlink("documents/"+archivo.ficha_medica); 
                }
                if(archivo.comprobante !== null && archivo.comprobante !== undefined && archivo.comprobante !== "") {
                    await fs.unlink('comprobantes/'+archivo.comprobante); 
                }                      
            }
            await Pasajero.destroy({id_reservacion:reserva.id}); 
            //Eliminar los registros de la BD
            await AsientoReservado.destroy({id_reserva: reserva.id});
            await Reservacion.destroyOne({id:reserva.id});  
        }   
      }
    }
  };