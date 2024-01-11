import { model, Schema, models } from 'mongoose';

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    purchasePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    ean: [{ type: String }],
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    active: { type: String, required: true },
}, { timestamps: true });

export const Product = models?.Product || model('Product', ProductSchema);