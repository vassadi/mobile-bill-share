/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useState } from 'react';

import { UserContext } from '../../../context/userContext';

import Button from '@mui/material/Button';
import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';

import { store } from '../../../config/getClientConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

import BillingMonthBlock from '../../atoms/BillingMonthBlock';

import FlexDiv from '../../molecules/FlexDiv';
import Charges from '../../molecules/Charges';
import BillingTable from '../../molecules/BillingTable';

import {
  currencyFormatter,
  getChargesFromRows,
  monthYearSortComparator,
} from '../../../utils';

const initialCharges = { devices: 0, additional: 0, kickbacks: 0, credits: 0 };

const BillingDetails = ({ preSelectedMonth, handleSelectedMonthChange }) => {
  const data = useContext(UserContext);

  const [totalBill, setTotalBill] = useState(0);
  const [chargeableLines, setChargeableLines] = useState(1);
  const [charges, setCharges] = useState({ ...initialCharges });

  const [mode, setMode] = useState('view');
  const [billingMonth, setBillingMonth] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(preSelectedMonth);
  const isAdmin = data.isAdmin;

  const handleModeChange = useCallback((m) => setMode(m), []);

  useEffect(() => {
    setSelectedMonth(preSelectedMonth);
  }, [preSelectedMonth]);
  useEffect(() => {
    const months = Object.keys(data.monthlyBills);
    const key =
      selectedMonth ||
      months?.sort(monthYearSortComparator)?.[months.length - 1];
    const monthlyBill = data.monthlyBills[key] || {};
    setTotalBill(monthlyBill.totalBill || 0);
    setChargeableLines(monthlyBill.chargeableLines);

    if (monthlyBill.details) {
      updateCharges(monthlyBill.details);
    }

    setSelectedMonth(key);
  }, []);

  const startAdding = () => {
    setTotalBill(0);
    setChargeableLines(getChargeableLines());
    handleModeChange('edit');
    setTimeout(() => {
      setCharges({ ...initialCharges });
    }, 0);
  };

  const getChargeableLines = useCallback(() => {
    const chargeableLines = data.usersList.filter((user) => {
      return !user.isFixed && !user.isFree && user.isActive;
    });

    return chargeableLines?.length || 1;
  }, [data.usersList]);

  const updateCharges = (r) => {
    const obj = r?.reduce(
      (x, y) => {
        x.devices += +(y.devices || 0);
        x.additional += +(y.additional || 0);
        x.kickbacks += +(y.kickbacks || 0);
        x.credits += +(y.credits || 0);

        return x;
      },
      { ...initialCharges }
    );

    setCharges({ ...obj });
  };

  const repaintTable = (key) => {
    if (key) {
      const monthlyBill = data.monthlyBills[key];

      setSelectedMonth(key);
      handleSelectedMonthChange(key);
      setTotalBill(monthlyBill.totalBill);
      setChargeableLines(monthlyBill.chargeableLines);

      updateCharges(monthlyBill.details);
    }
  };

  const cancelAdding = () => {
    setMode('view');
    repaintTable(selectedMonth);
  };

  const saveBill = useCallback(
    async (dataToAdd) => {
      const numberOfLines = getChargeableLines();

      const chargesData = getChargesFromRows(dataToAdd, initialCharges);
      const lineCost =
        (totalBill -
          chargesData.devices -
          chargesData.additional +
          chargesData.kickbacks +
          chargesData.credits) /
        numberOfLines;

      dataToAdd.map((row) => {
        console.log(row);

        const [{ isFixed }] = data.usersList.filter(
          (user) => user.name === row.name
        );
        const additionalCharge =
          +(row.devices || 0) +
          +(row.additional || 0) -
          +(row.kickbacks || 0) -
          +(row.credits || 0);

        if (isFixed) {
          row.costPerLine = +additionalCharge.toFixed(2);
        } else {
          row.costPerLine = +(lineCost + additionalCharge).toFixed(2);
        }
      });

      const docRef = doc(
        collection(store, 'groups', data.groupId, 'monthlyBills'),
        'bills'
      );
      const monthKey = billingMonth.format('YYYY-MM');
      const docData = {
        [monthKey]: {
          totalBill: +totalBill,
          chargeableLines: numberOfLines,
          details: [...dataToAdd],
        },
      };

      console.log('Saving record... ', docData);

      // await updateDoc(docRef, docData, { merge: true })
      await setDoc(docRef, docData, { merge: true })
        .then(() => {
          console.log('Successfuly Saved....');
          repaintTable(monthKey);
        })
        .catch((e) => {
          console.log('ERROR', e);
        });
      setMode('view');
    },
    [billingMonth, totalBill, data]
  );

  if (!data) return null;

  return (
    <div className="contentRoot">
      <FlexDiv
        align={'center'}
        justify={'space-between'}
        background={'#fff'}
        padding={'15px'}
      >
        <FlexDiv margin={'5px'}>
          <BillingMonthBlock
            selectedMonth={selectedMonth}
            mode={mode}
            onUpdate={repaintTable}
          />

          {isAdmin && (
            <Button
              className="mr5 plus-sign"
              variant="outlined"
              onClick={() => {
                startAdding();
              }}
            >
              <strong>+</strong>
            </Button>
          )}
        </FlexDiv>
        <div>
          {mode === 'edit' ? (
            <>
              <DatePicker
                label={'Billing moth'}
                views={['month', 'year']}
                value={billingMonth}
                onChange={(newValue) => {
                  setBillingMonth(newValue);
                }}
              />
              <TextField
                id="outlined-basic"
                label="Total bill"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  readOnly: !isAdmin,
                }}
                onBlur={({ target }) => {
                  setTotalBill(target.value);
                }}
              />
            </>
          ) : (
            <h2>{currencyFormatter(totalBill)}</h2>
          )}
        </div>
      </FlexDiv>
      <FlexDiv justify={'space-between'} padding={'0 0 20px 0'}>
        <BillingTable
          // rows={mode === 'edit' ? getRowstoAdd() : rows}
          mode={mode}
          selectedMonth={selectedMonth}
          setMode={handleModeChange}
          onSave={saveBill}
          onCancel={cancelAdding}
          updateCharges={updateCharges}
        />
        <Charges
          totalBill={totalBill}
          charges={charges}
          numberOfLines={chargeableLines}
        />
      </FlexDiv>
    </div>
  );
};

export default BillingDetails;
