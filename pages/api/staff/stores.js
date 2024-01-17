import { mongooseConnect } from "@/lib/mongoose";
import { Store } from "@/models/Store";
import { isStaffRequest } from "../auth/[...nextauth]";
import { User } from "@/models/User";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isStaffRequest(req, res)

    if (method !== 'GET') {
        res.status(405).end(`Method ${method} Not Allowed`)
        return;
    }
    await User.find({});
    if (req.query?.id) {
        res.json(await Store.findOne({ _id: req.query.id }).populate('manager'));
    } else {
        res.json(await Store.find({}).populate('manager').sort({ name: 1 }));
    }

}