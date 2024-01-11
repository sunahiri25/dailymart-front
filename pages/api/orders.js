import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed' })
        return;
    }
    const { email } = req.query;
    const orderInfo = await Order.find({ email });
    res.json(orderInfo);
}