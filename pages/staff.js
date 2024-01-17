import Layout from "@/components/LayoutStaff";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
    const session = useSession();
    const [store, setStore] = useState('');
    const [orders, setOrders] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [weekOrders, setWeekOrders] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [monthOrders, setMonthOrders] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);

    useEffect(() => {
        if (session?.data?.user?.email) {
            axios.get('/api/staff/staffs?email=' + session?.data?.user?.email).then(res => {
                setStore(res.data?.store);
            })
        }
    }, [session]);
    useEffect(() => {
        async function fetchDashboardData() {
            if (store) {
                try {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const ordersResponse = await fetch("/api/staff/orders?store=" + store?._id);
                    const ordersData = await ordersResponse.json();
                    const todayOrders = ordersData.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        orderDate.setHours(0, 0, 0, 0);
                        return orderDate.getTime() === today.getTime() && (order.paid || order.paymentMethod === 'cash');
                    });
                    setOrders(todayOrders.length);
                    setRevenue(todayOrders.reduce((acc, cur) => acc + cur.total, 0));

                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    weekStart.setHours(0, 0, 0, 0);
                    const weekOrdersData = ordersData.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        orderDate.setHours(0, 0, 0, 0);
                        return orderDate >= weekStart && (order.paid || order.paymentMethod === 'cash');
                    });
                    setWeekOrders(weekOrdersData.length);
                    setWeekRevenue(weekOrdersData.reduce((acc, cur) => acc + cur.total, 0));

                    const monthStart = new Date();
                    monthStart.setDate(1);
                    monthStart.setHours(0, 0, 0, 0);
                    const monthOrdersData = ordersData.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        orderDate.setHours(0, 0, 0, 0);
                        return orderDate >= monthStart && (order.paid || order.paymentMethod === 'cash');
                    });
                    setMonthOrders(monthOrdersData.length);
                    setMonthRevenue(monthOrdersData.reduce((acc, cur) => acc + cur.total, 0));
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                }
            }
        };
        fetchDashboardData();
    }, [store]);
    return (
        <Layout>
            <div className="text-red-700 flex justify-between">
                <h2>Hello, <b>{session?.data?.user?.email}</b>!</h2>
                <h2>Store: <b>{store?.name}</b></h2>
                <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden flex-row">
                    {session?.data?.user?.image && <img src={session?.data?.user?.image} alt={session?.data?.user?.name} className="w-6 h-6" />}
                    {!session?.data?.user?.image && <img src='/avt.jpg' alt={session?.data?.user?.name} className="w-6 h-6" />}
                    {session?.data?.user?.name &&
                        <span className="px-2">
                            {session?.data?.user?.name.split(' ')[0]}
                        </span>}
                </div>
            </div>
            <div>
                <h1 className='font-bold my-2'>Welcome to DailyMart Staff 👋</h1>
                <h1 className='text-black'>Today</h1>
                <div className="grid justify-between gap-7 mt-4 grid-cols-2">
                    <div className="border bg-gray-200 px-6 py-3 font-bold rounded shadow-lg text-center">
                        <h4 className="uppercase text-gray-700 text-xl">Orders</h4>
                        <p className="text-red-700 p-4 text-2xl">{orders}</p>
                    </div>

                    <div className="border bg-gray-200 px-6 py-3 font-bold rounded shadow-lg text-center ">
                        <h4 className="uppercase text-gray-700 text-xl">Revenue</h4>
                        <p className="text-red-700 p-4 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue)}</p>
                    </div>
                </div>
            </div>
            <h1 className='text-black mt-8'>This Week</h1>
            <div className="grid justify-between gap-7 mt-4 grid-cols-2">
                <div className="border bg-gray-200 px-6 py-3 font-bold rounded shadow-lg text-center">
                    <h4 className="uppercase text-gray-700 text-xl">Orders</h4>
                    <p className="text-red-700 p-4 text-2xl">{weekOrders}</p>
                </div>

                <div className="border bg-gray-200 px-6 py-3 font-bold rounded shadow-lg text-center ">
                    <h4 className="uppercase text-gray-700 text-xl">Revenue</h4>
                    <p className="text-red-700 p-4 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(weekRevenue)}</p>
                </div>

            </div>
            <h1 className='text-black mt-8'>This Month</h1>
            <div className="grid justify-between gap-7 mt-4 grid-cols-2">
                <div className="border bg-gray-200 px-6 py-3 font-bold rounded shadow-lg text-center">
                    <h4 className="uppercase text-gray-700 text-xl">Orders</h4>
                    <p className="text-red-700 p-4 text-2xl">{monthOrders}</p>
                </div>

                <div className="border bg-gray-200 px-6 py-3 font-bold rounded shadow-lg text-center ">
                    <h4 className="uppercase text-gray-700 text-xl">Revenue</h4>
                    <p className="text-red-700 p-4 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(monthRevenue)}</p>
                </div>
            </div>

        </Layout>
    );
}

