import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StockPage() {
    const [stock, setStock] = useState([]);
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
        axios.get('/api/admin/stores').then(res => {
            res.data.map(s => {
                if (s.manager?._id === session?.data?.user?._id) {
                    setStore(s);
                    axios.get('/api/admin/stock?store=' + s?._id).then(res => setStock(res.data));
                }
            }
            );
        }
        );

    }, [session]);
    return (
        <Layout>
            <Link className="bg-blue-900 text-white py-1 px-2 rounded-md " href={'/admin/stock/new'}>
                Add new stock
            </Link>
            <h1 className="mt-2 text-blue-900 text-lg">Number of stock: {stock.length}</h1>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td>Quantity</td>
                        <td>Date</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {stock.length > 0 && stock.sort((a, b) => a.product?.title.localeCompare(b.product?.title)).slice(0, showMore * 10 < stock.length ? showMore * 10 : stock.length).map(stock => (
                        <tr key={stock._id}>
                            <td>{stock.product?.title}</td>
                            <td>{stock.quantity}</td>
                            <td>{new Date(stock.date).toLocaleDateString('vi')}</td>
                            <td>
                                <Link className="bg-blue-900 text-white py-1 px-2 rounded-md " href={'/admin/stock/' + stock._id}>
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < stock.length && stock.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary mt-2">Hide</button>
                )}
            </div>
        </Layout>
    )
}