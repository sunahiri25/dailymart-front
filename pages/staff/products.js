import LayoutStaff from "@/components/LayoutStaff";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showMore, setShowMore] = useState(1);

    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }

    useEffect(() => {
        axios.get('/api/staff/products').then(response => {
            setProducts(response.data);
        })
    }, []);
    return (
        <LayoutStaff>
            <h1 className="text-red-700 text-lg">Products</h1>
            <h2 className="text-red-700 text-lg">Number of products: {products.length}</h2>
            <table className="basic-red mt-2">
                <thead>
                    <tr>
                        <td>Product ID</td>
                        <td>Product Name</td>
                        <td>Category</td>
                        <td>Brand</td>
                        <td>Retail Price</td>
                        <td>Active</td>
                    </tr>
                </thead>
                <tbody>
                    {products.slice(0, showMore * 10 < products.length ? showMore * 10 : products.length).map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.title}</td>
                            <td>{product.category.name}</td>
                            <td>{product.brand?.name}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.retailPrice)}</td>
                            <td>{product.active}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < products.length && products.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary-red mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary-red mt-2">Hide</button>
                )}
            </div>
        </LayoutStaff>
    )
}