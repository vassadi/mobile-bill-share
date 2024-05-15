/* eslint-disable react/prop-types */
import styled from 'styled-components';

const CustomDiv = styled.div`
  background-color: ${({ background }) => (background ? background : '#fff')};
  margin: ${({ margin }) => (margin ? margin : '20px')};
  padding: ${({ padding }) => (padding ? padding : '20px')};
  border-radius: 10px;
`;

const StyledDiv = ({ background, padding, margin, children }) => {
  return (
    <CustomDiv background={background} padding={padding} margin={margin}>
      {children}
    </CustomDiv>
  );
};

export default StyledDiv;
