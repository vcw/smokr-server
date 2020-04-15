import bcrypt, { hash } from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import IController from 'interfaces/controller.interface';
import userModel from '../user/user.model';
import AuthService from './auth.service';
import UserWithThatEmailAlreadyExistsException from '../exceptions/userWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/wrongCredentialsException';

class Auth implements IController {
  public router = Router();
  private authService: AuthService;
  private path = '/api/auth';
  private user = userModel;

  constructor(secret: string) {
    this.authService = new AuthService(secret);

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.register.bind(this));
    this.router.post(`${this.path}/login`, this.login.bind(this));
  }

  private async register(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;
    if ( await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword
      });

      const tokenData = this.authService.createToken(user);
      const cookie = this.authService.createCookie(tokenData);

      res.setHeader('Set-Cookie', cookie);
      res.send({
        ...userData,
        password: undefined
      })
    }
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    const loginData = req.body;
    const user = await this.user.findOne({ email: loginData.email });

    const isCredentialsCorrect = !!user && await bcrypt.compare(loginData.password, user.password)

    if (isCredentialsCorrect) {
      const tokenData = this.authService.createToken(user!);
      const cookie = this.authService.createCookie(tokenData);

      res.setHeader('Set-Cookie', cookie);
      res.send({
        email: user!.email,
        name: user!.name
      });
    } else {
      next(new WrongCredentialsException());
    }

  }
}

export default Auth;
