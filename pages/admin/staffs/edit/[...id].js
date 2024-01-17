import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StaffForm from "@/components/StaffForm";

export default function EditStaffPage() {
    const [staffInfo, setStaffInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/admin/staffs?id=' + id).then(
            response => {
                setStaffInfo(response.data);
            }
        )
    }, [id]);

    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">Edit Staff</h1>
            {staffInfo && (
                <StaffForm  {...staffInfo} />
            )}
        </Layout>
    )
}