/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Data to create
  var userType = ['Administrador', 'Agencia'];
  var userState = ['Activo', 'Inactivo'];
  var busType = ['Bus dos plantas', 'Bus semicama'];
  var habitacionType = ['Individual', 'Doble', 'Triple', 'Cuadruple'];
  var camaType = ['Twin', 'Matrimonial'];
 
  // Set user
  console.log("Starting seed");
  var admin = await User.findOne({email_user: 'developer.proy8020@gmail.com'});
  if(admin === null || admin === undefined) {
    await User.create({
      email_user: 'developer.proy8020@gmail.com',
      password_user: 'admin123*',
      password_user_temp:  '$2b$10$SNytWtv42Jq2rbTFt/bzTuLV/axlsX2G5DsQmHQlIZAB5AfGheKXu',
      id_roll_user: 1,
      id_estado_user: 1,
      token: '',       
      });
  }

  // Set user type
  for(var x = 0; x < userType.length; x++) {
    var type = await TipoUsuario.findOne({nombre: userType[x]});
    if(type === null || type === undefined) {
      await TipoUsuario.create({
          nombre: userType[x],
        });
    }
  }

  // Set user state
  for(var x = 0; x < userState.length; x++) {
    var type = await Estado.findOne({nombre: userState[x]});
    if(type === null || type === undefined) {
      await Estado.create({
          nombre: userState[x],
        });
    }
  }

  //Set tipo bus
  for(var x = 0; x < busType.length; x++) {
    var type = await TipoTransporte.findOne({tipo: busType[x]});
    if(type === null || type === undefined) {
      await TipoTransporte.create({
          tipo: busType[x],
        });
    }
  }

  //Set tipo habitacion
  for(var x = 0; x < habitacionType.length; x++) {
    var type = await TipoHabitacion.findOne({tipo: habitacionType[x]});
    if(type === null || type === undefined) {
      await TipoHabitacion.create({
          tipo: habitacionType[x],
        });
    }
  }

  //Set tipo cama
  for(var x = 0; x < camaType.length; x++) {
    var type = await TipoCama.findOne({tipo: camaType[x]});
    if(type === null || type === undefined) {
      await TipoCama.create({
          tipo: camaType[x],
        });
    }
  }

};
