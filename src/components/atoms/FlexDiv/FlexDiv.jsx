/* eslint-disable react/prop-types */
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  justify-content: ${({ justify }) => (justify ? justify : '')};
  align-items: ${({ align }) => (align ? align : '')};
  background-color: ${({ background }) => (background ? background : '')};
  margin: ${({ margin }) => (margin ? margin : '20px')};
  padding: ${({ padding }) => (padding ? padding : '')};
  border-radius: 10px;
`;

const FlexDiv = ({ justify, align, background, padding, margin, children }) => {
  return (
    <StyledDiv
      justify={justify}
      align={align}
      background={background}
      padding={padding}
      margin={margin}
    >
      {children}
    </StyledDiv>
  );
};

export default FlexDiv;
