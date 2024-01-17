import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Select from 'react-select';
export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    purchasePrice: existingPurchasePrice,
    retailPrice: existingRetailPrice,
    images: existingImages,
    category: assignedCategory,
    ean: existingEan,
    brand: existingBrand,
    active: existingActive,
}) {
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || categories[0]?._id)
    const [purchasePrice, setPurchasePrice] = useState(existingPurchasePrice || '');
    const [retailPrice, setRetailPrice] = useState(existingRetailPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [ean, setEan] = useState(existingEan || []);
    const [brand, setBrand] = useState(existingBrand || brands[0]?._id);
    const [active, setActive] = useState(existingActive || 'Active');
    const [goToProduct, setGoToProduct] = useState(false);
    const [isUpLoadingImage, setIsUpLoadingImage] = useState(false);
    const [isUpLoadingEAN, setIsUpLoadingEAN] = useState(false);

    const [optionListBrand, setOptionListBrand] = useState([]);
    const [optionListCategory, setOptionListCategory] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/admin/categories').then(res => {
            setCategories(res.data)
            if (res.data.length > 0) {
                const optionListCategory = res.data.map(category => (

                    {
                        value: category._id,
                        label: category.name
                    }))
                setOptionListCategory(optionListCategory);
            };
        })
        axios.get('/api/admin/brands').then(res => {
            setBrands(res.data);
            if (res.data.length > 0) {
                const optionListBrand = res.data.map(brand => (
                    {
                        value: brand._id,
                        label: brand.name
                    }))
                setOptionListBrand(optionListBrand);
            }

        })
    }, []);

    async function saveProduct(e) {
        e.preventDefault();
        const data = { title, description, purchasePrice, retailPrice, images, category, ean, brand, active };
        if (_id) {
            // update product
            await axios.put('/api/admin/products/', { ...data, _id });
            toastr.success(`Product ${data.title} updated!`, 'Success', { timeOut: 2000 })
        } else {

            // create product
            await axios.post('/api/admin/products', data);
            toastr.success(`Product ${data.title} created!`, 'Success', { timeOut: 2000 })
        }
        setGoToProduct(true);
    };

    if (goToProduct) {
        router.push('/admin/products');
    };

    async function uploadImages(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUpLoadingImage(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/admin/upload', data);
            setImages(oldImages => [...oldImages, ...res.data.links]);
            setIsUpLoadingImage(false);
        }
    };

    function updateImagesOrder(images) {
        setImages(images);
    };

    function removeImage(link) {
        setImages(oldImages => oldImages.filter(item => item !== link))
    };
    function removeEAN(link) {
        setEan(oldEan => oldEan.filter(item => item !== link))
    };
    async function uploadEAN(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUpLoadingEAN(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/admin/upload', data);
            setEan(oldImages => [...oldImages, ...res.data.links]);
            setIsUpLoadingEAN(false);
        }
    };
    function updateEANOrder(ean) {
        setEan(ean);
    };
    return (
        <form onSubmit={saveProduct}>
            <label className="text-blue-900">Product Name</label>
            <input type="text" placeholder="product name"
                value={title} onChange={(e) => setTitle(e.target.value)} required />
            <label className="text-blue-900">Category</label>
            <Select options={optionListCategory} placeholder='Select category' value={optionListCategory.find(option => option.value === category)} onChange={e => setCategory(e.value)} />
            <label className="text-blue-900">Brand</label>
            <Select options={optionListBrand} placeholder='Select brand' value={optionListBrand.find(option => option.value === brand)} onChange={e => setBrand(e.value)} />
            <label className="text-blue-900">Active</label>
            <select value={active} onChange={e => setActive(e.target.value)}>
                <option value='Active'>Active</option>
                <option value='Inactive'>Inactive</option>
            </select>
            <label className="text-blue-900">Product Images</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-26 rounded-sm border border-gray-300 shadow-md bg-white relative">
                            <button className='bg-red-700 rounded-sm text-white px-1 absolute right-0 opacity-80 hover:opacity-95' onClick={() => removeImage(link)}>X</button>
                            <div key={link} className="h-24 bg-white p-2 ">
                                <img src={link} alt="" className="rounded-lg" />
                            </div>
                        </div>
                    ))}
                </ReactSortable>
                {
                    isUpLoadingImage && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )
                }
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-blue-900 rounded-sm bg-white shadow-md border border-gray-300">                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>

                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadImages} />
                </label>

            </div>
            <label className="text-blue-900">Product EAN</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={ean}
                    className="flex flex-wrap gap-1"
                    setList={updateEANOrder}>
                    {!!ean?.length && ean.map(link => (
                        <div key={link} className="h-26 rounded-sm border border-gray-300 shadow-md bg-white relative">
                            <button className='bg-red-700 rounded-sm text-white px-1 absolute right-0 opacity-80 hover:opacity-95' onClick={() => removeEAN(link)}>X</button>
                            <div key={link} className="h-24 bg-white p-2 ">
                                <img src={link} alt="" className="rounded-lg" />
                            </div>
                        </div>
                    ))}
                </ReactSortable>
                {
                    isUpLoadingEAN && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )
                }
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-blue-900 rounded-sm border bg-white shadow-md border-gray-300">                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>

                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadEAN} />
                </label>


            </div>
            <label className="text-blue-900">Description</label>
            <textarea placeholder="description"
                value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <label className="text-blue-900">Purchase Price</label>
            <input type="number" placeholder="purchase price"
                value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
            <label className="text-blue-900">Retail Price</label>
            <input type="number" placeholder="retail price"
                value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} required />
            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
};