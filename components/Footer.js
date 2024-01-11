import Link from "next/link";
import styled, { css } from "styled-components";
const Wrapper = styled.div`
display: grid;
grid-template-columns: 0.2fr 0.1fr 0.4fr 0.3fr;
${props => props.fixed && css`
position: fixed;
bottom: 0;
width: 100%;
`}
`;


export default function Footer({ ...rest }) {
    return (
        <Wrapper {...rest} className="bg-gray-700 mt-10 p-5">
            <div>
                <Link href={'/'} className="w-25 p-2 items-center flex">
                    <img src="/logo-white.svg" alt="logo" className="w-full" />
                </Link>
                <p className="text-white text-sm flex items-center justify-center">&copy; 2024 All right reserved</p>
            </div>
            <div></div>
            <div className="text-white flex flex-col justify-center">
                <p>Chăm sóc khách hàng</p>
                <p className="text-sm">Hotline: 123-456-789</p>
                <p className="text-sm">Email: <a href="mailto:cskh@dailymart.com">cskh@dailymart.com</a></p>
            </div>
            <div className="text-white flex flex-col justify-center">
                Kết nối với chúng tôi
                <div className="mt-3 inline-flex gap-3">
                    <a href={'https://facebook.com/'} target="_blank" rel="noopener noreferrer"><img src="/icons/facebook.png" alt="logo" className="w-7" /></a>
                    <a href={'https://youtube.com/'} target="_blank" rel="noopener noreferrer"><img src="/icons/youtube.png" alt="logo" className="w-7" /></a>
                    <a href={'https://zalo.me/'} target="_blank" rel="noopener noreferrer"><img src="/icons/zalo.png" alt="logo" className="w-7" /></a>
                </div>
            </div>
        </Wrapper>
    );
}