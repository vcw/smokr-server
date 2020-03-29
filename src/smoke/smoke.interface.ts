import { Document } from 'mongoose';

interface ISmoke extends Document {
  userId: string;
  date: string;
}

export default ISmoke;