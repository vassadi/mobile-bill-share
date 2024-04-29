/* eslint-disable react/prop-types */
import { useContext, useEffect } from 'react';

import { UserContext } from '../../../context/userContext';
import { monthMapper, monthYearSortComparator } from '../../../utils';

import './styles.scss';

const BillingMonthBlock = ({ mode, onUpdate, selectedMonth }) => {
  const { monthlyBills } = useContext(UserContext);

  const months = Object.keys(monthlyBills)
    .sort(monthYearSortComparator)
    .slice(-6);

  useEffect(() => {
    console.log('***  Billing Blcoks  ***');
  }, []);

  return (
    <div className="wrapper">
      {months.map((month) => {
        return (
          <label key={month}>
            <input
              type="radio"
              name="selectedMonthRadio"
              disabled={mode === 'edit'}
              checked={selectedMonth === month}
              onChange={() => {
                onUpdate?.(month);
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
