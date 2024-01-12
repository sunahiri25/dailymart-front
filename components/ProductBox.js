import styled from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { CartContext } from "./CartContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "./StoreContext";

const ProductWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
padding: 5px;
border-radius: 5px;
border: 1px solid #ddd;
background-color: #F2F4F4;
font-size: 0.9rem;
box-shadow: 0 0 1px 0;
&:hover {
    border: 1px solid #F93F4A;
    box-shadow: 0 0 2px 0 #F93F4A;
  }
height: 100%;
`

const WhiteBox = styled(Link)`
background-color: #fff;
padding: 15px;
height: 140px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 5px;
img {
    max-width: 50%;
}
@media screen and (min-width: 768px) {
    img {
        max-width: 100%;
        max-height: 125px
    }
  }
`
const Title = styled(Link)`
    font-weight: normal;
    font-size: 0.9rem;
    margin: 0;
`

const ProductInfoBox = styled.div`
margin-top: 10px;
display: flex;
flex-direction: column;
width: 100%;
`

export default function ProductBox({ _id, title, description, purchasePrice, retailPrice, images, category, ean, brand, active, }) {
    const { addToCart } = useContext(CartContext);
    const convertedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(retailPrice);
    const url = `/products/${_id}`;
    const [discount, setDiscount] = useState(null);
    let newPrice = retailPrice;
    let percent = 0;
    const { store } = useContext(StoreContext);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        axios.get('/api/discount?category=' + category)
            .then(res => {
                setDiscount(res.data)
            })
            .catch(err => {
                console.log(err)
            })

    }, []);
    useEffect(() => {
        if (store && _id) {
            axios.get('/api/stock?store=' + store._id + '&product=' + _id)
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
            axios.get('/api/stock?product=' + _id)
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
    }, [store, _id]);

    if (discount && (new Date(discount['start']) - new Date() < 0) && (new Date(discount['end']) - new Date() > 0)) {
        if (discount['unit'] == '%') {
            const maxDiscount = retailPrice * discount['value'] / 100 > discount['max'] ? discount['max'] : retailPrice * discount['value'] / 100;
            newPrice = retailPrice - maxDiscount;
            if (maxDiscount === discount['max']) {
                percent = Math.round(discount['max'] / retailPrice * 100);
            } else {
                percent = discount['value'];
            }
        }
        else {
            newPrice = retailPrice - discount['value'];
            percent = Math.round(discount['value'] / retailPrice * 100);
        }
    }
    return (
        <ProductWrapper>
            <WhiteBox href={url} className="relative">
                <div className="flex items-center justify-center">
                    <img src={images[0]} alt="product" />
                    {
                        percent !== 0 && (
                            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg">
                                - {percent}%
                            </div>
                        )
                    }
                </div>
                <div>

                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url} className="line-clamp-2">{title}</Title>
                <div className="flex items-center gap-4">
                    <p className="text-red-600 font-bold my-2">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newPrice)}</p>
                    {discount && percent !== 0 && (
                        <p className="text-gray-500 line-through my-3 text-sm">{convertedPrice}</p>
                    )
                    }
                </div>
                <Button inline onClick={() => addToCart(_id, quantity)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Thêm vào giỏ
                </Button>
            </ProductInfoBox>
        </ProductWrapper>
    );
}
