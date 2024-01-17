import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { withSwal } from "react-sweetalert2";

function Brands({ swal }) {
    const [name, setName] = useState('');
    const [active, setActive] = useState('Active');
    const [brands, setBrands] = useState([]);
    const [editedBrand, setEditedBrand] = useState(null);
    const [showMore, setShowMore] = useState(1);

    useEffect(() => {
        fetchBrands();
    }, []);

    function fetchBrands() {
        axios.get('/api/admin/brands').then(res => {
            setBrands(res.data);
        })
    };

    async function saveBrand(e) {
        e.preventDefault();
        const data = { name, active };
        if (editedBrand) {
            data._id = editedBrand._id;
            await axios.put('/api/admin/brands', data);
            setEditedBrand(null);
            toastr.success(`Brand ${name} updated!`, 'Success', { timeOut: 2000 })

        } else {
            await axios.post('/api/admin/brands', data);
            toastr.success(`Brand ${name} created!`, 'Success', { timeOut: 2000 })
        }
        setName('');
        setActive('Active');
        fetchBrands();
    };

    function editBrand(brand) {
        setEditedBrand(brand);
        setName(brand.name);
        setActive(brand.active);
        fetchBrands();
    };

    function deleteBrand(brand) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete brand ${brand.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#d55",
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = brand;
                axios.delete('/api/admin/brands?_id=' + _id)
                swal.fire('Deleted!', `Brand ${brand.name} has been deleted.`, 'success');
                fetchBrands();
            }
        })
        fetchBrands();
    };

    function handleShowMore() {
        setShowMore(showMore + 1);
    }

    function handleShowLess() {
        setShowMore(1);
    }

    return (
        <Layout>
            <h1 className="text-blue-900 mb-2 text-xl">Brands</h1>
            <label className="text-blue-900">{editedBrand ? `Edit brand ${editedBrand.name}` : "New brand name "}</label>
            <form onSubmit={saveBrand} className="flex gap-1">
                <input className='mb-0' type="text" placeholder={"Brand name"} value={name} onChange={e => setName(e.target.value)}></input>
                <select value={active} onChange={e => setActive(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <button className="btn-primary py-1 " type="submit">Save</button>
            </form>
            <h1 className="mt-2 text-blue-900 mb-2 text-xl">Number of brands: {brands.length}</h1>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Brand ID</td>
                        <td>Brand Name</td>
                        <td>Brand Active</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {brands.slice(0, showMore * 10 < brands.length ? showMore * 10 : brands.length).map(brand => (
                        <tr key={brand._id}>
                            <td>{brand._id}</td>
                            <td>{brand.name}</td>
                            <td>{brand.active}</td>
                            <td>
                                <button onClick={() => editBrand(brand)} className="btn-primary mr-1">Edit</button>
                                <button onClick={() => deleteBrand(brand)} className="btn-primary">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-5">
                {showMore * 10 < brands.length && brands.length > 10 && (
                    <button onClick={handleShowMore} className="btn-primary mt-2">More</button>
                )}
                {showMore > 1 && (
                    <button onClick={handleShowLess} className="btn-primary mt-2">Hide</button>
                )}
            </div>
        </Layout>
    )
};

export default withSwal(({ swal }, ref) =>
    (<Brands swal={swal} />)
);