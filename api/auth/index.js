function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  }
  return next();
}
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    let err = new Error("You must be logged in.");
    err.status = 401;
    err.msg = "You must be logged in.";
    return res.json({error: err});
  }
}
function logOut(req, res, next) {
  if (req.session && req.session.userId) {
    req.session.destroy();
  }
  return next();
}
module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.logOut = logOut;
