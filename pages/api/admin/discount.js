import { mongooseConnect } from '@/lib/mongoose';
import { Discount } from '@/models/Discount';
import { isAdminRequest } from '../auth/[...nextauth]';
import { Category } from '@/models/Category';

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res);
    await Category.find({});

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Discount.findOne({ _id: req.query.id }));
        } else {
            res.json(await Discount.find({}).populate('category').sort({ name: 1 }));
        }

    };

    if (method === 'POST') {
        const { name, category, value, unit, start, end, max } = req.body;
        const discountDoc = await Discount.create({
            name, category, value, unit, start, end, max,
        });
        res.json(discountDoc);
    }
    if (method === 'PUT') {
        const { name, category, value, unit, start, end, max, _id } = req.body;
        await Discount.updateOne({ _id }, { name, category, value, unit, start, end, max });
        res.json(true);
    };

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Discount.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    };
}