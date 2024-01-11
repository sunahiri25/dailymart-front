import { mongooseConnect } from "@/lib/mongoose";
import { Discount } from "@/models/Discount";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed' })
        return;
    }
    const { name, category } = req.query;
    if (!name && !category) {
        const discountInfo = await Discount.find({});
        res.json(discountInfo);
        return;
    }
    if (name) {
        const discountInfo = await Discount.findOne({ name });
        res.json(discountInfo);
        return;
    }
    if (category) {
        const discountInfo = await Discount.findOne({ category });
        res.json(discountInfo);
        return;
    }
}