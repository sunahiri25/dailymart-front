import styled from "styled-components";
import { useEffect, useState } from "react";

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
  `;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 5px;
`;
const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-grow: 0;
    margin-top: 5px;
    
  `;
const ImageButton = styled.div`
    
    ${props => props.active ? `
    border: 2px solid;
    border-color: #F93F4A;
    ` : `
    border: 1px solid;
    border-color: #ccc;
    `}
    height: 70px;
    padding: 2px;
    cursor: pointer;
    border-radius: 5px;
  `;
const BigImageWrapper = styled.div`
  text-align: center;
`;

export default function ProductImages({ images }) {
    const [activeImage, setActiveImage] = useState(images?.[0]);
    useEffect(() => {
        setActiveImage(images?.[0]);
    }, [images]);

    return (
        <div>
            <BigImageWrapper>
                <BigImage src={activeImage} />
            </BigImageWrapper>
            <ImageButtons>
                {images.map(image => (
                    <ImageButton
                        key={image}
                        active={image === activeImage}
                        onClick={() => setActiveImage(image)}>
                        <Image src={image} alt="" />
                    </ImageButton>
                ))}
            </ImageButtons>
        </div>
    );
}