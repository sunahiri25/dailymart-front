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
import CategoryBox from "@/components/CategoryBox";

export default function Home({ newProducts, memberOffers, allProducts, categories, products }) {
  const session = useSession();

  return (
    <div>
      <Header products={allProducts} />
      <Banner />
      <FlashDeal title={'Sản Phẩm Khuyến Mãi'} products={newProducts} />
      {session?.data?.user?.email && <FlashDeal title={'Ưu Đãi Hội Viên'} products={memberOffers} />}
      <CategoryBox categories={categories} products={products} name={'Thịt'} />

      <CategoryBox categories={categories} products={products} name={'Rau Lá'} />
      <CategoryBox categories={categories} products={products} name={'Trái cây tươi'} />
      <CategoryBox categories={categories} products={products} name={'Củ, Quả'} />
      <BrandBanner />
      <CategoryBox categories={categories} products={products} name={'Kẹo - Chocolate'} />
      <CategoryBox categories={categories} products={products} name={'Bánh Snack'} />
      <CategoryBox categories={categories} products={products} name={'Bánh Xốp - Bánh Quy'} />
      <CategoryBox categories={categories} products={products} name={'Nước ngọt'} />
      <CategoryBox categories={categories} products={products} name={'Cà phê'} />
      <CategoryBox categories={categories} products={products} name={'Nước khoáng'} />
      <CategoryBox categories={categories} products={products} name={'Trà - Các loại khác'} />
      <CategoryBox categories={categories} products={products} name={'Sữa Tươi'} />
      <CategoryBox categories={categories} products={products} name={'Sữa Hạt - Sữa Đậu'} />
      <CategoryBox categories={categories} products={products} name={'Sữa Chua - Váng Sữa'} />
      <CategoryBox categories={categories} products={products} name={'Bơ Sữa - Phô Mai'} />
      <CategoryBox categories={categories} products={products} name={'Bia'} />
      <CategoryBox categories={categories} products={products} name={'Chăm Sóc Tóc'} />
      <CategoryBox categories={categories} products={products} name={'Chăm Sóc Da'} />
      <CategoryBox categories={categories} products={products} name={'Chăm Sóc Răng Miệng'} />
      <CategoryBox categories={categories} products={products} name={'Chăm Sóc Phụ Nữ'} />
      <CategoryBox categories={categories} products={products} name={'Mỹ Phẩm'} />
      <CategoryBox categories={categories} products={products} name={'Nước Rửa Chén'} />
      <CategoryBox categories={categories} products={products} name={'Nước Giặt'} />
      <CategoryBox categories={categories} products={products} name={'Nước Xả'} />
      <CategoryBox categories={categories} products={products} name={'Nước Lau Sàn - Lau Kính'} />
      <CategoryBox categories={categories} products={products} name={'Văn phòng phẩm'} />
      <CategoryBox categories={categories} products={products} name={'Đồ chơi'} />
      <CategoryBox categories={categories} products={products} name={'Thiết bị bếp'} />
      <CategoryBox categories={categories} products={products} name={'Thiết bị sinh hoạt'} />



      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const newProducts = await Product.aggregate([{ $match: { active: 'Active' } }, { $sample: { size: 10 } }]);
  const memberOffers = await Product.aggregate([{ $match: { active: 'Active' } }, { $sample: { size: 10 } }]);
  const allProducts = await Product.find({}, null, { sort: { 'title': -1 } });
  const categories = await Category.find({}, null);
  const products = await Product.find({ active: 'Active' }, null, { sort: { '_id': -1 } });
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
