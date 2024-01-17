import LayoutStaff from "@/components/LayoutStaff";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DiscountPage() {
    const [discounts, setDiscounts] = useState([]);
    const [showMore, setShowMore] = useState(1);

    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }
    useEffect(() => {
        axios.get('/api/staff/discount').then(response => {
            setDiscounts(response.data);
        });
    }, []);
    useEffect(() => {
        axios.get('/api/staff/categories')
    }, []);
    return (
        <LayoutStaff>
            <h1 className="text-red-700 text-lg">Discounts</h1>
            <h2 className="text-red-700 text-lg">Number of discounts: {discounts.length}</h2>
            <table className="basic-red mt-2">
                <thead>
                    <tr>
                        <td>Discount ID</td>
                        <td>Discount Name</td>
                        <td>Category</td>
                        <td>Value</td>
                        <td>Start</td>
                        <td>End</td>
                        <td>Max Discount</td>
                    </tr>
                </thead>
                <tbody>
                    {discounts.slice(0, showMore * 10 < discounts.length ? showMore * 10 : discounts.length).map(discount => (
                        <tr key={discount._id}>
                            <td>{discount._id}</td>
                            <td>{discount.name}</td>
                            <td>
                                {discount.category?.name}
                            </td>
                            <td>{discount.value}{discount.unit}</td>
                            <td>{new Date(discount.start).toLocaleDateString('vi')}</td>
                            <td>{new Date(discount.end).toLocaleDateString('vi')}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount.max)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < discounts.length && discounts.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary-red mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary-red mt-2">Hide</button>
                )}
            </div>
        </LayoutStaff>
    )
}
