module.exports = {
    sendNotificacionMail: async function(obj,  res) {
        sails.hooks.email.send("notificacionEmail", 
            {
                msg: obj.msg,                
            },
            {
                to: obj.email,
                subject: 'BIH Viajes'
            },
            async function(err) {
                if(err) {
                    res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                } else {
                  res.send({ code: "OK", msg: "SEND_MAIL_SUCCESS" });
                }
            }
        )
        
    },

    sendForgotPasswordMail: async function(username, pass, res) {
        sails.hooks.email.send("changePassword", 
            {
                User: username,
                Pass: pass
            },
            {
                to: username,
                subject: 'BIH Viajes'
            },
            async function(err) {
                if(err) {
                    res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                } else {
                  res.send({ code: "OK", msg: "SEND_MAIL_SUCCESS" });
                }
            }
        )
    },

    sendPasswordToken: async function(username, link, res) {
        sails.hooks.email.send("tokenPassword", 
            {
                User: username,
                Pass: link,
            },
            {
                to: username,
                subject: 'BIH Viajes'
            },
            async function(err) {
                if(err) {
                    res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                } else {
                  res.send({ code: "OK", msg: "SEND_MAIL_SUCCESS" });
                }
            }
        )
    }
}