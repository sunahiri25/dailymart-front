import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/admin/products/?id=' + id).then(response => {
            if (!response.data) {
                router.push('/admin/products');
            } else {
                setProductInfo(response.data);
            }
        })
    }, [id]);
    function goBack() {
        router.push('/admin/products');
    }
    async function deleteProduct() {
        await axios.delete('/api/admin/products/?id=' + id);
        toastr.success(`Product deleted!`, 'Success', { timeOut: 2000 })
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center text-blue-900 text-lg">Do you really want to delete product <b>{productInfo?.title}</b>?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteProduct}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}