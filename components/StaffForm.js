import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function StaffForm({
    _id,
    name: existingName,
    birthDay: existingBirthDay,
    gender: existingGender,
    address: existingAddress,
    phone: existingPhone,
    email: existingEmail,
    manager: existingManager,
    salary: existingSalary,
    store: existingStore,
    password: existingPassword,
}) {
    const [name, setName] = useState(existingName || '');
    const [birthDay, setBirthDay] = useState(existingBirthDay || '');
    const [gender, setGender] = useState(existingGender || '');
    const [address, setAddress] = useState(existingAddress || '');
    const [phone, setPhone] = useState(existingPhone || '');
    const [manager, setManager] = useState(existingManager || '');
    const [salary, setSalary] = useState(existingSalary || '');
    const [store, setStore] = useState(existingStore || '');
    const [email, setEmail] = useState(existingEmail || '');
    const [password, setPassword] = useState(existingPassword || '');
    const router = useRouter();
    const [goToStaff, setGoToStaff] = useState(false);
    const session = useSession()
    useEffect(() => {
        axios.get('/api/admin/stores').then(res => {
            res.data.map(s => {
                if (s.manager && s.manager?._id === session?.data?.user?._id) {
                    setStore(s);
                    setManager(s.manager);
                }
            }
            );
        }
        );
    }, [session]);


    async function saveStaff(e) {
        e.preventDefault();
        const data = { name, email, password, birthDay, gender, address, phone, salary, store, manager };
        if (_id) {
            await axios.put('/api/admin/staffs/', { ...data, _id });
            toastr.success(`Staff ${data.name} updated!`, 'Success', { timeOut: 2000 })
        } else {
            await axios.post('/api/admin/staffs', data);
            toastr.success(`Staff ${data.name} created!`, 'Success', { timeOut: 2000 })
        }
        setGoToStaff(true);
    };

    if (goToStaff) {
        router.push('/admin/staffs');
    };


    return (
        <form onSubmit={saveStaff}>
            <label className="text-blue-900">Staff Name</label>
            <input type="text" placeholder="staff name"
                value={name} onChange={(e) => setName(e.target.value)} required />
            <label className="text-blue-900">Email</label>
            <input type="email" placeholder="email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="text-blue-900">Password</label>
            <input type="password" placeholder="password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label className="text-blue-900">BirthDay</label>
            <input type="text" placeholder="dd/mm/yyyy"
                value={birthDay} onChange={(e) => setBirthDay(e.target.value)} />
            <label className="text-blue-900">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value=''>Select gender</option>
                <option value='female'>Female</option>
                <option value='male'>Male</option>
                <option value='other'>Other</option>
            </select>
            <label className="text-blue-900">Address</label>
            <input type="text" placeholder="address"
                value={address} onChange={(e) => setAddress(e.target.value)} />
            <label className="text-blue-900">Phone</label>
            <input type="text" placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <label className="text-blue-900">Salary</label>
            <input type="text" placeholder="salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
            <label className="text-blue-900">Store</label>
            <input type="text" placeholder="store" value={(store?.name ? store.name : '')} disabled />
            <label className="text-blue-900">Manager</label>
            <input type="text" placeholder="manager" value={(manager?.email ? manager.email : '')} disabled className="bg-gray-200" />
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
};