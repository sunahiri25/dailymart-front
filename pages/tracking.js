import Center from "@/components/Center";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Product } from "@/models/Product";
import axios from "axios";
import { useState } from "react";

export default function TrackingOrder({ allProducts }) {
    const [orderInfo, setOrderInfo] = useState(null);
    function handleTracking(e) {
        e.preventDefault();
        const orderId = e.target[0].value;
        axios.get('/api/orders?id=' + orderId)
            .then(res => {
                setOrderInfo(res.data)
                console.log(res.data)
            })
            .catch(err => {
                setOrderInfo(null)                
            });
    }
    return (
        <>
            <Header products={allProducts} />
            <Center>
                <h1 className="font-bold text-lg mt-4">Theo dõi đơn hàng</h1>
                <div className="bg-white rounded-lg shadow-lg my-4">
                    <div className="p-5">
                        <div>
                            <form onSubmit={handleTracking}>
                                <div className="flex items-center border-b-2 border-red-500 py-2">
                                    <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Nhập mã đơn hàng" aria-label="Full name" />
                                    <button type='submit' className="flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded">
                                        Theo dõi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {orderInfo && (
                    <div className="bg-white rounded-lg shadow-lg my-4">
                        <div className="p-5">
                            <div>
                                <p className='my-2' ><b>Mã đơn hàng:</b> {orderInfo._id}</p>
                                <p className='my-2' ><b>Trạng thái:</b> {orderInfo.processing === 'pending' ? 'Đang chuẩn bị' : 'Đang giao hàng'}</p>

                                <p className='my-2' ><b>Ngày đặt hàng:</b> {new Date(orderInfo.createdAt).toLocaleDateString('vi-VN')}</p>

                                <p className='my-2' ><b>Địa chỉ giao hàng:</b> {orderInfo.address + ', ' + orderInfo.ward + ', ' + orderInfo.district + ', ' + orderInfo.city}</p>
                                <p className='my-2' ><b>Số điện thoại:</b> {orderInfo.phone}</p>
                                <p className='my-2' ><b>Email:</b> {orderInfo.email}</p>
                                <p className='my-2' ><b>Tổng tiền:</b> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.total)}</p>
                                <p className='my-2' ><b>Phương thức thanh toán:</b> {orderInfo.paymentMethod === 'cash' ? 'Tiền mặt' : 'Thẻ Credit'}</p>
                                <p className='my-2' ><b>Danh sách sản phẩm:</b></p>
                                <table className="table-auto w-full border">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Tên sản phẩm</th>
                                            <th className="border px-4 py-2 ">Số lượng</th>
                                            <th className="border px-4 py-2">Giá</th>
                                            <th className="border px-4 py-2">VAT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderInfo.address && orderInfo.line_items.slice(0, orderInfo.line_items.length - 1).map(key => (
                                            <tr key={key}>
                                                <td className="border px-4 py-2">{key.price_data.product_data?.name}</td>
                                                <td className="border px-4 py-2">{key.quantity}</td>
                                                <td className="border px-4 py-2">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(key.price_data.unit_amount)}
                                                </td>
                                                <td className="border px-4 py-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(key.price_data.vat)}</td>
                                            </tr>
                                        ))}
                                        {!orderInfo.address && orderInfo.line_items.slice(0, orderInfo.line_items.length - 1).map(key => (
                                            <tr key={key}>
                                                <td className="border px-4 py-2">{key.price_data.product_data?.name}</td>
                                                <td className="border px-4 py-2">{key.quantity}</td>
                                                <td className="border px-4 py-2">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(key.price_data.unit_amount)}
                                                </td>
                                                <td className="border px-4 py-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(key.price_data.vat)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {orderInfo.address && (
                                    <p className='my-2 mt-4'><b>Phí vận chuyển: </b>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.line_items[orderInfo.line_items.length - 1].price_data.unit_amount)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {!orderInfo && (
                    <div className="bg-white rounded-lg shadow-lg my-4">
                        <div className="p-5">
                            <p className="text-center font-bold">Không tìm thấy đơn hàng</p>
                        </div>
                    </div>
                )}
            </Center>
            {orderInfo ? <Footer /> : <Footer fixed />}
        </>
    )
}
export async function getServerSideProps(context) {
    const allProducts = await Product.find({}, null, { sort: { 'title': -1 } })

    return {
        props: {
            allProducts: JSON.parse(JSON.stringify(allProducts))
        }
    }

}