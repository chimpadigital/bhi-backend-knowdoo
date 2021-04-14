/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var generator = require('generate-password');

module.exports = {
    create: async function(req, res) {
        
        const data = req.body;
        //Obtener el objeto rol según el identificador
        var userType = await TipoUsuario.findOne({id: parseInt(data.rol)});
        if(userType === null || userType === undefined) {
            return res.badRequest("There is no user type in the database.");    
        }
        
        //obtener el estado según el identificador,
        var state = await Estado.findOne({id: parseInt(data.estado)});
        if(state === null || state === undefined) {
            return res.badRequest("There is no user state in the database.");    
        }
        
        //Crear el objeto usuario si no existe usuario con el mismo email
        var existUser = await User.findOne({ email_user: data.email });
        if(existUser === null || existUser === undefined) {
            var createdUser = await User.create({
                email_user: data.email,
                password_user: data.password,
                id_roll_user: userType.id,
                id_estado_user: state.id,                
            }).fetch();
            if(createdUser !== null && createdUser !== undefined){
                // Set token
                createdUserToken = await  User.updateOne({ email_user: createdUser.email_user })
                    .set({token: jwToken.issue({ id: createdUser.id })}); 
                if(createdUserToken !== null && createdUserToken !== undefined){
                    user = await User.findOne({ id: createdUser.id });
                    return res.send({ code: "OK", msg: "USER_CREATED", data: user });  
                } else {
                    return res.serverError("Something went wrong"); 
                } 
            } else {
                return res.serverError("Something went wrong"); 
            } 
        } else {
            return res.send({ code: "OK", msg: "USER_EMAIL_EXIST" });
        }
    },

    changeEstado: async function(req, res, next) {
        const data = req.body;
        var state = await Estado.findOne({id: parseInt(data.estado)});
        if(state === null || state === undefined) {
            return res.badRequest("There is no user state in the database.");    
        }

        var updatedUser = await User.updateOne({ id: data.id }).set({
            id_estado_user: state.id
        });        
        if(updatedUser !== null && updatedUser !== undefined) {
            return res.send({ code: "OK", msg: "USER_CHANGE_STATE_SUCCESS" });     
        } else {
            return res.send({ code: "OK", msg: "USER_CHANGE_STATE_ERROR" });
        }    
    },

    delete: async function(req, res, next) {
        User.destroy(req.param('id'), function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.send({ code: "OK", msg: "USER_DELETE_SUCCESS" });
        });
    },

    login: async function(req, res) {
        const data = req.body;
        if (!data.email || !data.password) return res.badRequest('Email and password required');
        var foundedUser = await User.findOne({ email_user: data.email }).populate('id_estado_user');
        if(foundedUser !== null && foundedUser !== undefined) {
            var newToken = jwToken.issue({ id: foundedUser.id });
            User.comparePassword(data.password, foundedUser.password_user)
                .then(() => {
                    //console.log('estado del usuario: '+ )
                    if(foundedUser.id_estado_user.nombre === 'Inactivo') {  // Inactivo
                        return res.send({ code: "OK", msg: "USER_IS_INACTIVE" });    
                    }
                    return res.send({ token: newToken, email: foundedUser.email_user, type: foundedUser.id_roll_user.id});
                })
                .catch((err) => {
                    // Compare with temporal password
                    User.comparePassword(data.password, foundedUser.password_user_temp)
                    .then(() => {
                        if(foundedUser.id_estado_user.nombre === 'Inactivo') {  // Inactivo
                            return res.send({ code: "OK", msg: "USER_IS_INACTIVE" });    
                        }
                        return res.send({ token: newToken, email: foundedUser.email_user, type: foundedUser.id_roll_user.id});
                    })
                    .catch((err) => {
                        res.send({ code: "ERROR", msg: "ERROR_MISMATCH_PASSWORD" });
                    });
                });
            // Change token
            await User.updateOne({ email_user: foundedUser.email_user }).set({token: newToken});    
        } else {
            res.send({ code: "OK", msg: "USER_NOT_FOUND" });
        }
    },

    forgotPassword: async function(req, res) { //enviando nueva contraseña al correo del usuario
        //generar nueva contraseña
        var password = generator.generate({
            length: 10,
            numbers: true,
            lowercase: true,
            uppercase: true
        });

        const data = req.body;
        var existUser = await User.findOne({ email_user: data.email });
        if(existUser !== null && existUser !== undefined) {
            // Set new password encriptado
            var newPassword = await User.generatePassword(password);
            if(newPassword !== null && newPassword !== "ERROR") {
                var updatedUser = await User.updateOne({email_user: existUser.email_user})
                    .set({password_user_temp: newPassword});
                //enviar correo con el nuevo password
                if(updatedUser) {
                    Mailer.sendForgotPasswordMail(updatedUser.email_user, password, res);    
                } else {
                    await User.updateOne({email_user: existUser.email_user})
                        .set({password_user_temp: existUser.password_user_temp});
                    res.send({ code: "ERROR", msg: "ERROR_CHANGE_PASSWORD" });     
                } 
            } else {
                res.send({ code: "ERROR", msg: "ERROR_CREATE_PASSWORD" }); 
            }
        } else {
            res.send({ code: "OK", msg: "USER_NOT_FOUND" });    
        }
    },

    forgot: async function(req, res) {  //envía por correo el link de restauracion
        const data = req.body;
        var existUser = await User.findOne({ email_user: data.email });
        if(existUser === null || existUser === undefined) {
            return res.badRequest("No account with that email address exists.");    
        } 
        var token = jwToken.issue({ id: existUser.id });
       
        exitUser = await  User.updateOne({ email_user: data.email })
            .set({
               token: token,               
            }); 
        if(exitUser) {
            var link = data.link + '/reset?token='+token;
            Mailer.sendPasswordToken(exitUser.email_user, link, res);    
        } else {
            return res.serverError("Something went wrong");
        }
    },

    reset: async function(req, res) {  //comprueba token de restauración de contraseña
        jwToken.verify(req.param('token'), function (err, token) {
            if (err) {
              return res.send({ code: "401", msg: "TOKEN_INVALID" });
            }             
        });  
        var user = await User.findOne({ token: req.param('token') });
            if(user !== null && user !== undefined) {
                res.send({ code: "OK", msg: "TOKEN_VALID" });   
            } else {
                res.send({ code: "401", msg: "TOKEN_INVALID" });   
            }         
    },


    resetPassword: async function(req, res) { //restaura contraseña por token de restauración de contraseña
        const data = req.body;
        jwToken.verify(req.param('token'), function (err, token) {
            if (err) {
              return res.send({ code: "401", msg: "TOKEN_INVALID" });
            }             
        });    
        var user = await User.findOne({ token: req.param('token') });
        if(user !== null && user !== undefined) {
            var newPassword = await User.generatePassword(data.password);
            user = await  User.updateOne({ email_user: user.email_user })
                .set({
                    password_user: newPassword,
                    token: '',                    
                }); 
            if(user) {
                return res.send({ code: "OK", msg: "CHANGE_PASSWORD_SUCCESS" })    
            } else {
                return res.send({ code: "ERROR", msg: "ERROR_CHANGE_PASSWORD" });
            }  
        } else {
            res.send({ code: "ERR", msg: "USER_NOT_FOUND" });   
        }

    },

    changePassword: async function(req, res) {
        const data = req.body;
        token = req.headers.authorization;
        var foundedUser = await User.findOne({ token: token.replace("Bearer ", "")});
        if(foundedUser) {
            //Set new password
            var newPassword = await User.generatePassword(data.password);
            if(newPassword !== null && newPassword !== "ERROR") {
                var updatedUser = await User.updateOne({ email_user: foundedUser.email_user })
                    .set({password_user: newPassword, password_user_temp: ""});
                if(updatedUser) {
                    return res.send({ code: "OK", msg: "CHANGE_PASSWORD_SUCCESS" })   
                } else {
                    return res.send({ code: "ERROR", msg: "ERROR_CHANGE_PASSWORD" });     
                }
            } else {
                return res.send({ code: "ERROR", msg: "ERROR_CREATE_PASSWORD" }); 
            }
        } else {
            return res.send({ code: "OK", msg: "USER_NOT_FOUND" });    
        }

    },
  

};

