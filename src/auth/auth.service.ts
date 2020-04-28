import jwt from 'jsonwebtoken';
import IUser from '../user/user.interface';
import IDataStoredInToken from './dataStoredInToken.interface';

class AuthService {
  constructor(private secret: string) {}

  createToken(user: IUser) {
    const expiresIn = 60 * 60 * 24;
    const userData: IDataStoredInToken = {
      _id: user._id
    }

    return jwt.sign(userData, this.secret, { expiresIn });
  }
}

export default AuthService;