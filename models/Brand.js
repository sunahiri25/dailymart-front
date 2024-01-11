import { model, models, Schema } from "mongoose";

const BrandSchema = new Schema({
    name: { type: String, required: true },
    active: { type: String },
});

export const Brand = models?.Brand || model('Brand', BrandSchema);