import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DiscountForm from "@/components/DiscountForm";

export default function EditDiscountPage() {
    const [discountInfo, setDiscountInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }

        axios.get('/api/admin/discount?id=' + id).then(
            response => {
                setDiscountInfo(response.data);
            }
        )
    }, [id]);

    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">Edit Discount</h1>
            {discountInfo && (
                <DiscountForm  {...discountInfo} />
            )}
        </Layout>
    )
}