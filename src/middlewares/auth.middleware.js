const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.profile !== "ADMIN") {
    return res.redirect("/users");
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};