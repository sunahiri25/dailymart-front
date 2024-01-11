import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    address: { type: String },
    role: { type: String, default: 'customer' },
}, { timestamps: true });

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);