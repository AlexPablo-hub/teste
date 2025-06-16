const admin = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de autorização não fornecido' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture
    };
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error.message);
    return res.status(401).json({ 
      error: 'Token inválido ou expirado' 
    });
  }
};

module.exports = authMiddleware;