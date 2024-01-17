import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";
import { useContext, useEffect, useState } from "react";
import BarsIcon from "./icons/Bars";
import Button from "./Button";
import { getSession, signOut, useSession } from "next-auth/react";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { StoreContext } from "./StoreContext";
import { LocationContext } from "./LocationContext";
import axios from "axios";

const StyledHeader = styled.header`
background-color: #F93F4A;

`;

const Wrapper = styled.div`
display: flex;
justify-content: space-between;
padding: 5px 0;
align-items: center;
`
const NavLink = styled(Link)`
color: #fff;
display: block;
text-decoration: none;
@media screen and (min-width: 768px) {
    padding:0;
  }
`
const StyledNav = styled.nav`
${props => props.mobileNavActive ? `
display: block;
` : `
display: none;
`}
position: fixed;
z-index: 1;
gap: 15px;
top: 0;
bottom: 0;
left: 0;
right: 0;
padding: 70px 20px 20px;
background-color: #F93F4A;
@media screen and (min-width: 768px) {
display: flex;
padding: 0;
position: static;
justify-content: center;
align-items: center;
}
`
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border:0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 1;
  @media screen and (min-width: 768px) {
    display: none;
    position: static;
  }
`;
function AuthLinks({ status }) {
    if (status === 'authenticated') {
        return (
            <>
                <Link href={'/profile'} className="whitespace-nowrap text-white">
                    <div className="flex gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        Tài khoản
                    </div>
                </Link>
                <div>
                    <Button white
                        onClick={() => signOut()}
                    > Đăng xuất
                    </Button>
                </div>
            </>
        );
    }
    if (status === 'unauthenticated') {
        return (
            <>
                <NavLink href={'/login'}>Đăng nhập</NavLink>
                <NavLink href={'/register'}><Button white>Đăng ký</Button></NavLink>
            </>
        );
    }

}

export default function Header({ products }) {
    const { cart } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const session = useSession();
    const status = session?.status;
    const userData = session?.data?.user;
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isShowStore, setShowStore] = useState(false);
    const { store, setStore, clearStore } = useContext(StoreContext);
    const { userLocation, setUserLocation } = useContext(LocationContext);
    const [userAddress, setUserAddress] = useState(null);
    const [stores, setStores] = useState([]);
    const [storeDistance, setStoreDistance] = useState({});
    useEffect(() => {
        if (search == '') {
            setSearchResult([]);
        }
        if (products?.length > 0 && search) {
            const searchResult = products.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
            setSearchResult(searchResult);
        }
    }, [search]);

    useEffect(() => {
        const res = axios.get('/api/stores');
        res.then(res => {
            setStores(res.data);
        })
    }, []);

    function showStore() {
        setShowStore(prev => !prev);
    }
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };
    function getUserAddress() {
        const accessToken = "pk.eyJ1Ijoic3VuYWhpcmkiLCJhIjoiY2xwMnhsaWw2MHN0azJqanphNDdtdmhxeCJ9.WRr7JxgBv7eD_E_kA9CFfg";
        const baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        const latitude = userLocation.latitude;
        const longitude = userLocation.longitude;
        const url = `${baseUrl}${longitude},${latitude}.json?access_token=${accessToken}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const address = data.features[0].place_name;
                setUserAddress(address);
            })
            .catch(err => console.log(err));
    }
    useEffect(() => {
        if (userLocation) {
            getUserAddress();
        }
    }, [userLocation]);
    useEffect(() => {
        const accessToken = "pk.eyJ1Ijoic3VuYWhpcmkiLCJhIjoiY2xwMnhsaWw2MHN0azJqanphNDdtdmhxeCJ9.WRr7JxgBv7eD_E_kA9CFfg";
        const baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        const directionBaseUrl = "https://api.mapbox.com/directions/v5/mapbox/cycling/";
        const destination = `${userLocation.longitude},${userLocation.latitude}`;
        if (stores?.length > 0 && userLocation) {
            for (let i = 0; i < stores.length; i++) {
                const storeAddress = stores[i].address;
                const url = `${baseUrl}${storeAddress}.json?access_token=${accessToken}`;
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features?.length > 0) {
                            const coordinates = data.features[0].geometry.coordinates;
                            const latitude = coordinates[1];
                            const longitude = coordinates[0];
                            const origin = `${longitude},${latitude}`;
                            const directionUrl = `${directionBaseUrl}${origin};${destination}?access_token=${accessToken}`;
                            fetch(directionUrl)
                                .then((res) => res.json())
                                .then((d) => {
                                    const dis = d.routes[0].distance / 1000;
                                    setStoreDistance(prev => ({ ...prev, [storeAddress]: dis.toFixed(2) }));
                                })
                                .catch((e) => {
                                    console.log(e);
                                });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }

    }, [userLocation, stores]);

    return (
        <StyledHeader className="relative">
            <Center>
                <Wrapper>
                    <Link className="relative z-10" href={'/'}>
                        <img src="/logo-white.svg" alt="DailyMart" style={{ width: "150px" }} />
                    </Link>
                    <div className="pt-1 flex gap-2">
                        <input type="text" placeholder="&#x2315; Tìm kiếm" className="outline-none w-50"
                            value={search} onChange={e => setSearch(e.target.value)} />
                        {searchResult.length > 0 && (
                            <div className="absolute z-50 rounded border bg-white top-14">
                                {searchResult.slice(0, 5).map(product => (
                                    <div key={product._id} className="w-52">
                                        <div key={product._id} className="p-2 border-b border-gray-300 rounded bg-white">
                                            <Link href={`/products/${product._id}`}>
                                                <span className='text-gray-500'>&#x2315;</span> {product.title}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                    <div className="-mr-10">
                        <Button onClick={showStore}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            Cửa hàng
                        </Button>

                    </div>

                    <StyledNav mobileNavActive={mobileNavActive}>
                        <NavLink href={'/categories'}>
                            <div className="flex gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                </svg>
                                Danh mục
                            </div>
                        </NavLink>
                        <NavLink href={'/cart'}>
                            <div className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                ({cart.length})
                            </div>
                        </NavLink>
                        <AuthLinks status={status}/>                    </StyledNav>
                    <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                        <BarsIcon />
                    </NavButton>
                    {isShowStore && (

                        <div className="absolute z-10 bg-gray-100 border rounded shadow-3xl p-4 w-1/2 ml-36 top-20 text-sm">
                            <div>
                                <button onClick={e => setShowStore(false)} className="float-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <Button white onClick={clearStore} className='float-left'>Xóa</Button>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-center text-gray-600 capitalize mb-2 ">Chọn cửa hàng</h1>
                                <p className="text-center text-gray-500 mb-4">Cho phép hệ thống truy cập địa chỉ từ thiết bị và đề xuất cửa hàng gần nhất</p>
                                {userLocation ? (
                                    <div className="block items-center gap-2 mb-4 md:flex sm:flex">
                                        <p className="text-gray-500">Địa chỉ: {userAddress} </p>
                                        <button onClick={getUserLocation} className="flex items-center gap-1 p-2 text-white  bg-red-600 rounded-md hover:bg-red-500 ">
                                            <span>Vị trí của tôi</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center gap-2 mb-4">
                                        <button onClick={getUserLocation} className="flex items-center gap-1 p-2 text-white bg-red-600 rounded-md hover:bg-red-500 ">
                                            <span>Vị trí của tôi</span>
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    {stores?.length > 0 &&
                                        stores
                                            .sort((a, b) => storeDistance[a.address] - storeDistance[b.address])
                                            .map((s) => (
                                                <button key={s} onClick={(e) => setStore(s)}>
                                                    <div className="px-8 py-2 mx-auto border bg-white cursor-pointer rounded text-left flex items-center gap-1">
                                                        {store._id == s._id ? (
                                                            <div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 sm:h-9 sm:w-9" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 sm:h-9 sm:w-9" viewBox="0 0 20 20" fill="currentColor"                                                               >
                                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold">{s.name}</p>
                                                            <p>Địa chỉ: {s.address}</p>
                                                            <p>Số điện thoại: {s.phone}</p>
                                                            {userLocation && (
                                                                <p>Khoảng cách: {storeDistance[s.address]} km</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}

                                    <div className="flex justify-center">
                                        <button className="px-8 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500 focus:ring focus:ring-red-300 focus:ring-opacity-80" onClick={e => setShowStore(false)}>
                                            Xác nhận
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Wrapper>
            </Center>
        </StyledHeader>

    )
};
