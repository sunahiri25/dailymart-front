import styled, { css } from "styled-components"

export const ButtonStyle = css`
background-color: #F93F4A;
color: #fff;
border: 0;
padding: 5px 20px;
border-radius: 5px;
cursor: pointer;
display: inline-flex;
align-items: center;
justify-content: center;
gap: 3px;
${props => props.block && css`
display: block;
width: 100%;
`}
${props => props.inline && css`
display: inline-flex;
gap: 3px;
width: 100%;
`}
${props => props.outline && css`
display: inline-flex;
gap: 3px;
`}
${props => props.white && css`
background-color: #fff;
color: #F93F4A;
border: 1px solid #F93F4A;

`}
`
const StyledButton = styled.button`
${ButtonStyle}
`
export default function Button({ children, ...rest }) {
    return (
        <StyledButton {...rest}>{children}</StyledButton>
    )
}