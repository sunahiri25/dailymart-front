import { mongooseConnect } from "@/lib/mongoose";
import { UserInfo } from "@/models/UserInfo";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.email) {
            res.json(await UserInfo.findOne({ email: req.query.email }));
        }
    }

    if (method === 'POST') {
        const { name, email, phone, city, district, ward, address } = req.body;
        const userInfo = await UserInfo.create({ name, email, phone, city, district, ward, address });
        res.json('ok');
    }
    if (method === 'PUT') {
        const { _id, name, email, phone, city, district, ward, address } = req.body;
        await UserInfo.updateOne({ _id }, { name, email, phone, city, district, ward, address });
        res.json('ok');
    }
}