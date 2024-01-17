import { mongooseConnect } from "@/lib/mongoose";
import { Store } from "@/models/Store";
import { isAdminRequest } from "../auth/[...nextauth]";
import { User } from "@/models/User";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res)
    await User.find({});

    if (method === 'GET') {
        if(req.query?.id){
            res.json(await Store.findOne({_id: req.query.id}).populate('manager'));
        } else {
            res.json(await Store.find({}).populate('manager').sort({ name: 1 }));
        }
    }

    if (method === 'POST') {
        const { name, address, phone, manager } = req.body;
        const storeDoc = await Store.create({
            name,
            address,
            phone,
            manager,
        });
        res.json(storeDoc);
    }

    if (method === 'PUT') {
        const { name, address, phone, manager, _id } = req.body;
        const storeDoc = await Store.updateOne({ _id }, {
            name,
            address,
            phone,
            manager,
        });
        res.json(storeDoc);
    }
}