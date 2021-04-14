/**
 * MailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    send_email:async function(req, res) {
        const data = req.body;
        var notificacion = {
            email: data.email,
            msg: data.msg,
        };
        Mailer.sendNotificacionMail(notificacion, res);
    }

};