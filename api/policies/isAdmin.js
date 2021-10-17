'use strict';

module.exports = async function isAdmin(req, res, next)  {
  var token;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization;
    if (token.length <= 0) return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
  } else {
    return res.status("401").json({err: 'No Authorization header was found'});
  } 
  var user = await User.findOne({token: token.replace("Bearer ", "")});
  if(user !== null && user !== undefined) {
    if(user.id_roll_user === 1) {
      next(); 
    } else {
      return res.send({ code: "401", msg: "ACTION_IS_NOT_ALLOW" });  
    }
  } else {
    return res.send({ code: "401", msg: 'TOKEN_IS_NOT_FOUND' });
  }
};