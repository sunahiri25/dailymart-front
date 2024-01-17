import { mongooseConnect } from '@/lib/mongoose';
import { Discount } from '@/models/Discount';
import { isStaffRequest } from '../auth/[...nextauth]';
import { Category } from '@/models/Category';

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isStaffRequest(req, res)
    if (method !== 'GET') {
        res.status(405).end(`Method ${method} Not Allowed`)
        return;
    }
    await Category.find({});
    if (req.query?.id) {
        res.json(await Discount.findOne({ _id: req.query.id }));
    } else {
        res.json(await Discount.find({}).populate('category').sort({ name: 1 }));
    }
}