/* eslint-disable react/prop-types */
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: ${({ stacked }) => (stacked ? 'column' : 'row')};
  justify-content: ${({ justify }) => (justify ? justify : 'space-between')};
  align-items: ${({ align }) => (align ? align : '')};
  .key {
    font-size: ${({ stacked }) => (stacked ? '10px' : '14px')};
  }
  .value {
    font-size: 14px;
  }
  margin-bottom: 10px;
  ${({ hightlight }) =>
    hightlight
      ? 'background-color: lightgoldenrodyellow;font-weight: bold;padding: 5px'
      : ''}
`;

const KeyValueText = ({ keyValue = [], stacked, justify, hightlight }) => {
  const [key = '', value = ''] = keyValue;
  return (
    <StyledDiv stacked={stacked} justify={justify} hightlight={hightlight}>
      <div className="key">{key}</div>
      <div className="value">{value}</div>
    </StyledDiv>
  );
};

export default KeyValueText;
