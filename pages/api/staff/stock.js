import { mongooseConnect } from "@/lib/mongoose";
import { Stock } from "@/models/Stock";
import { isStaffRequest } from "../auth/[...nextauth]";
import { Store } from "@/models/Store";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isStaffRequest(req, res)

    if (method !== 'GET') {
        res.status(405).end(`Method ${method} Not Allowed`)
        return;
    }
    await Product.find({});
    if (req.query?.store) {
        res.json(await Stock.find({ store: req.query?.store }).populate('product').sort({ date: -1 }));
    }
    if (req.query?.id) {
        res.json(await Stock.findOne({ _id: req.query.id }));
    }

}