import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function DiscountForm({
    _id,
    name: existingName,
    category: existingCategory,
    value: existingValue,
    unit: existingUnit,
    start: existingStart,
    end: existingEnd,
    max: existingMax,
}) {
    const [categories, setCategories] = useState([])
    const [goToDiscount, setGoToDiscount] = useState(false);
    const [name, setName] = useState(existingName || '');
    const [category, setCategory] = useState(existingCategory || categories[0]?._id)
    const [value, setValue] = useState(existingValue || '');
    const [unit, setUnit] = useState(existingUnit || '%');
    existingStart = existingStart ? new Date(existingStart).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    existingEnd = existingEnd ? new Date(existingEnd).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const [start, setStart] = useState(existingStart || new Date().toISOString().split('T')[0]);
    const [end, setEnd] = useState(existingEnd || new Date().toISOString().split('T')[0]);
    const [max, setMax] = useState(existingMax || '');

    const router = useRouter();
    useEffect(() => {
        axios.get('/api/admin/categories').then(res => {
            setCategories(res.data)
        });
    }, []);

    async function saveDiscount(e) {
        e.preventDefault();
        const data = { name, category, value, unit, start, end, max };
        if (_id) {
            await axios.put('/api/admin/discount/', { ...data, _id });
            toastr.success(`Discount ${data.name} updated!`, 'Success', { timeOut: 2000 })
        } else {
            await axios.post('/api/admin/discount', data);
            toastr.success(`Discount ${data.name} created!`, 'Success', { timeOut: 2000 })
        }
        setGoToDiscount(true);
    };

    if (goToDiscount) {
        router.push('/admin/discount');
    };


    return (
        <form onSubmit={saveDiscount}>
            <label className="text-blue-900">Discount Name</label>
            <input type="text" placeholder="discount name"
                value={name} onChange={(e) => setName(e.target.value)} required />
            <label className="text-blue-900">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                {categories.length > 0 && categories.map(c => (
                    c.parent && <option value={c._id} key={c._id}>{c.name}</option>
                ))}
            </select>
            <label className="text-blue-900">Value</label>
            <input type="text" placeholder="discount value" value={value} onChange={e => setValue(e.target.value)} required />
            <label className="text-blue-900">Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value)}>
                <option value='%'>%</option>
                <option value='VND'>VND</option>
            </select>
            <label className="text-blue-900">Start</label>
            <input type="date" placeholder="discount start" value={start} onChange={e => setStart(e.target.value)} required />
            <label className="text-blue-900">End</label>
            <input type="date" placeholder="discount end" value={end} onChange={e => setEnd(e.target.value)} required />
            <label className="text-blue-900">Max</label>
            <input type="text" placeholder="discount max" value={max} onChange={e => setMax(e.target.value)} required />
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
};