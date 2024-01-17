import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Select from 'react-select';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function EditStockPage() {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [date, setDate] = useState(null);
    const [optionListProducts, setOptionListProducts] = useState([]);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/admin/products').then(res => {
            if (res.data.length > 0) {
                const optionListProduct = res.data.map(product => (
                    {
                        value: product._id,
                        label: product.title
                    }))
                setOptionListProducts(optionListProduct);
            };
        })

        axios.get('/api/admin/stock?id=' + id).then(
            response => {
                setProduct(response.data.product);
                setQuantity(response.data.quantity);
                setDate(new Date(response.data.date).toISOString().split('T')[0]);
            }
        )
    }, [id]);

    function saveStock(e) {
        e.preventDefault();
        axios.put('/api/admin/stock', {
            _id: id,
            product,
            quantity,
            date,
        }).then(res => {
            toastr.success(`Stock updated!`, 'Success', { timeOut: 2000 })
            router.push('/admin/stock');
        });
    }
    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">Edit Stock</h1>
            <form onSubmit={saveStock}>
                <label className="text-blue-900">Product</label>
                <Select options={optionListProducts} placeholder='Select product' value={optionListProducts.find(option => option.value === product)} onChange={e => setProduct(e.value)} />
                <label className="text-blue-900">Quantity</label>
                <input type="number" placeholder="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                <label className="text-blue-900">Date</label>
                <input type="date" placeholder="date" value={date} onChange={e => setDate(e.target.value)} required />
                <button className="btn-primary">Save</button>
            </form>
        </Layout>
    )
}