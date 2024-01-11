import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
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
export default function CategoriesPage({ category, products, parent, allProducts }) {

    return (
        <>
            <Header products={allProducts} />
            <Center>
                <p className="text-sm py-2 text-gray-700"><Link href={'/categories'}>Danh mục</Link> {'>'} {parent?.name} {parent?.name && '>'} {category.name}</p>
                <div className="bg-white rounded-lg shadow-lg my-4">
                    <div className="p-5">
                        <p className="text-lg font-bold">{category.name}</p>
                        <div>
                            <ProductsGrid>
                                {products.map(product => (
                                    product.category === category._id && (
                                        <div key={product}>
                                            <ProductBox {...product} />
                                        </div>
                                    )
                                ))}
                            </ProductsGrid>
                        </div>
                    </div>
                </div>

            </Center>
            <Footer />
        </>
    )
};

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const category = await Category.findById(id);
    const parent = await Category.findById(category.parent);
    const products = await Product.find({ active: 'Active' }, null, { sort: { '_id': -1 } });
    const allProducts = await Product.find({}, null, { sort: { 'title': -1 } })

    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            products: JSON.parse(JSON.stringify(products)),
            parent: JSON.parse(JSON.stringify(parent)),
            allProducts: JSON.parse(JSON.stringify(allProducts))
        }
    };
};
