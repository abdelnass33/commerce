import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  sizes: string[];
  colors?: string[];
  stock: number;
  sku: string;
  brand?: string;
  tags?: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: [arrayMinLength, 'At least one image is required'],
    },
    sizes: {
      type: [String],
      required: [true, 'At least one size is required'],
    },
    colors: {
      type: [String],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

function arrayMinLength(val: string[]) {
  return val.length > 0;
}

ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
