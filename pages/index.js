import Header from "@/components/Header";
import Banner from "@/components/Banner";
import { mongooseConnect } from "@/lib/mongoose";
import FlashDeal from "@/components/FlashDeal";
import { Product } from "@/models/Product";
import Footer from "@/components/Footer";
import { getSession, useSession } from "next-auth/react";
import BrandBanner from "@/components/BrandBanner";
import styled from "styled-components";
import { Category } from "@/models/Category";
import Link from "next/link";
import ProductBox from "@/components/ProductBox";
import Button from "@/components/Button";
import Center from "@/components/Center";

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
export default function Home({ newProducts, memberOffers, allProducts, categories, products }) {
  const session = useSession();
  return (
    <div>
      <Header products={allProducts} />
      <Banner />
      <FlashDeal title={'Sản Phẩm Khuyến Mãi'} products={newProducts} />
      {session?.data?.user?.email && <FlashDeal title={'Ưu Đãi Hội Viên'} products={memberOffers} />}
      <Center>
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
      <BrandBanner />
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const newProducts = await Product.find({}, null, { limit: 10, sort: { 'updatedAt': -1 } })
  const memberOffers = await Product.find({}, null, { limit: 10, sort: { 'title': -1 } })
  const allProducts = await Product.find({}, null, { sort: { 'title': -1 } });
  const products = await Product.find({ active: 'Active' }, null, { sort: { '_id': -1 } });
  const categories = await Category.find({}, null);
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      memberOffers: JSON.parse(JSON.stringify(memberOffers)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      categories: JSON.parse(JSON.stringify(categories)),
      products: JSON.parse(JSON.stringify(products)),
    }
  }
}
