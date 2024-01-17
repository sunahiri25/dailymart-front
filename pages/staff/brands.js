import LayoutStaff from "@/components/LayoutStaff";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [showMore, setShowMore] = useState(1);

    useEffect(() => {
        fetchBrands();
    }, []);

    function fetchBrands() {
        axios.get('/api/staff/brands').then(res => {
            setBrands(res.data);
        })
    };



    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }

    return (
        <LayoutStaff>
            <h1 className="text-red-700 text-lg">Brands</h1>
            <h2 className="text-red-700 text-lg">Number of brands: {brands.length}</h2>
            <table className="basic-red mt-4">
                <thead>
                    <tr>
                        <td>Brand ID</td>
                        <td>Brand Name</td>
                        <td>Brand Active</td>

                    </tr>
                </thead>
                <tbody>
                    {brands.slice(0, showMore * 10 < brands.length ? showMore * 10 : brands.length).map(brand => (
                        <tr key={brand._id}>
                            <td>{brand._id}</td>
                            <td>{brand.name}</td>
                            <td>{brand.active}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < brands.length && brands.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary-red mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary-red mt-2">Hide</button>
                )}
            </div>
        </LayoutStaff>
    )
};

