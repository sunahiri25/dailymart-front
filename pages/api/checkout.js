import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Discount } from "@/models/Discount";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Stock } from "@/models/Stock";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.json({ message: 'Only POST requests allowed' })
        return;
    }

    const { name, phone, email, city, district, ward, address, paymentMethod, total, processing, cart, shippingFee, store, } = req.body;
    await mongooseConnect();
    const productsIds = cart;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({ _id: uniqueIds });
    const discounts = await Discount.find({});

    let line_items = [];
    let addVatLineItems = [];
    for (const productId of uniqueIds) {
        const info = productsInfos.find(item => item._id.toString() === productId);
        const quantity = productsIds.filter(item => item === productId)?.length || 0;
        await Stock.updateOne({ product: productId, store }, { $inc: { quantity: -quantity } });
        const discount = discounts.find(item => item.category.toString() === info.category.toString());
        const category = await Category.findOne({ _id: info.category });
        const taxRate = await stripe.taxRates.create({
            display_name: 'VAT ' + info.title,
            inclusive: false,
            percentage: category.vat,
        });
        if (quantity > 0 && info) {
            if (discount && (new Date(discount.start) - new Date() < 0) && (new Date(discount.end) - new Date() > 0)) {
                if (discount.unit === '%') {
                    const maxDiscount = info.retailPrice * discount.value / 100 > discount.max ? discount.max : info.retailPrice * discount.value / 100;
                    line_items.push({
                        quantity,
                        price_data: {
                            currency: 'vnd',
                            product_data: {
                                name: info.title,
                            },
                            unit_amount: info.retailPrice - maxDiscount,
                        },
                        tax_rates: [taxRate.id],
                    });
                    addVatLineItems.push({
                        quantity,
                        price_data: {
                            currency: 'vnd',
                            product_data: {
                                name: info.title,
                                id: info._id.toString(),
                            },
                            unit_amount: info.retailPrice - maxDiscount,
                            vat: category.vat * (info.retailPrice - maxDiscount) / 100,
                        },
                    });
                } else {
                    line_items.push({
                        quantity,
                        price_data: {
                            currency: 'vnd',
                            product_data: {
                                name: info.title,
                            },
                            unit_amount: info.retailPrice - discount.value,

                        },
                        tax_rates: [taxRate.id],
                    });
                    addVatLineItems.push({
                        quantity,
                        price_data: {
                            currency: 'vnd',
                            product_data: {
                                name: info.title,
                                id: info._id.toString(),
                            },
                            unit_amount: info.retailPrice - discount.value,
                            vat: category.vat * (info.retailPrice - discount.value) / 100,
                        },
                    });
                }
            } else {
                line_items.push({
                    quantity,
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: info.title,
                        },
                        unit_amount: info.retailPrice,
                    },
                    tax_rates: [taxRate.id],
                });
                addVatLineItems.push({
                    quantity,
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: info.title,
                            id: info._id.toString(),
                        },
                        unit_amount: info.retailPrice,
                        vat: info.retailPrice * category.vat / 100,
                    },
                });
            }
        }

    }
    line_items.push({
        quantity: 1,
        price_data: {
            currency: 'vnd',
            product_data: {
                name: 'Phí vận chuyển',
            },
            unit_amount: shippingFee,
        },
    });
    addVatLineItems.push({
        quantity: 1,
        price_data: {
            currency: 'vnd',
            product_data: {
                name: 'Phí vận chuyển',
            },
            unit_amount: shippingFee,
        },
    });
    const orderDoc = await Order.create({
        line_items: addVatLineItems,
        name,
        phone,
        email,
        city,
        district,
        ward,
        address,
        paid: false,
        paymentMethod,
        total,
        processing,
        store,
    });

    if (paymentMethod === 'credit_card') {
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: process.env.PUBLIC_URL + '/cart?success=1',
            cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
            metadata: {
                orderId: orderDoc._id.toString(),
            },
        });

        res.json({
            url: session.url,
        });
    } else {
        res.json({
            url: process.env.PUBLIC_URL + '/cart?success=1',
        });
    };
}
