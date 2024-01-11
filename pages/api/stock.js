import { mongooseConnect } from "@/lib/mongoose";
import { Stock } from "@/models/Stock";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed' })
        return;
    }

    if (req.query?.store && req.query?.product) {
        res.json(await Stock.findOne({ store: req.query.store, product: req.query.product }))
    } else {

        res.json(await Stock.find({ product: req.query.product }));

    }

}