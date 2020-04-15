import { Document } from 'mongoose';

interface ISmoke extends Document {
  userId: string;
  date: Date;
}

export default ISmoke;