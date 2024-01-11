import Center from "./Center";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
};

export default function BrandBanner() {
    return (
        <Center>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-5">
                    <div className="text-3xl font-bold text-orange-700 text-center mb-4">
                        Thương Hiệu Đồng Hành
                    </div>
                    <div className="p-2">
                        <Slider {...settings}>
                            <img src="/brands/coca.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/cp.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/heineken.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/dutch_lady.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/lifebuoy.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/nescafe.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/kinhdo.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/pepsi.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/omo.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/neptune.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/nestle.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/orion.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/tiger.jpg" alt="" className="w-20 p-3" />
                            <img src="/brands/ps.jpg" alt="" className="w-20 p-3" />
                        </Slider>
                    </div>
                </div>

            </div>
        </Center>
    )
}