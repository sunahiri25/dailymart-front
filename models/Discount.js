import mongoose, { model, models, Schema } from "mongoose";

const DiscountSchema = new Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    max: { type: Number, required: true },
});

export const Discount = models?.Discount || model('Discount', DiscountSchema);
