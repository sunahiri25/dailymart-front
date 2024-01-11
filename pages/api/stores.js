import { mongooseConnect } from "@/lib/mongoose";
import { Store } from "@/models/Store";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed' })
        return;
    }

    const storeInfo = await Store.find({});
    res.json(storeInfo);
}