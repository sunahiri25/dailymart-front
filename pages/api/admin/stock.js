import { mongooseConnect } from "@/lib/mongoose";
import { Stock } from "@/models/Stock";
import { isAdminRequest } from "../auth/[...nextauth]";
import { Store } from "@/models/Store";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res)
    await Product.find({});

    if (method === 'GET') {
        if (req.query?.store) {
            res.json(await Stock.find({ store: req.query?.store }).populate('product').sort({ date: -1 }));
        }
        if (req.query?.id) {
            res.json(await Stock.findOne({ _id: req.query.id }));
        }
    }

    if (method === 'POST') {
        const { store, product, quantity, date } = req.body;
        const s = await Store.find({ $and: [{ store: store }, { product: product._id }] });
        if (s.length > 0) {
            res.status(400).json({ message: 'Stock already exists' });
            return;
        }
        const stockDoc = await Stock.create({
            store,
            product,
            quantity,
            date,
        });
        res.json(stockDoc);
    }

    if (method === 'PUT') {
        const { store, product, quantity, date, _id } = req.body;
        const stockDoc = await Stock.updateOne({ _id }, {
            store,
            product,
            quantity,
            date,
        });
        res.json(stockDoc);
    }
}