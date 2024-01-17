import LayoutStaff from "@/components/LayoutStaff";
import axios from "axios";
import { useSession } from "next-auth/react";
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
        axios.get('/api/staff/staffs?email=' + session?.data?.user?.email).then(res => {
            if (res.data?.store) setStore(res.data.store);
        })
    }, [session]);
    useEffect(() => {
        if (store) axios.get('/api/staff/stock?store=' + store?._id).then(res => setStock(res.data));
    }, [store]);
    return (
        <LayoutStaff>
            <h1 className="text-red-700 text-lg">Stock</h1>
            <h2 className="text-red-700 text-lg">Number of stock: {stock.length}</h2>
            <table className="basic-red mt-4">
                <thead>
                    <tr>
                        <td>Product</td>
                        <td>Quantity</td>
                        <td>Date</td>

                    </tr>
                </thead>
                <tbody>
                    {stock.length > 0 && stock.sort((a, b) => a.product?.title.localeCompare(b.product?.title)).slice(0, showMore * 10 < stock.length ? showMore * 10 : stock.length).map(stock => (
                        <tr key={stock._id}>
                            <td>{stock.product?.title}</td>
                            <td>{stock.quantity}</td>
                            <td>{new Date(stock.date).toLocaleDateString('vi')}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < stock.length && stock.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary-red mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary-red mt-2">Hide</button>
                )}
            </div>
        </LayoutStaff>
    )
}