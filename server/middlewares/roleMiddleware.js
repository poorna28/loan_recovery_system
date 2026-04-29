// server/middlewares/roleMiddleware.js

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by authMiddleware after verifying the JWT
    // The JWT already contains the role — tokenManager puts it there
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'No role assigned to this user.'
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required: ${allowedRoles.join(' or ')}. Your role: ${userRole}`
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };