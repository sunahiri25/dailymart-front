import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res)

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Category.findOne({ _id: req.query.id }).populate('parent'));
        } else {
            res.json(await Category.find({}).populate('parent').sort({ parent: 1 }));
        }
    }

    if (method === 'POST') {
        const { name, parentCategory, vat } = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            vat,
        });
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        const { name, parentCategory, vat, _id } = req.body;
        const categoryDoc = await Category.updateOne({ _id }, {
            name,
            parent: parentCategory || undefined,
            vat,
        });
        res.json(categoryDoc);
    }

    if (method === 'DELETE') {
        const { _id } = req.query;
        await Category.deleteOne({ _id });
        res.json('ok');
    }
}
