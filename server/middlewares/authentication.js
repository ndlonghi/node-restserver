const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
  let token = req.get('token');
  jwt.verify(token, process.env.SEED, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        ok: false,
        error: {
          message: 'Token inválido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

let verifyAdmin = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role !== 'ADMIN_ROLE') {
    return res.status(403).json({
      ok: false,
      error: {
        message: 'El usuario no es administrador'
      }
    })
  }
  next();
};

let verifyTokenImg = (req, res, next) => {
  let token = req.query.token;
  jwt.verify(token, process.env.SEED, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        ok: false,
        error: {
          message: 'Token inválido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  verifyAdmin,
  verifyToken,
  verifyTokenImg
};