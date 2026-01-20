const rolesMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  };
};

module.exports = rolesMiddleware;
