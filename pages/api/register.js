import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    const body = await req.body;
    await mongooseConnect();

    const pass = body.password;
    if (!pass?.length || pass.length < 5) {
        new Error('password must be at least 5 characters');
    }

    const notHashedPassword = pass;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(notHashedPassword, salt);

    const createdUser = await User.create(body);
    return res.json('ok');
}