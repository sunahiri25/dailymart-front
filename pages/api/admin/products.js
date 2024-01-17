import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '../auth/[...nextauth]';
import { Product } from '@/models/Product';

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find({}).sort({ title: 1 }));
        }

    }

    if (method === 'POST') {
        const { title, description, purchasePrice, retailPrice, images, category, ean, brand, active } = req.body;
        const productDoc = await Product.create({
            title,
            description,
            purchasePrice,
            retailPrice,
            images,
            category,
            ean,
            brand,
            active,
        });
        res.json(productDoc);
    }
    if (method === 'PUT') {
        const { title, description, purchasePrice, retailPrice, images, category, ean, brand, active, _id } = req.body;
        await Product.updateOne({ _id }, { title, description, purchasePrice, retailPrice, images, category, ean, brand, active });
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}