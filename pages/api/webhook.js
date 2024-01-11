import { mongooseConnect } from "@/lib/mongoose";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { buffer } from 'micro';
import { Order } from "@/models/Order";

const endpointSecret = process.env.endpointSecret = 'whsec_c99249d1dad1e4fbf51005c8039fdb7bc685e8f1bd218216accbf4715ea424b4';

export default async function handler(req, res) {
    await mongooseConnect();
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            const orderId = data.metadata.orderId;
            const paid = data.payment_status === 'paid';
            if (orderId && paid) {
                await Order.findByIdAndUpdate(orderId, {
                    paid: true,
                })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('ok');
}

export const config = {
    api: { bodyParser: false, }
};

// rapid-tender-zenith-galore
// acct_1ORdA4KFWgI04nkD