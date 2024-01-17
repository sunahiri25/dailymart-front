import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoresPage() {
    const [stores, setStores] = useState([]);
    useEffect(() => {
        axios.get('/api/admin/stores').then(res => setStores(res.data));
    }, []);
    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">Stores</h1>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Store ID</td>
                        <td>Name</td>
                        <td>Address</td>
                        <td>Phone</td>
                        <td>Manager</td>
                    </tr>
                </thead>
                <tbody>
                    {stores.length > 0 && stores.map(store => (
                        <tr key={store._id}>
                            <td>{store._id}</td>
                            <td>{store.name}</td>
                            <td>{store.address}</td>
                            <td>{store.phone}</td>
                            <td>{store?.manager?.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}