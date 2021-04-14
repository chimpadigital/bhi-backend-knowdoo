
module.exports = async function isAuthorized(req, res, next) {
  var tokenR;
  if (req.headers && req.headers.authorization) {
    tokenR = req.headers.authorization;
    if (tokenR.length <= 0) return res.json(401, {err: 'Format is Authorization: Bearer [token]'});

  } else {
      return res.status("401").json({err: 'No Authorization header was found'});
  } 

  jwToken.verify(tokenR.replace("Bearer ", ""), function (err, token) {
    if (err) {
      return res.send({ code: "401", msg: "TOKEN_INVALID" });
    } 
    req.token = token; // This is the decrypted token or the payload you provided
    next();
  });

};