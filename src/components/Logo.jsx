import styled from "styled-components";

function  Logo(){

    return(
        <Wrapper>
             <Img src='KwLogo.png' alt="Logo" />
        </Wrapper>
    )
}
export default Logo;

const Wrapper = styled.div`

`
const Img = styled.img`
    width:170px;
    height:50px;
    padding: 15px;
    padding-left: 50px;
`