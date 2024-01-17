import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default function Home() {
    const session = useSession();
    const [orders, setOrders] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [profit, setProfit] = useState(0);
    const [weekOrders, setWeekOrders] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [weekProfit, setWeekProfit] = useState(0);
    const [monthOrders, setMonthOrders] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [monthProfit, setMonthProfit] = useState(0);

    const [store, setStore] = useState();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/products').then(res => {
            setProducts(res.data);
        });
    }, []);

    useEffect(() => {
        async function fetchDashboardData() {
            if (store) {
                try {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const ordersResponse = await fetch("/api/admin/orders?store=" + store?._id);
                    const ordersData = await ordersResponse.json();
                    const todayOrders = ordersData.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        orderDate.setHours(0, 0, 0, 0);
                        return orderDate.getTime() === today.getTime() && (order.paid || order.paymentMethod === 'cash');
                    });
                    setOrders(todayOrders.length);
                    setRevenue(todayOrders.reduce((acc, cur) => acc + cur.total, 0));

                    let cost = 0;
                    for (let i = 0; i < todayOrders.length; i++) {
                        for (let j = 0; j < todayOrders[i].line_items.length; j++) {
                            const product = products.find(p => p._id === todayOrders[i].line_items[j].price_data.product_data.id);
                            if (product === undefined) {
                                cost += todayOrders[i].line_items[j].price_data.unit_amount
                            } else {
                                cost += (product.purchasePrice + todayOrders[i].line_items[j].price_data.vat) * todayOrders[i].line_items[j].quantity;
                            }
                        }
                    }
                    setProfit(todayOrders.reduce((acc, cur) => acc + cur.total, 0) - cost);
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

                    let weekCost = 0;
                    for (let i = 0; i < weekOrdersData.length; i++) {
                        for (let j = 0; j < weekOrdersData[i].line_items.length; j++) {
                            const product = products.find(p => p._id === weekOrdersData[i].line_items[j].price_data.product_data.id);
                            if (product === undefined) {
                                weekCost += weekOrdersData[i].line_items[j].price_data.unit_amount
                            } else {
                                weekCost += (product.purchasePrice + weekOrdersData[i].line_items[j].price_data.vat) * weekOrdersData[i].line_items[j].quantity;
                            }
                        }
                    }
                    setWeekProfit(weekOrdersData.reduce((acc, cur) => acc + cur.total, 0) - weekCost);
                    // Filter orders for the latest 7 days
                    const latest7DaysOrders = ordersData.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        orderDate.setHours(0, 0, 0, 0);
                        const diffInDays = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
                        return diffInDays < 7 && (order.paid || order.paymentMethod === 'cash');
                    });

                    // Calculate revenue for each day
                    const revenueData = [];
                    const profitData = [];
                    const labels = [];
                    for (let i = 6; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        date.setHours(0, 0, 0, 0);
                        labels.push(date.toLocaleDateString('vi-VN'));
                        const revenue = latest7DaysOrders.reduce((acc, cur) => {
                            const orderDate = new Date(cur.createdAt);
                            orderDate.setHours(0, 0, 0, 0);
                            if (orderDate.getTime() === date.getTime()) {
                                return acc + cur.total;
                            }
                            return acc;
                        }, 0);
                        revenueData.push(revenue);
                        const cost = latest7DaysOrders.reduce((acc, cur) => {
                            const orderDate = new Date(cur.createdAt);
                            orderDate.setHours(0, 0, 0, 0);
                            if (orderDate.getTime() === date.getTime()) {
                                let cost = 0;
                                for (let i = 0; i < cur.line_items.length; i++) {
                                    const product = products.find(p => p._id === cur.line_items[i].price_data.product_data.id);
                                    if (product === undefined) {
                                        cost += cur.line_items[i].price_data.unit_amount
                                    } else {
                                        cost += (product.purchasePrice + cur.line_items[i].price_data.vat) * cur.line_items[i].quantity;
                                    }
                                }
                                return acc + cost;
                            }
                            return acc;
                        }, 0);
                        profitData.push(revenue - cost);
                    }
                    var ctx = document.getElementById('myChart').getContext('2d');
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Revenue',
                                data: revenueData,
                                backgroundColor: 'rgb(255, 99, 132)',
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 1
                            },
                            {
                                label: 'Profit',
                                data: profitData,
                                backgroundColor: 'rgb(54, 162, 235)',
                                borderColor: 'rgb(54, 162, 235)',
                                borderWidth: 1
                            }]
                        },
                    });
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                }
            }
        };

        fetchDashboardData();

    }, [store]);
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
    return (
        <Layout>
            <div className="text-blue-900 flex justify-between">
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
            <h1 className='font-bold my-2'>Welcome to DailyMart Admin 👋</h1>
            <h1 className='text-black'>Today</h1>
            <div className="grid justify-between gap-3  grid-cols-3">
                <div className="border bg-gray-200 px-2 py-2 font-bold rounded shadow-lg text-center">
                    <h4 className="uppercase text-gray-700 text-xl">Orders</h4>
                    <p className="text-blue-900 p-2 text-2xl">{orders}</p>
                </div>

                <div className="border bg-gray-200 px-2 py-2 font-bold rounded shadow-lg text-center ">
                    <h4 className="uppercase text-gray-700 text-xl">Revenue</h4>
                    <p className="text-blue-900 p-2 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue)}</p>
                </div>
                <div className="border bg-gray-200 px-2 py-2 font-bold rounded shadow-lg text-center ">
                    <h4 className="uppercase text-gray-700 text-xl">Profit</h4>
                    <p className="text-blue-900 p-2 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(profit)}</p>
                </div>
            </div>
            <h1 className='text-black mt-4'>This Week</h1>
            <div className="grid justify-between gap-3  grid-cols-3">
                <div className="border bg-gray-200 px-2 py-2 font-bold rounded shadow-lg text-center">
                    <h4 className="uppercase text-gray-700 text-xl">Orders</h4>
                    <p className="text-blue-900 p-2 text-2xl">{weekOrders}</p>
                </div>

                <div className="border bg-gray-200 px-2 py-2 font-bold rounded shadow-lg text-center ">
                    <h4 className="uppercase text-gray-700 text-xl">Revenue</h4>
                    <p className="text-blue-900 p-2 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(weekRevenue)}</p>
                </div>
                <div className="border bg-gray-200 px-2 py-2 font-bold rounded shadow-lg text-center ">
                    <h4 className="uppercase text-gray-700 text-xl">Profit</h4>
                    <p className="text-blue-900 p-2 text-2xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(weekProfit)}</p>
                </div>

            </div>

            <h1 className='text-black mt-4'>Last 7 Days Revenue & Profit</h1>
            <div className="flex w-full my-auto mx-auto">
                <div className="w-2/3 h-fit mx-auto">
                    <canvas id="myChart"></canvas>
                </div>
            </div>
        </Layout>
    );
}
