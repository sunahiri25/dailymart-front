import Center from "@/components/Center";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import styled from "styled-components";
import Link from "next/link";
import { Product } from "@/models/Product";
const ColumnsWrapper = styled.div`
display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.7fr 1.3fr;
  }
margin-top: 40px;
`
const Box = styled.div`
border-radius: 10px;
padding: 20px;
`

export default function ProfilePage({ allProducts }) {
    const session = useSession();
    const router = useRouter();
    const status = session?.status;
    const userData = session?.data?.user;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');
    const [_id, setId] = useState('');
    const [orders, setOrders] = useState([]);

    const profileEmail = userData?.email;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        setEmail(profileEmail);
    }, []);
    useEffect(() => {
        axios.get('/api/profile/?email=' + profileEmail).then(response => {
            const data = response.data;
            if (data) {
                setId(data._id);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setCity(data.city);
                setDistrict(data.district);
                setWard(data.ward);
                setAddress(data.address);
            }
        });
        axios.get('/api/orders/?email=' + profileEmail).then(response => {
            const data = response.data;
            if (data) {
                setOrders(data);
            }
        });
    }, []);

    async function saveProfile(e) {
        e.preventDefault();
        const data = { name, email, phone, city, district, ward, address };
        if (_id) {
            await axios.put('/api/profile/', { ...data, _id });
            toastr.success('Cập nhật thông tin thành công', 'Success', { timeOut: 2000 });
        }
        else {
            await axios.post('/api/profile/', data);
            toastr.success('Lưu thông tin thành công', 'Success', { timeOut: 2000 });
        };
    }

    return (
        <>
            <Header products={allProducts} />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-5">
                                <p className="font-bold text-xl">Thông tin tài khoản</p>
                                <form onSubmit={saveProfile}>
                                    <label>Họ tên</label>
                                    <input type="text" value={name} onChange={ev => setName(ev.target.value)} required />
                                    <label>Email</label>
                                    <input type="email" value={email} disabled />
                                    <label>Số điện thoại</label>
                                    <input type="text" value={phone} onChange={ev => setPhone(ev.target.value)} required />
                                    <label>Tỉnh/Thành phố</label>
                                    <input type="text" value={city} onChange={ev => setCity(ev.target.value)} required />
                                    <div className="flex gap-2 items-center">
                                        <div>
                                            <label>Quận/Huyện</label>
                                            <input type="text" value={district} onChange={ev => setDistrict(ev.target.value)} required />
                                        </div>
                                        <div>
                                            <label>Phường/Xã</label>
                                            <input type="text" value={ward} onChange={ev => setWard(ev.target.value)} required />
                                        </div>
                                    </div>
                                    <label>Địa chỉ</label>
                                    <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} required />
                                    <Button type="submit">Lưu</Button>
                                </form>
                            </div>
                        </div>
                    </Box>
                    <Box>
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-5">
                                <p className="font-bold text-xl">Đơn hàng của tôi</p>
                                {orders.length > 0 ? (
                                    <table className="table-auto w-full border">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2">Ngày đặt hàng</th>
                                                <th className="border px-4 py-2 ">Sản phẩm</th>
                                                <th className="border px-4 py-2">Tổng tiền</th>
                                                <th className="border px-4 py-2">Thanh toán</th>
                                                <th className="border px-4 py-2">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="border px-4 py-2">
                                                        {order.address && order.line_items.slice(0, order.line_items.length - 1).map(key => (
                                                            <p key={key}>
                                                                {key.price_data.product_data?.name} <b>x{key.quantity}</b>
                                                            </p>
                                                        ))}
                                                        {!order.address && order.line_items.map(key => (
                                                            <p key={key}>
                                                                {key.price_data.product_data?.name} <b>x{key.quantity}</b>
                                                            </p>
                                                        ))}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                                                    </td>
                                                    <td className="border px-4 py-2">{order.paid === true ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                                    <td className="border px-4 py-2">{order.processing === 'pending' ? 'Đang chuẩn bị' : 'Đang giao hàng'}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>
                                        <p className="my-4">Chưa có đơn hàng nào</p>
                                        <Link href={'/'}><Button white>Tiếp tục mua hàng</Button></Link>
                                    </div>
                                )}

                            </div>
                        </div>
                    </Box>
                </ColumnsWrapper>
            </Center >
            <Footer />
        </>
    );

}
export async function getServerSideProps(context) {
    const allProducts = await Product.find({}, null, { sort: { 'title': -1 } })

    return {
        props: {
            allProducts: JSON.parse(JSON.stringify(allProducts))
        }
    }

}