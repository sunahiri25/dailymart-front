import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { StoreContext } from "@/components/StoreContext";
import { Category } from "@/models/Category";
import { Discount } from "@/models/Discount";
import { Product } from "@/models/Product";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.3fr .7fr;
  }

margin-top: 40px;
`
const Box = styled.div`
border-radius: 10px;
padding: 20px;
`
export default function Cart({ discounts, allProducts, categories }) {
    const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState('pending');
    const [isSuccess, setIsSuccess] = useState(false);
    const session = useSession();
    const userData = session?.data?.user;
    const { store } = useContext(StoreContext);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        axios.get('/api/profile?email=' + userData?.email).then(res => {
            const data = res.data;
            setEmail(userData?.email);
            if (data) {
                setName(data.name);
                setPhone(data.phone);
                setCity(data.city);
                setDistrict(data.district);
                setWard(data.ward);
                setAddress(data.address);
            }
        })
    }, [userData]);

    useEffect(() => {
        if (cart?.length > 0) {
            axios.post('/api/cart', { ids: cart }).then(res => {
                setCartItems(res.data);
            })
        } else {
            setCartItems([]);
        }
    }, [cart]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, [isSuccess]);

    async function getQuantity(id) {
        let quantity = 0;
        if (store && id) {
            await axios.get('/api/stock?store=' + store._id + '&product=' + id)
                .then(res => {
                    if (res.data) {
                        quantity = res.data.quantity;
                    } else {
                        quantity = 0;
                    };
                })
                .catch(err => console.log(err))

        } else {
            await axios.get('/api/stock?product=' + id)
                .then(res => {
                    if (res.data?.length > 0) {
                        let q = 0;
                        res.data.map(s => {
                            q += s.quantity
                        })
                        quantity = q;
                    } else {
                        quantity = 0;
                    };
                })
                .catch(err => console.log(err))
        }
        return quantity;
    };
    useEffect(() => {
        axios.get('/api/stores').then(res => {
            setStores(res.data);
        })
    }, []);


    async function increaseQuantity(id) {
        const quantity = await getQuantity(id);
        addToCart(id, quantity);
    }
    function decreaseQuantity(id) {
        removeFromCart(id);
    }
    async function goToPayment() {
        if (name === '' || phone === '' || address === '' || city === '' || district === '' || ward === '') {
            return;
        }

        total += shippingFee;
        total += vat;
        const res = await axios.post('/api/checkout', {
            name,
            phone,
            email,
            city,
            district,
            ward,
            address,
            paymentMethod,
            total,
            processing,
            cart,
            shippingFee,
            store: store ? store : stores[0],
        })
        if (res?.data?.url) {
            window.location = res.data.url;
        }
    }

    let total = 0
    let vat = 0
    for (const itemId of cart) {
        const item = cartItems.find(item => item._id === itemId);
        const itemCategory = categories.find(category => category._id === item?.category);
        if (item) {
            const discount = discounts?.find(discount => discount.category === item.category && (new Date(discount.start) - new Date() < 0) && (new Date(discount.end) - new Date() > 0));
            if (discount) {
                if (discount.unit === '%') {
                    const maxDiscount = item.retailPrice * discount.value / 100 > discount.max ? discount.max : item.retailPrice * discount.value / 100;
                    total += item.retailPrice - maxDiscount;
                    vat += (item.retailPrice - maxDiscount) * itemCategory?.vat / 100;
                }
                else {
                    total += item.retailPrice - discount.value;
                    vat += (item.retailPrice - discount.value) * itemCategory?.vat / 100;
                }
            } else {
                total += item.retailPrice;
                vat += item.retailPrice * itemCategory?.vat / 100;
            }

        }
    }
    let shippingFee = total >= 300000 ? 0 : 15000;

    if (isSuccess) {
        return (
            <>
                <Header products={allProducts} />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <div className='bg-white p-6 rounded shadow-lg'>
                                <h1 className="font-bold text-2xl">Thanh toán thành công!</h1>
                                <p className="text-lg mt-4">Cảm ơn bạn đã đặt hàng.</p>
                            </div>
                        </Box>
                    </ColumnsWrapper>
                </Center>
                <Footer fixed />
            </>
        )
    }

    return (
        <>
            <Header products={allProducts} />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        {!cart?.length &&
                            <div className="flex flex-col justify-between items-center gap-3 bg-white py-6 rounded shadow-lg">
                                Không có sản phẩm nào trong giỏ hàng
                                <Link href={'/'} className="text-lg">
                                    <Button>Tiếp tục mua sắm</Button>
                                </Link>
                            </div>
                        }

                        {cartItems?.length > 0 &&
                            <div>
                                <div className="bg-white rounded-lg shadow-lg">
                                    <div className="p-5">
                                        <h2 className="font-bold text-lg mb-2">Giỏ hàng</h2>
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-right text-gray-500">
                                                    <th>Sản phẩm</th>
                                                    <th></th>
                                                    <th>Giá</th>
                                                    <th>Số lượng</th>
                                                    <th>Tổng</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map(item =>
                                                (

                                                    <tr key={item._id} className="border-y text-right">
                                                        <td className="pr-2">
                                                            <Link href={'/products/' + item._id}>
                                                                <img className="w-20" src={item.images[0]} alt={item.title} />
                                                            </Link>
                                                        </td>
                                                        <td className="pr-2 text-left">
                                                            {item.title}
                                                        </td>
                                                        <td className="pr-2">
                                                            {discounts?.find(discount => discount.category === item.category && (new Date(discount.start) - new Date() < 0) && (new Date(discount.end) - new Date() > 0)) && (
                                                                <div>
                                                                    {discounts?.find(discount => discount.category === item.category && discount.unit === '%') && (item.retailPrice * discounts.find(discount => discount.category === item.category && discount.unit === '%').value / 100 < discounts.find(discount => discount.category === item.category && discount.unit === '%').max) && (
                                                                        <div className="text-red-500 font-bold">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice * (1 - discounts.find(discount => discount.category === item.category && discount.unit === '%').value / 100))}
                                                                        </div>
                                                                    )}
                                                                    {discounts?.find(discount => discount.category === item.category && discount.unit === '%') && (item.retailPrice * discounts.find(discount => discount.category === item.category && discount.unit === '%').value / 100 >= discounts.find(discount => discount.category === item.category && discount.unit === '%').max) && (
                                                                        <div className="text-red-500 font-bold">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice - discounts.find(discount => discount.category === item.category && discount.unit === '%').max)}
                                                                        </div>
                                                                    )}
                                                                    {discounts?.find(discount => discount.category === item.category && discount.unit === 'VND') && (
                                                                        <div className="text-red-500 font-bold">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice - discounts.find(discount => discount.category === item.category && discount.unit === 'VND').value)}
                                                                        </div>
                                                                    )}
                                                                    <div className="text-sm text-gray-500 line-through">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice)}
                                                                    </div>
                                                                </div>
                                                            ) ||
                                                                <p className="text-red-500 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice)}</p>
                                                            }
                                                        </td>
                                                        <td className="pr-2 box-border">
                                                            <div className="inline-flex gap-2">
                                                                <button className="text-center px-2 rounded-sm bg-red-200" onClick={() => decreaseQuantity(item._id)}>–</button>
                                                                <span>
                                                                    {cart.filter(id => id === item._id).length}
                                                                </span>
                                                                <button className="text-center px-2 rounded-sm bg-red-200" onClick={() => increaseQuantity(item._id)}>+</button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {discounts?.find(discount => discount.category === item.category && (new Date(discount.start) - new Date() < 0) && (new Date(discount.end) - new Date() > 0)) && (
                                                                <div>
                                                                    {discounts?.find(discount => discount.category === item.category && discount.unit === '%') && (item.retailPrice * discounts.find(discount => discount.category === item.category && discount.unit === '%').value / 100 < discounts.find(discount => discount.category === item.category && discount.unit === '%').max) && (
                                                                        <div className="text-red-500 font-bold">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice * (1 - discounts.find(discount => discount.category === item.category && discount.unit === '%').value / 100) * cart.filter(id => id === item._id).length)}
                                                                        </div>
                                                                    )}
                                                                    {discounts?.find(discount => discount.category === item.category && discount.unit === '%') && (item.retailPrice * discounts.find(discount => discount.category === item.category && discount.unit === '%').value / 100 >= discounts.find(discount => discount.category === item.category && discount.unit === '%').max) && (
                                                                        <div className="text-red-500 font-bold">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.retailPrice - discounts.find(discount => discount.category === item.category && discount.unit === '%').max) * cart.filter(id => id === item._id).length)}
                                                                        </div>
                                                                    )}
                                                                    {discounts?.find(discount => discount.category === item.category && discount.unit === 'VND') && (
                                                                        <div className="text-red-500 font-bold">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.retailPrice - discounts.find(discount => discount.category === item.category && discount.unit === 'VND').value) * cart.filter(id => id === item._id).length)}
                                                                        </div>
                                                                    )}

                                                                </div>
                                                            ) ||
                                                                <p className="text-red-500 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.retailPrice * cart.filter(id => id === item._id).length)}</p>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr >
                                                    <td colSpan="5" className="text-red-500 font-bold text-right pt-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3" className="text-right pt-4">Phí vận chuyển</td>
                                                    <td colSpan="2" className="text-red-500 font-bold text-right pt-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3" className="text-right pt-4">Thuế GTGT</td>
                                                    <td colSpan="2" className="text-red-500 font-bold text-right pt-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vat)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3" className="text-right pt-4">Tổng cộng</td>
                                                    <td colSpan="2" className="text-red-500 font-bold text-right pt-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total + shippingFee + vat)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <Button onClick={clearCart}>Xóa giỏ hàng</Button>
                                    </div>

                                </div>

                            </div>

                        }

                    </Box>
                    {!!cart?.length &&
                        <Box>
                            <form onSubmit={e => e.preventDefault()}>
                                <div className="bg-white rounded-lg shadow-lg">
                                    <div className="p-5">
                                        <h2 className="font-bold text-lg mb-2">Thông tin đơn hàng</h2>
                                        <label>Họ tên người nhận</label>
                                        <input type="text" placeholder="Họ và tên" className="border-2 border-gray-200 rounded px-3 py-2 w-full mb-2 "
                                            value={name} onChange={e => setName(e.target.value)} name='name' required />
                                        <label>Số điện thoại</label>
                                        <input type="text" placeholder="Số điện thoại" className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-2  "
                                            value={phone} onChange={e => setPhone(e.target.value)} name='phone' required />
                                        <label>Email</label>
                                        <input type="email" placeholder="Email" className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-2  "
                                            name='email' value={email} onChange={e => setEmail(e.target.value)} disabled={userData} required />
                                        <label>Tỉnh/Thành phố</label>
                                        <input type="text" placeholder="Tỉnh/Thành phố" className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-2 "
                                            name='city' value={city} onChange={e => setCity(e.target.value)} required />
                                        <div className="flex gap-2 items-center">
                                            <div>
                                                <label>Quận</label>
                                                <input type="text" placeholder="Quận/Huyện" className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-2 "
                                                    name='district' value={district} onChange={e => setDistrict(e.target.value)} required />

                                            </div>
                                            <div>
                                                <label>Phường</label>
                                                <input type="text" placeholder="Phường/Xã" className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-2 "
                                                    name='ward' value={ward} onChange={e => setWard(e.target.value)} required />
                                            </div>
                                        </div>
                                        <label>Địa chỉ</label>
                                        <input type="text" placeholder="Địa chỉ" className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-4 "
                                            value={address} onChange={e => setAddress(e.target.value)} name='address' required
                                        />
                                        <label>Phương thức thanh toán</label>
                                        <select className=" border-2 border-gray-200 rounded px-3 py-2 w-full mb-4 "
                                            name='paymentMethod' value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                            <option value="cash">Thanh toán khi nhận hàng</option>
                                            <option value="credit_card">Thanh toán online</option>
                                        </select>
                                        <input type="hidden" name="shippingFee" value={shippingFee} />
                                        <Button block onClick={goToPayment}>Thanh toán</Button>
                                    </div>
                                </div>
                            </form>
                        </Box>
                    }
                </ColumnsWrapper>
            </Center>
            {!cart?.length > 0 &&
                <Footer fixed />}
            {cart?.length > 0 &&
                <Footer />
            }
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    const discounts = await Discount.find({});
    const allProducts = await Product.find({}, null, { sort: { 'title': -1 } })
    const categories = await Category.find({}, null);

    return {
        props: {
            session,
            discounts: JSON.parse(JSON.stringify(discounts)),
            allProducts: JSON.parse(JSON.stringify(allProducts)),
            categories: JSON.parse(JSON.stringify(categories)),
        }
    }

}