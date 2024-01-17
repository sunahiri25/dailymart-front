import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isStaffRequest } from "../auth/[...nextauth]";
import { Stock } from "@/models/Stock";

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isStaffRequest(req, res)
    if (method === 'GET') {
        if (req.query?.store) {
            res.json(await Order.find({ store: req.query.store }).sort({ createdAt: -1 }));
        } else if (req.query?.id) {
            res.json(await Order.findOne({ _id: req.query.id }))
        }
        else {
            res.json(await Order.find({}).sort({ createdAt: -1 }));
        }
    }
    if (method === 'POST') {
        const { name, email, phone, paymentMethod, total, line_items, store } = req.body;
        const orderDoc = await Order.create({
            name, email, phone, paymentMethod, total, line_items, store,
            processing: 'finished',
            paid: true,
        });
        (line_items.map(async (item) => {
            const stockDoc = await Stock.findOne({ product: item.price_data.product_data.id, store });
            if (stockDoc) {
                await Stock.updateOne({ _id: stockDoc._id }, { quantity: stockDoc.quantity - item.quantity });
            }
        }));
        res.json(orderDoc);
    }
    if (method === 'PUT') {
        const { id, paid, processing } = req.body;
        const orderDoc = await Order.updateOne({ _id: id }, { paid, processing });
        res.json(orderDoc);
    }
}