import Button from "@/components/Button";
import Center from "@/components/Center";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
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

export default function CategoryPage({ categories, products, allProducts }) {
    return (
        <>
            <Header products={allProducts} />
            <Center>
                <p className="text-2xl font-bold mt-5">Danh mục</p>
                <div className="mt-5">
                    {categories?.length > 0 && categories.map(category =>
                    (
                        !category.parent && (
                            <div key={category} className="bg-white rounded-lg shadow-lg my-4">
                                <div className="p-5">
                                    <p className="text-lg font-bold">{category.name}</p>
                                    <div>
                                        {categories.map(subCategory => (
                                            subCategory.parent === category._id && (
                                                <div key={subCategory}>
                                                    <Link className="font-bold text-gray-600" href={'/categories/' + subCategory._id}>{subCategory.name}</Link>
                                                    <ProductsGrid>
                                                        {products
                                                            .filter(product => product.category === subCategory._id)
                                                            .slice(0, 5)
                                                            .map(product => (
                                                                <div key={product}>
                                                                    <ProductBox {...product} />
                                                                </div>
                                                            ))}
                                                    </ProductsGrid>
                                                    <Link href={'/categories/' + subCategory._id}><Button white className='my-3'>Xem thêm sản phẩm</Button></Link>

                                                </div>
                                            )))}
                                    </div>
                                </div>
                            </div>
                        )
                    )
                    )}
                </div>
            </Center>
            <Footer />
        </>
    )
};

export async function getServerSideProps() {
    await mongooseConnect();
    const categories = await Category.find({}, null, { sort: { 'name': -1 } });
    const products = await Product.find({ active: 'Active' }, null, { sort: { '_id': -1 } });
    const allProducts = await Product.find({}, null, { sort: { 'title': -1 } })

    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories)),
            products: JSON.parse(JSON.stringify(products)),
            allProducts: JSON.parse(JSON.stringify(allProducts))
        }
    };
}