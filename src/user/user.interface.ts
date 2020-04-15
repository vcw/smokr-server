import { Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
}

export default IUser;