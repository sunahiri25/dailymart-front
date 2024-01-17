import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [store, setStore] = useState();
    const session = useSession();
    const [showMore, setShowMore] = useState(1);
    useEffect(() => {
        axios.get('/api/admin/stores').then(res => {
            res.data.map(s => {
                if (s.manager && s.manager?._id === session?.data?.user?._id) {
                    setStore(s);
                }
            }
            );
        }
        );
    }, [session]);
    useEffect(() => {
        if (store) axios.get('/api/admin/orders?store=' + store?._id).then(res => setOrders(res.data));
    }, [store]);
    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }
    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">Orders</h1>
            <h2 className="text-blue-900 text-lg">Number of orders: {orders.length}</h2>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Order ID</td>
                        <td>Payment</td>
                        <td>Paid</td>
                        <td>Total</td>
                        <td>Products</td>
                        <td>Process</td>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.slice(0, showMore * 10 < orders.length ? showMore * 10 : orders.length).map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td><Link className='bg-white text-black' href={'/admin/orders/' + order._id}>{order._id}</Link></td>
                            <td className="text-center">{order.paymentMethod}</td>
                            <td className={order.paid ? "text-green-600 text-center" : "text-red-600 text-center"}>{order.paid ? 'YES' : 'NO'}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>

                            <td>
                                {
                                    order.address && (
                                        <>{order.line_items.slice(0, order.line_items.length - 1).map(key => (
                                            <p key={key.price_data.product_data.id}>
                                                {key.price_data.product_data?.name} <b>x{key.quantity}</b>
                                            </p>
                                        ))}</>
                                    )
                                }
                                {
                                    !order.address && (
                                        <>{order.line_items.map(key => (
                                            <p key={key.price_data.product_data.id}>
                                                {key.price_data.product_data?.name} <b>x{key.quantity}</b>
                                            </p>
                                        ))}</>
                                    )
                                }
                            </td>
                            <td>
                                {order.processing}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < orders.length && orders.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary mt-2">Hide</button>
                )}
            </div>
        </Layout>
    )
}