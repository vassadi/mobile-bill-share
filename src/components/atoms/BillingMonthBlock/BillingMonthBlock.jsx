/* eslint-disable react/prop-types */
import { monthMapper } from '../../../utils';

import './styles.scss';

export const BillingMonthBlock = ({
  data = {},
  mode,
  callback,
  selectedMonth,
}) => {
  return (
    <div className="wrapper">
      {Object.keys(data).map((month) => {
        return (
          <label key={month}>
            <input
              type="radio"
              name="selectedMonthRadio"
              disabled={mode === 'edit'}
              checked={selectedMonth === month}
              onChange={() => {
                callback(month);
              }}
            />
            <div className="box">
              <strong>{monthMapper(month)}</strong>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default BillingMonthBlock;
