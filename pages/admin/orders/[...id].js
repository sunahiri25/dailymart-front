import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderInfoPage() {
    const router = useRouter();
    const { id } = router.query;
    const [orderInfo, setOrderInfo] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform form submission logic here
    };

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get("/api/admin/orders/?id=" + id).then((response) => {
            if (!response.data) {
                router.push("/admin/orders");
            } else {
                setOrderInfo(response.data);
            }
        });
    }, [id]);

    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">Order {id}</h1>
            <form>
                <label className="text-blue-900">Customer name:</label>
                <input type="text" value={orderInfo?.name} disabled />
                <label className="text-blue-900">Email:</label>
                <input type="email" value={orderInfo?.email} disabled />
                <label className="text-blue-900">Phone:</label>
                <input type="tel" value={orderInfo?.phone} disabled />
                {orderInfo?.address && (
                    <>
                        <label className="text-blue-900">Address:</label>
                        <input type="text" value={orderInfo?.address + ', ' + orderInfo?.ward + ', ' + orderInfo?.district + ', ' + orderInfo?.city} disabled />

                    </>
                )}

            </form>
        </Layout>
    );
}