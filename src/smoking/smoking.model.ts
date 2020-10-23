import { Schema, Types, model } from 'mongoose';
import ISmoking from './smoking.interface';

const smokingSchema = new Schema({
  // _id: { type: Types.ObjectId, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Number, required: true }
});

const smokingModel = model<ISmoking>('Smoking', smokingSchema);

export default smokingModel;