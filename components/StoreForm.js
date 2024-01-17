import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function StoreForm({
    _id,
    name: existingName,
    address: existingAddress,
    phone: existingPhone,
    manager: existingManager,
}) {
    const [goToStore, setGoToStore] = useState(false);
    const [name, setName] = useState(existingName || '');
    const [address, setAddress] = useState(existingAddress || '');
    const [phone, setPhone] = useState(existingPhone || '');
    const [manager, setManager] = useState(existingManager || '');
    const [users, setUsers] = useState([]);
    const router = useRouter();
    useEffect(() => {

    }, []);

    async function saveStore(e) {
        e.preventDefault();
        const data = { name, address, phone, manager };
        if (_id) {
            await axios.put('/api/stores/', { ...data, _id });
            toastr.success(`Discount ${data.name} updated!`, 'Success', { timeOut: 2000 })
        } else {
            await axios.post('/api/stores', data);
            toastr.success(`Discount ${data.name} created!`, 'Success', { timeOut: 2000 })
        }
        setGoToStore(true);
    };

    if (goToStore) {
        router.push('/stores');
    };


    return (
        <form onSubmit={saveStore}>
            <label>Store Name</label>
            <input type="text" placeholder="store name"
                value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Address</label>
            <input type="text" placeholder="address"
                value={address} onChange={(e) => setAddress(e.target.value)} required />
            <label>Phone</label>
            <input type="text" placeholder="phone"
                value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <label>Manager</label>
            <input type="text" placeholder="manager"
                value={manager} onChange={(e) => setManager(e.target.value)} />
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
};