import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminsPage() {
    const [staffs, setStaffs] = useState([]);
    const [store, setStore] = useState();
    const session = useSession();
    useEffect(() => {
        axios.get('/api/admin/stores').then(res => {
            res.data.map(s => {
                if (s.manager && s.manager?._id === session?.data?.user?._id) {
                    setStore(s);
                }
            }
            );
        }
        );
    }, [session]);
    useEffect(() => {
        if (store) axios.get('/api/admin/staffs?store=' + store?._id).then(res => setStaffs(res.data));
    }, [store]);
    return (
        <Layout>
            <Link className="bg-blue-900 text-white py-1 px-2 rounded-md " href={'/admin/staffs/new'}>
                Add new staff
            </Link>
            <h1 className="mt-2 text-blue-900 text-lg">Number of staffs: {staffs.length}</h1>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Staff ID</td>
                        <td>Name</td>
                        <td>Email</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {staffs.length > 0 && staffs.map(staff => (
                        <tr key={staff._id}>
                            <td>{staff._id}</td>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>
                                <Link href={'/admin/staffs/edit/' + staff._id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" data-slot="icon" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    Edit
                                </Link>
                                <Link href={'/admin/staffs/delete/' + staff._id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" data-slot="icon" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}