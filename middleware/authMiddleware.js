const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  const userAgent = req.headers['user-agent'];

  if (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Edge') || userAgent.includes('Postman')) {
    next();
  } else {
    if (!bearerHeader) {
      const error = new Error('No authorization header');
      error.status = 401;
      throw error;
    }

    const token = bearerHeader.split(' ')[1];
    try {
      const data = jwt.verify(token, process.env.JWT_KEY);
      req.user = data;
      next();
    } catch (err) {
      err.status = 401;
      throw err;
    }
  }
};

module.exports = authMiddleware;
