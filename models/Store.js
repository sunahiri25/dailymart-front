import mongoose, { model, models, Schema } from "mongoose";

const StoreSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    manager: { type: mongoose.Types.ObjectId, ref: 'User' },
});

export const Store = models?.Store || model('Store', StoreSchema);