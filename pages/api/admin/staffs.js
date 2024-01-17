import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '../auth/[...nextauth]';
import { UserInfo } from '@/models/UserInfo';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import { Staff } from '@/models/Staff';

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)
    await User.find({});
    
    if (method === 'GET') {
        if (req.query?.id) {
            const staffInfo = await Staff.findOne({ _id: req.query.id }).populate('account');
            const userInfo = await UserInfo.findOne({ email: staffInfo.email });
            const user = await User.findOne({ email: userInfo.email });
            res.json({ ...staffInfo.toJSON(), password: user.password });
        } else {
            const staffs = await Staff.find({ store: req.query.store }).sort({ name: 1 });
            res.json(staffs);
        }

    }

    if (method === 'POST') {
        const { name, email, password, birthDay, address, gender, salary, phone, store, manager } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            await UserInfo.create({
                name,
                email,
                role: 'staff',
                phone,
            });
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const newUser = await User.create({
                email,
                password: hashPassword,
            });
            const staffDoc = await Staff.create({
                name,
                email,
                birthDay,
                address,
                gender,
                salary,
                phone,
                store,
                manager,
                account: newUser._id,
            });
            res.json(staffDoc);
        } else {
            await UserInfo.updateOne({ email }, { role: 'staff' });
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            await User.updateOne({ email }, { password: hashPassword })
            const staffDoc = await Staff.create({
                name,
                email,
                birthDay,
                address,
                gender,
                salary,
                phone,
                store,
                manager,
                account: user._id,
            });
            res.json(staffDoc);
        };
    }
    if (method === 'PUT') {
        const { name, email, password, birthDay, address, gender, salary, store, manager, phone, _id } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const staffInfo = await Staff.findById(_id);
        await UserInfo.updateOne({ email: staffInfo.email }, { email, name, phone });
        await User.updateOne({ email: staffInfo.email }, { email, password: hashPassword });
        const newAccount = await User.findOne({ email });
        await Staff.updateOne({ _id }, { name, email, birthDay, address, gender, salary, store, manager, phone, account: newAccount._id })
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            const staffInfo = await Staff.findById(req.query.id);
            await Staff.deleteOne({ _id: req.query?.id });
            await UserInfo.updateOne({ email: staffInfo.email }, { role: 'customer' });
            res.json(true);
        }
    }
}