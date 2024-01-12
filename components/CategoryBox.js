import Button from "@/components/Button";
import Center from "@/components/Center";
import ProductBox from "@/components/ProductBox";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

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

export default function CategoryBox({ categories, products, name }) {
    const category = categories.find(category => category.name === name);
    const productsInCategory = products.filter(product => product.category === category?._id);
    return (
        <Center>
            <h1 className="font-bold text-lg mt-4">{category?.name}</h1>

            <div className="bg-white rounded-lg shadow-lg my-4">
                <div className="p-5">
                    <div>
                        <ProductsGrid>
                            {productsInCategory
                                .slice(0, 10)
                                .map(product => (
                                    <div key={product}>
                                        <ProductBox {...product} />
                                    </div>
                                ))}
                        </ProductsGrid>
                        <Link href={'/categories/' + category?._id}><Button white className='my-3'>Xem thêm sản phẩm</Button></Link>
                    </div>
                </div>


            </div>
        </Center>

    )
};
