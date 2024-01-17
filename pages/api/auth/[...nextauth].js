import bcrypt from "bcrypt";
import { User } from '@/models/User';
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { mongooseConnect } from "@/lib/mongoose";
import { UserInfo } from "@/models/UserInfo";

export const authOptions = {
    secret: process.env.SECRET,
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: 'my-credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;
                await mongooseConnect();
                const user = await User.findOne({ email });
                const passwordOk = user && bcrypt.compareSync(password, user.password);
                if (passwordOk) {
                    return user;
                };
                return null;
            },
        },
        ),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.role === 'admin') token.role = user.role;
            if (user?.role === 'staff') token.role = user.role;
            return token;
        },

        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            session.accessToken = token.accessToken;
            session.role = token.role;
            return session;
        },
        async signIn({ account, profile, credentials, session }) {
            return true;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },

    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.SECRET,
        encryption: true,
    },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions)
    await mongooseConnect();
    const userInfo = await UserInfo.findOne({ email: session?.user?.email });
    if (userInfo?.role !== 'admin') {
        res.status(401);
        res.end();
        throw new Error('Unauthorized');
    }
};

export async function isStaffRequest(req, res) {
    const session = await getServerSession(req, res, authOptions)
    await mongooseConnect();
    const userInfo = await UserInfo.findOne({ email: session?.user?.email });
    if (userInfo?.role !== 'staff') {
        res.status(401);
        res.end()
        throw new Error('Unauthorized');
    }
};
