import jwt from 'jsonwebtoken';
import IUser from '../user/user.interface';
import ITokenData from './tokenData.interface';
import IDataStoredInToken from './dataStoredInToken.interface';

class AuthService {
  constructor(private secret: string) {}

  createToken(user: IUser) {
    const expiresIn = 60 * 60 * 24;
    const userData: IDataStoredInToken = {
      _id: user._id
    }
    const tokenData: ITokenData = {
      expiresIn,
      token: jwt.sign(userData, this.secret, { expiresIn })
    };

    return tokenData;
  }

  createCookie(tokenData: ITokenData) {
    return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}`
  }
}

export default AuthService;