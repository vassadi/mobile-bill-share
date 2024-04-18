/* eslint-disable react/prop-types */
import styled, { css } from 'styled-components';

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
  ${({ highlight }) =>
    highlight &&
    css`
      background-color: lightgoldenrodyellow;
      font-weight: bold;
      padding: 10px 0;
    `}
`;

const KeyValueText = ({ keyValue = [], stacked, justify, highlight }) => {
  const [key = '', value = ''] = keyValue;
  return (
    <StyledDiv stacked={stacked} justify={justify} highlight={highlight}>
      <div className="key">{key}</div>
      <div className="value">{value}</div>
    </StyledDiv>
  );
};

export default KeyValueText;
