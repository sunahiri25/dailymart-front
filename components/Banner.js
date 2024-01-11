import styled from "styled-components";
import Center from "./Center";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";


var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,

};


const Wrapper = styled.div`
    padding: 10px 40px 30px 40px;
    background-color: #F93F4A;
    
 `

const StyledBanner = styled.img`
    width: 100%;
    height: auto;
    border-radius: 2px;
    
`

export default function Banner() {
    return (
        <Wrapper>
            <Center>
                <Slider {...settings}>
                    <Link href='/'>
                        <StyledBanner src="/banner5.jpg" alt="Banner 5" />
                    </Link>
                    <Link href='/'>
                        <StyledBanner src="/banner1.jpg" alt="Banner 1" />
                    </Link>
                    <Link href={'/'}>
                        <StyledBanner src="/banner2.jpg" alt="Banner 2" />
                    </Link>
                    <Link href='/'>
                        <StyledBanner src="/banner3.png" alt="Banner 3" />
                    </Link>
                    <Link href='/'>
                        <StyledBanner src="/banner4.jpg" alt="Banner 4" />
                    </Link>
                    <Link href='/'>
                        <StyledBanner src="/banner6.jpg" alt="Banner 6" />
                    </Link>
                </Slider>

            </Center>
        </Wrapper>


    )
}