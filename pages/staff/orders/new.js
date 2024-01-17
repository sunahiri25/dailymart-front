import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Select from 'react-select';
import LayoutStaff from "@/components/LayoutStaff";

export default function NewOrder() {
    const [goToOrder, setGoToOrder] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [total, setTotal] = useState(0);
    const [line_items, setLineItems] = useState([{ price_data: { product_data: { name: '', id: '' }, unit_amount: 0, vat: 0 }, quantity: 1 }]);
    const [store, setStore] = useState('');
    const router = useRouter();
    const session = useSession();
    const [stock, setStock] = useState([]);
    const [optionListProduct, setOptionListProduct] = useState([]);
    const [discount, setDiscount] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/api/staff/staffs?email=' + session?.data?.user?.email).then(res => {
            if (res.data?.store) setStore(res.data.store);
        })
    }, [session]);
    useEffect(() => {
        axios.get('/api/staff/categories').then(res => {
            setCategories(res.data);
        });
    }, []);
    useEffect(() => {
        if (store) axios.get('/api/staff/stock?store=' + store?._id).then(res => {
            setStock(res.data);
            if (res.data.length > 0) {
                const optionList = res.data.map(item => ({ value: item.product._id, label: item.product.title }));
                setOptionListProduct(optionList);
            }
        });
    }, [store]);

    useEffect(() => {
        setTotal(0);
        line_items.forEach(item => {
            setTotal(total => total + (item.price_data.unit_amount + item.price_data.vat) * item.quantity);
        })
    }, [line_items])

    async function saveOrder(e) {
        e.preventDefault();
        const data = { name, phone, email, paymentMethod, total, line_items, store: store._id };
        await axios.post('/api/staff/orders', data);
        toastr.success(`Order created!`, 'Success', { timeOut: 2000 })
        setGoToOrder(true);
    };

    if (goToOrder) {
        router.push('/staff/orders');
    };
    useEffect(() => {
        axios.get('/api/staff/discount').then(res => {
            setDiscount(res.data);
        })
    }, []);
    return (
        <LayoutStaff>
            <h1 className="text-red-700 text-lg">New Order</h1>
            <form onSubmit={saveOrder}>
                <label className="text-red-700">Customer Name</label>
                <input type="text" placeholder="name"
                    value={name} onChange={(e) => setName(e.target.value)} required />
                <label className="text-red-700">Phone</label>
                <input type="text" placeholder="phone"
                    value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <label className="text-red-700">Email</label>
                <input type="text" placeholder="email"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label className="text-red-700">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required >
                    <option value="">Select payment method</option>
                    <option value="cash">Thanh toán bằng tiền mặt</option>
                    <option value="credit_card">Thanh toán bằng Credit Card</option>
                </select>
                <label className='text-lg text-red-700'>Items</label>
                <div>
                    {line_items.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="w-1/2">
                                <label className='text-sm text-gray-600'>Product</label>
                                <Select
                                    options={optionListProduct}
                                    value={optionListProduct.find(option => option.value === item.price_data.product_data.id)}
                                    placeholder='Select product'
                                    onChange={(e) => {
                                        const newLineItems = [...line_items];
                                        newLineItems[index].price_data.product_data.name = e.label;
                                        newLineItems[index].price_data.product_data.id = e.value;
                                        const tempPrice = stock.find(stock => stock.product._id === e.value).product.retailPrice;
                                        const dis = discount.find(discount => discount.category._id === stock.find(stock => stock.product._id === e.value).product.category)
                                        if (dis && (new Date(dis.start) - new Date() < 0) && (new Date(dis.end) - new Date() > 0)) {
                                            if (dis.unit === '%') {
                                                const tempDis = tempPrice * dis.value / 100;
                                                const maxDis = tempDis > dis.max ? dis.max : tempDis;
                                                newLineItems[index].price_data.unit_amount = tempPrice - maxDis;
                                            } else {
                                                newLineItems[index].price_data.unit_amount = tempPrice - dis.value;
                                            }
                                        } else {
                                            newLineItems[index].price_data.unit_amount = tempPrice;
                                        }
                                        const category = categories.find(category => category._id === stock.find(stock => stock.product._id === e.value).product.category);
                                        newLineItems[index].price_data.vat = category.vat * newLineItems[index].price_data.unit_amount / 100;
                                        setLineItems(newLineItems);
                                    }}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className='text-sm text-gray-600'>Price</label>
                                <input type="text" placeholder="price"
                                    value={item.price_data.unit_amount}
                                    disabled className="bg-gray-100" />
                            </div>
                            <div>
                                <label className='text-sm text-gray-600'>VAT</label>
                                <input type="text" placeholder="vat" value={item.price_data.vat} disabled className="bg-gray-100" />
                            </div>
                            <div>
                                <label className='text-sm text-gray-600'>Quantity</label>
                                <input type="number" placeholder="quantity"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const newLineItems = [...line_items];
                                        const tempQuan = stock.find(stock => stock.product._id === item.price_data.product_data.id).quantity;
                                        newLineItems[index].quantity = tempQuan >= e.target.value ? e.target.value : tempQuan;
                                        console.log(tempQuan >= e.target.value)
                                        setLineItems(newLineItems);
                                    }} required />
                            </div>
                            <div>
                                <button type="button" className="bg-gray-700 h-1/2 my-6 text-white px-2 py-1 rounded-md text-sm" onClick={() => {
                                    const newLineItems = [...line_items];
                                    newLineItems.splice(index, 1);
                                    setLineItems(newLineItems);
                                }}>Delete</button>
                            </div>
                        </div>
                    ))}
                    <div className='my-2'>
                        <button className="bg-green-900 p-2 text-white px-2 text-sm rounded-md" type="button" onClick={() => {
                            setLineItems([...line_items, {
                                price_data: { product_data: { name: '', id: '' }, unit_amount: 0, vat: 0 }, quantity: 1
                            }]);
                            console.log(line_items)

                        }}>Add new item
                        </button>
                    </div>
                </div>
                <label className="text-red-700">Total</label>
                <input type="text" placeholder="total"
                    value={total} disabled className="bg-gray-100" required />

                <button type="submit" className="btn-primary">Save</button>
            </form >
        </LayoutStaff>
    )
}