import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import ProductImages from "@/components/ProductImages";
import { mongooseConnect } from "@/lib/mongoose";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { StoreContext } from "@/components/StoreContext";

const ProductsGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 15px;
padding-top: 10px;
@media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
`

const ColWrapper = styled.div`
display: grid;
grid-template-columns: 1fr;
@media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
gap: 40px;
margin-top: 20px;
`;

const Box = styled.div`
background-color: #fff;
border-radius: 10px;
padding: 20px;

`;


export default function ProductPage({ product, brand, category, products }) {
    const { addToCart } = useContext(CartContext);
    const [discount, setDiscount] = useState(null);
    let newPrice = product.retailPrice;
    let percent = 0;
    const { store } = useContext(StoreContext);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        axios.get('/api/discount?category=' + product.category)
            .then(res => {
                setDiscount(res.data)
            })
            .catch(err => {
                console.log(err)
            });
    }, []);
    useEffect(() => {
        if (store && product) {
            axios.get('/api/stock?store=' + store._id + '&product=' + product._id)
                .then(res => {
                    if (res.data) {
                        setQuantity(res.data.quantity)
                    } else {
                        setQuantity(0)
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        } else {
            axios.get('/api/stock?product=' + product._id)
                .then(res => {
                    if (res.data?.length > 0) {
                        let q = 0;
                        res.data.map(s => {
                            q += s.quantity
                        })
                        setQuantity(q)
                    } else {
                        setQuantity(0)
                    };
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }, [store, product]);

    if (discount && (new Date(discount['start']) - new Date() < 0) && (new Date(discount['end']) - new Date() > 0)) {
        if (discount['unit'] == '%') {
            const maxDiscount = product.retailPrice * discount['value'] / 100 > discount['max'] ? discount['max'] : product.retailPrice * discount['value'] / 100;
            newPrice = product.retailPrice - maxDiscount;
            if (maxDiscount === discount['max']) {
                percent = Math.round(discount['max'] / product.retailPrice * 100);
            } else {
                percent = discount['value'];
            }
        }
        else {
            newPrice = product.retailPrice - discount['value'];
            percent = Math.round(discount['value'] / product.retailPrice * 100);
        }
    }
    return (
        <>
            <Header products={products} />
            <Center>
                <p className="text-sm py-2 text-gray-700"><Link href={'/'}>Trang chủ</Link> {'>'} {product.title}</p>
                <ColWrapper>
                    <Box className="flex items-center justify-center shadow-md h-min">
                        <ProductImages images={product.images} />
                    </Box>
                    <Box className="shadow-md h-min">
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <div className="flex gap-10 items-center">
                            <p className="text-red-500 font-bold text-xl mt-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newPrice)}</p>
                            {percent > 0 && (<p className="w-fit border border-red-500 text-red-500 bg-white py-1 px-2 rounded">- {percent}%</p>)}
                        </div>
                        {percent > 0 && (
                            <p className="text-gray-500 mt-2 line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.retailPrice)}</p>
                        )}
                        {product.active === 'Active' && quantity > 0 && (
                            <p className="text-green-500 mt-2">Còn hàng</p>

                        )}
                        {product.active === 'Inactive' || quantity === 0 && (
                            <p className="text-red-500 mt-2">Hết hàng</p>
                        )}
                        <p className="mt-2 text-gray-600 text-sm">Miễn phí giao hàng cho đơn từ 300.000đ. <br />
                            Giao hàng trong 2 giờ.</p>

                        {product.active === 'Active' && quantity > 0 && (
                            <div className="my-3">
                                <Button outline onClick={() => addToCart(product._id, quantity)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>

                                    Thêm vào giỏ
                                </Button>
                            </div>
                        )}
                        <p className="font-bold mt-2">Mô tả</p>
                        <p>{product.description}</p>
                        <p className="font-bold mt-2">Thương hiệu: <span className="font-normal">{brand?.name ? brand.name : 'No brand'}</span></p>
                    </Box>
                </ColWrapper>
                <p className="font-bold mt-4 text-xl">Sản phẩm liên quan</p>
                <div className="bg-white rounded-lg shadow-lg my-4">
                    <div className="p-5">
                        <div>
                            <ProductsGrid>
                                {products?.length > 0 && products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 5).map(p => (
                                    <div key={p._id}>
                                        <ProductBox {...p} />
                                    </div>
                                ))}
                            </ProductsGrid>
                        </div>
                    </div>
                </div>
            </Center >
            <Footer />

        </>
    )
};

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    const brand = await Brand.findById(product?.brand);
    const category = await Category.findById(product?.category);
    const products = await Product.find({}, null, { sort: { '_id': -1 } });

    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            brand: JSON.parse(JSON.stringify(brand)),
            category: JSON.parse(JSON.stringify(category)),
            products: JSON.parse(JSON.stringify(products)),
        },
    };
};


