import LayoutStaff from "@/components/LayoutStaff";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [showMore, setShowMore] = useState(1);
    useEffect(() => {
        fetchCategories();
    }, []);

    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }
    function fetchCategories() {
        axios.get('/api/staff/categories').then(res => {
            setCategories(res.data);
        })
    };

    return (
        <LayoutStaff>
            <h1  className="text-red-700 text-lg">Categories</h1>
            <h2 className="text-red-700 text-lg">Number of categories: {categories.length}</h2>
            <table className="basic-red mt-4">
                <thead>
                    <tr>
                        <td>Category ID</td>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td>VAT (%)</td>

                    </tr>
                </thead>
                <tbody>
                    {categories.slice(0, showMore * 10 < categories.length ? showMore * 10 : categories.length).map(category => (
                        <tr key={category._id}>
                            <td>{category._id}</td>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>{category.vat}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < categories.length && categories.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary-red mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary-red mt-2">Hide</button>
                )}
            </div>
        </LayoutStaff>
    )
};
