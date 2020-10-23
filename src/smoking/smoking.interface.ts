import { Document } from 'mongoose';

interface ISmoking extends Document {
  // _id: string;
  userId: string;
  timestamp: number;
}

export default ISmoking;