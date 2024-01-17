import { mongooseConnect } from '@/lib/mongoose';
import { isStaffRequest } from '../auth/[...nextauth]';
import { UserInfo } from '@/models/UserInfo';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import { Staff } from '@/models/Staff';
import { Store } from '@/models/Store';

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isStaffRequest(req, res)

    if (method !== 'GET') {
        res.status(405).end(`Method ${method} Not Allowed`)
        return;
    }
    if (req.query?.id) {
        const staffInfo = await Staff.findOne({ _id: req.query.id }).populate('account');
        const userInfo = await UserInfo.findOne({ email: staffInfo.email });
        const user = await User.findOne({ email: userInfo.email });
        res.json({ ...staffInfo.toJSON(), password: user.password });
    }
    if (req.query?.email) {
        await Store.find({});
        res.json(await Staff.findOne({ email: req.query.email }).populate('store'));
    }

}