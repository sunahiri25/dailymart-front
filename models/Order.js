import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    phone: String,
    email: String,
    city: String,
    district: String,
    ward: String,
    address: String,
    paid: Boolean,
    paymentMethod: String,
    total: Number,
    processing: String,
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);