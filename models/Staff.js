import mongoose, { model, models, Schema } from "mongoose";

const StaffSchema = new Schema({
    name: { type: String },
    birthDay: { type: String },
    gender: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    manager: { type: mongoose.Types.ObjectId, ref: 'User' },
    salary: { type: Number },
    store: { type: mongoose.Types.ObjectId, ref: 'Store' },
    account: { type: mongoose.Types.ObjectId, ref: 'User' },
});

export const Staff = models?.Staff || model('Staff', StaffSchema);