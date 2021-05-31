import { Schema, model, Document } from 'mongoose'

export interface ITodo extends Document {
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
})

export default model<ITodo>('Todo', TodoSchema)