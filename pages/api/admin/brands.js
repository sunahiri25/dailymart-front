import { mongooseConnect } from "@/lib/mongoose";
import { Brand } from "@/models/Brand";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res)


    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Brand.findOne({ _id: req.query.id }));
        } else {
            res.json(await Brand.find({}).sort({ name: 1 }));
        }

    }

    if (method === 'POST') {
        const { name, active } = req.body;
        const brandDoc = await Brand.create({
            name,
            active,
        });
        res.json(brandDoc);
    }

    if (method === 'PUT') {
        const { name, active, _id } = req.body;
        const brandDoc = await Brand.updateOne({ _id }, {
            name,
            active,
        });
        res.json(brandDoc);
    }

    if (method === 'DELETE') {
        const { _id } = req.query;
        await Brand.deleteOne({ _id });
        res.json('ok');
    }
}
