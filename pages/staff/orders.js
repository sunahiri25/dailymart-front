import LayoutStaff from "@/components/LayoutStaff";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [store, setStore] = useState();
    const session = useSession();
    const [showMore, setShowMore] = useState(1);

    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }
    useEffect(() => {
        axios.get('/api/staff/staffs?email=' + session?.data?.user?.email).then(res => {
            if (res.data?.store) setStore(res.data.store);
        })
    }, [session]);
    useEffect(() => {
        if (store) axios.get('/api/staff/orders?store=' + store?._id).then(res => setOrders(res.data));
    }, [store]);

    return (
        <LayoutStaff>
            <Link href={`/staff/orders/new`} className="bg-red-700 text-white py-1 px-2 rounded-md ">
                Add new order
            </Link>
            <h2 className="text-red-700 text-lg">Number of orders: {orders.length}</h2>

            <table className="basic-red mt-4">
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Order ID</td>
                        <td>Payment</td>
                        <td>Paid</td>
                        <td>Total</td>
                        <td>Products</td>
                        <td>Process</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.slice(0, showMore * 10 < orders.length ? showMore * 10 : orders.length).map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td>{order._id}</td>
                            <td className="text-center">{order.paymentMethod}</td>
                            <td className={order.paid ? "text-green-600 text-center" : "text-red-600 text-center"}>{order.paid ? 'YES' : 'NO'}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>

                            <td>
                                <ul>
                                    {order.address && order.line_items.slice(0, order.line_items.length - 1).map(key => (
                                        <>
                                            {key.price_data.product_data?.name} <b>x{key.quantity}</b> <br />
                                        </>
                                    ))}
                                    {!order.address && order.line_items.map(key => (
                                        <>
                                            {key.price_data.product_data?.name} <b>x{key.quantity}</b> <br />
                                        </>
                                    ))
                                    }
                                </ul>
                            </td>
                            <td>
                                {order.processing}
                            </td>
                            <td>
                                <Link href={'/staff/orders/edit/' + order._id}>
                                    Edit
                                </Link>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < orders.length && orders.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary-red mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary-red mt-2">Hide</button>
                )}
            </div>
        </LayoutStaff>
    )
}