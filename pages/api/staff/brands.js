import { mongooseConnect } from "@/lib/mongoose";
import { Brand } from "@/models/Brand";
import { isStaffRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isStaffRequest(req, res)


    if (method !== 'GET') {
        res.status(405).end(`Method ${method} Not Allowed`)
        return;
    }
    if (req.query?.id) {
        res.json(await Brand.findOne({ _id: req.query.id }));
    } else {
        res.json(await Brand.find({}).sort({ name: 1 }));
    }

}
