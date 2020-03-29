import { Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  name: string;
}

export default IUser;