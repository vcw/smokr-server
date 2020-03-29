import { Schema, model } from 'mongoose';
import IUser from './user.interface';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const userModel = model<IUser>('User', userSchema);
export default userModel;