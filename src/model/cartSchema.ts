// src/models/cartItem.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './productSchema';
import { IUser } from './userSchema';

export interface ICartItem extends Document {
  user: IUser['_id'];
  product: IProduct['_id'];
  quantity: number;
}

const cartItemSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

export default mongoose.model<ICartItem>('CartItem', cartItemSchema);
