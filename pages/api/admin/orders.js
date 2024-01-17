import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res)
    if (req.method === 'GET') {
        if (req.query?.store) {
            res.json(await Order.find({ store: req.query.store }).sort({ createdAt: -1 }));
        } else if (req.query?.id) {
            res.json(await Order.findById(req.query.id));
        } else {
            res.json(await Order.find().sort({ createdAt: -1 }));
        }
    }
}