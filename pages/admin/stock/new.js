import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from 'react-select';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function NewStock() {
    const [store, setStore] = useState();
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const router = useRouter();
    const [optionListProducts, setOptionListProducts] = useState([]);


    const session = useSession();
    useEffect(() => {
        axios.get('/api/admin/stores').then(res => {
            res.data.map(store => {
                if (store.manager?._id === session?.data?.user?._id) {
                    setStore(store);
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
                }
            }
            );
        }
        );
    }, [session]);
    function saveStock(e) {
        e.preventDefault();
        axios.post('/api/admin/stock', {
            product,
            quantity,
            date,
            store: store._id
        }).then(res => {
            toastr.success(`Stock added!`, 'Success', { timeOut: 2000 })
            router.push('/admin/stock');
        });
    }

    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">New Stock</h1>
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