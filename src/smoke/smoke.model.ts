import { Schema, Types, model } from 'mongoose';
import ISmoke from './smoke.interface';

const smokeSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }
});

const smokeModel = model<ISmoke>('Smoke', smokeSchema);

export default smokeModel;