import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function DeleteDiscountPage() {
    const router = useRouter();
    const [discountInfo, setDiscountInfo] = useState();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/admin/discount/?id=' + id).then(response => {
            if (!response.data) {
                router.push('/admin/discount');
            } else {
                setDiscountInfo(response.data);
            }
        })
    }, [id]);
    function goBack() {
        router.push('/admin/discount');
    }
    async function deleteDiscount() {
        await axios.delete('/api/admin/discount/?id=' + id);
        toastr.success(`Discount deleted!`, 'Success', { timeOut: 2000 })
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center text-blue-900 text-lg">Do you really want to delete discount <b>{discountInfo?.title}</b>?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteDiscount}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}