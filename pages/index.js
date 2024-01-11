import Header from "@/components/Header";
import Banner from "@/components/Banner";
import { mongooseConnect } from "@/lib/mongoose";
import FlashDeal from "@/components/FlashDeal";
import { Product } from "@/models/Product";
import Footer from "@/components/Footer";
import { getSession, useSession } from "next-auth/react";
import BrandBanner from "@/components/BrandBanner";


export default function Home({ newProducts, memberOffers, allProducts }) {
  const session = useSession();
  return (
    <div>
      <Header products={allProducts} />
      <Banner />
      <FlashDeal title={'Sản Phẩm Khuyến Mãi'} products={newProducts} />
      {session?.data?.user?.email && <FlashDeal title={'Ưu Đãi Hội Viên'} products={memberOffers} />}
      <BrandBanner />
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const newProducts = await Product.find({}, null, { limit: 10, sort: { 'updatedAt': -1 } })
  const memberOffers = await Product.find({}, null, { limit: 10, sort: { 'title': -1 } })
  const allProducts = await Product.find({}, null, { sort: { 'title': -1 } })
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      memberOffers: JSON.parse(JSON.stringify(memberOffers)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
    }
  }
}
