import styled from "styled-components"
import Center from "./Center"
import ProductBox from "./ProductBox"

const ProductsGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 15px;
padding-top: 20px;
@media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

`

export default function FlashDeal({ products, title }) {
    return (
        <Center>
            <h1 className="font-bold text-lg mt-4">{title}</h1>

            <div className="bg-white rounded-lg shadow-lg my-4 p-5">
                <ProductsGrid>
                    {products?.length > 0 && products.map((product, index) => (
                        <ProductBox key={index} {...product} />
                    ))}
                </ProductsGrid>
            </div>

        </Center>
    )
}