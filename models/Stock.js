import mongoose, { model, models, Schema } from "mongoose";

const StockSchema = new Schema({
    store: { type: mongoose.Types.ObjectId, ref: 'Store' },
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    date: { type: Date },
});

export const Stock = models?.Stock || model('Stock', StockSchema);