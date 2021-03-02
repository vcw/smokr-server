const admin = require('firebase-admin');
const MissingTokenException = require('../exceptions/missingTokenException');
const WrongTokenException = require('../exceptions/wrongTokenException');

function authMiddleware() {
  return async function (req, res, next) {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length);

      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id = decodedToken.uid;
        
        req.userId = id;
        next();
      } catch (error) {
        console.log(error)
        next(new WrongTokenException());
      }
    } else {
      next(new MissingTokenException());
    }
  }
}

module.exports = authMiddleware;