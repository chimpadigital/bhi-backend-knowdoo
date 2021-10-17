//var path = require('path');
module.exports = {
    sendNotificacionMail: async function(obj,  res) {   
        sails.hooks.email.send("notificacionEmail", 
            {
                msg: obj.msg,                
            },
            {
                to: obj.email,
                subject: 'BHI Viajes'
            },
            async function(err) {
                if(err) {
                    res.send({ code: "403", msg: "ERROR_SEND_MAIL" });  
                } else {
                  res.send({ code: "200", msg: "SEND_MAIL_SUCCESS" });
                }
            }
        )
        
    },

    sendNotificacionMailReservacion:async function(obj){
        sails.hooks.email.send("notificacionEmail2", 
            {
                msg: obj.msg,                
            },
            {
                to: obj.email,
                subject: 'BHI Viajes'
            },
            async function(err) {
                if(err) {
                     res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                 }else{
                    sails.hooks.email.send("notificacionEmail2", 
                    {
                        msg: obj.msg,                
                    },
                    {
                        to: "bhiviajesturismo@gmail.com",
                        subject: 'BHI Viajes'
                    },
                    async function(err) {
                         if(err) {
                             res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                         }else{
                            sails.hooks.email.send("notificacionEmail2", 
                            {
                                msg: obj.msg,                
                            },
                            {
                                to: "info@bhiviajes.com.ar",
                                subject: 'BHI Viajes'
                            },
                            async function(err) {
                                /* if(err) {
                                     res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                                 } */
                             }
                            
                            )
                         }
                     }
                    
                    )
                 }
             }
            
        )
    },

    sendNotificacionMailAdminUser: async function(obj,  res) {        
        sails.hooks.email.send("notificacionEmail", 
            {
                msg: obj.msgUser,                
            },
            {
                to: obj.emailUser,
                subject: 'BHI Viajes'
            },
            async function(err) {
                if(err) {
                    res.send({ code: "403", msg: "ERROR_SEND_MAIL" });  
                } else {
                    sails.hooks.email.send("notificacionEmail", 
                        {
                            msg: obj.msgAdmin,                
                        },
                        {
                            to: obj.emailAdmin,
                            subject: 'BHI Viajes'
                        },
                        async function(err) {
                            if(err) {
                                res.send({ code: "403", msg: "ERROR_SEND_MAIL" });  
                            } else {
                                res.send({ code: "200", msg: "SEND_MAIL_SUCCESS" });
                            }
                        }
                    )
                }
            }
        )
        
    },

    sendNotificacionMailAll: async function(obj,  res) {
        sails.hooks.email.send("notificacionEmail", 
            {
                msg: obj.msg,                
            },
            {
                bcc: obj.email,
                subject: 'BHI Viajes'
            },
            async function(err) {
               /* if(err) {
                    res.send({ code: "ERROR", msg: "ERROR_SEND_MAIL" });  
                } */
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
                subject: 'BHI Viajes'
            },
            async function(err) {
                if(err) {
                    res.send({ code: "403", msg: "ERROR_SEND_MAIL" });  
                } else {
                  res.send({ code: "200", msg: "SEND_MAIL_SUCCESS" });
                }
            }
        )
    },

    sendPasswordToken: async function(username, link, res) {
        //var assetsPath=path.resolve(sails.config.appPath, 'assets');
        //assetsPath=assetsPath.replace(new RegExp(/\\/g),'/');
        sails.hooks.email.send("tokenPassword", 
            {
                User: username,
                Pass: link,                         
            }, 
            {
                to: username,
                subject: 'BHI Viajes',
                /*attachments: [{                    
                    filename: 'bhi.png',
                    path: assetsPath+'/images/headerPlantilla.png',                    
                    cid: 'unique@head.bhi',                    
              }],*/
            },
            async function(err) {
                if(err) {
                    res.send({ code: "403", msg: "ERROR_SEND_MAIL" });  
                } else {
                    res.send({ code: "200", msg: "SEND_MAIL_SUCCESS" });
                }
            }
        )
    }
}