import Header from "@/components/Header";
import Banner from "@/components/Banner";
import { mongooseConnect } from "@/lib/mongoose";
import FlashDeal from "@/components/FlashDeal";
import { Product } from "@/models/Product";
import Footer from "@/components/Footer";
import { getSession, useSession } from "next-auth/react";
import BrandBanner from "@/components/BrandBanner";
import { Category } from "@/models/Category";
import CategoryBox from "@/components/CategoryBox";
import { useEffect } from "react";
import Link from "next/link";

export default function Home({ newProducts, categories, products }) {
  // const session = useSession();
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (session?.data?.user?.role === 'admin') {
  //       window.location.href = "/admin"
  //     }
  //     if (session?.data?.user?.role === 'staff') {
  //       window.location.href = "/staff"
  //     }
  //   }
  // }, [session]);
  return (
    <div>
      <Header products={products} />
      <Banner />
      <Link href='/tracking'>
        <div className="float-right bg-gray-500 rounded flex items-center flex-col justify-center text-white m-2 p-2 text-xs" title="Tra cứu đơn hàng">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>

        </div>
      </Link>
      <FlashDeal title={'Sản Phẩm Khuyến Mãi'} products={newProducts} />
      {/* {session?.data?.user?.email && <FlashDeal title={'Ưu Đãi Hội Viên'} products={memberOffers} />} */}
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
  const session = await getSession(context);

  if (session?.user?.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    }
  }
  if (session?.user?.role === 'staff') {
    return {
      redirect: {
        destination: '/staff',
        permanent: false,
      },
    }
  }
  // const memberOffers = await Product.aggregate([{ $match: { active: 'Active' } }, { $sample: { size: 10 } }]);  
  const categories = await Category.find({}, null);
  const products = await Product.find({ active: 'Active' }, null, { sort: { '_id': -1 } });
  const newProducts = products.sort(() => Math.random() - 0.5).slice(0, 10);


  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      // memberOffers: JSON.parse(JSON.stringify(memberOffers)),
      categories: JSON.parse(JSON.stringify(categories)),
      products: JSON.parse(JSON.stringify(products)),
    }
  }
}
