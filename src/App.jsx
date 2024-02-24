/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';

import { InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import Button from '@mui/material/Button';
import OTP from './components/molecules/OTP';
import TextField from '@mui/material/TextField';
import Header from './components/molecules/Header';
import FlexDiv from './components/molecules/FlexDiv';
import BillingMonthBlock from './components/atoms/BillingMonthBlock';

import { store } from './config/getClientConfig';

import './App.css';
import BillingTable from './components/molecules/BillingTable';

import { UserContextProvider } from './context/userContext';
import { formatter } from './utils';
import Charges from './components/molecules/Charges/Charges';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const initialCharges = { devices: 0, additional: 0, kickbacks: 0, credits: 0 };
function App() {
  const [rows, setRows] = useState([]);
  const [isAuthenticated, setAuthenticated] = useState(true);
  const userSession = sessionStorage.getItem('userSession');
  const [totalBill, setTotalBill] = useState(0);
  const [charges, setCharges] = useState({ ...initialCharges });
  const [data, setData] = useState('');
  const [mode, setMode] = useState('view');
  const [billingMonth, setBillingMonth] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const isAdmin = !!sessionStorage.getItem('isAdmin');

  const dataObject = {};
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(store, 'billshare'),
        where(documentId(), 'in', ['usersList', 'monthlyBills'])
      );

      const snap = await getDocs(q);

      // const dataObject = {};
      snap.forEach((x) => {
        dataObject[x.id] = x.data() || {};
      });

      const datalist = dataObject.usersList;

      const usersList = Object.keys(datalist)
        .map((x) => datalist[x])
        .filter((x) => x.isActive);
      dataObject.usersList = usersList;

      initialPaint(dataObject);
    };

    fetchData();
  }, []);

  const startAdding = () => {
    setTotalBill(0);
    setMode('edit');
    setTimeout(() => {
      setCharges({ ...initialCharges });
    }, 0);
  };

  const cancelAdding = () => {
    setMode('view');
    repaintTable(selectedMonth);
  };

  const initialPaint = (payload) => {
    const key = Object.keys(payload.monthlyBills)[0];
    const monthlyBill = payload.monthlyBills[key];
    setData(payload);
    setRows(monthlyBill.details);
    setCharges(monthlyBill.details);
    setSelectedMonth(key);
    setTotalBill(monthlyBill.totalBill);
  };

  const repaintTable = (key) => {
    const monthlyBill = data.monthlyBills[key];

    setSelectedMonth(key);
    setTotalBill(monthlyBill.totalBill);
    setRows(monthlyBill.details);
    updateCharges(monthlyBill.details);
  };

  const getChargeableLines = () => {
    const chargeableLines = data.usersList.filter((user) => {
      return !user.isFixed && !user.isFree && user.isActive;
    });

    return chargeableLines?.length || 1;
  };

  const saveBill = async (dataToAdd) => {
    const docRef = doc(store, 'billshare', 'monthlyBills');
    // console.log()
    const monthKey = billingMonth.format('YYYY-M');
    const docData = {
      [monthKey]: {
        totalBill,
        details: [...dataToAdd],
      },
    };

    console.log('Saving record... ', docData);
    await updateDoc(docRef, docData, { merge: true })
      .then(() => {
        console.log('success1');
        setRows([...rows, docData]);
        setSelectedMonth(monthKey);
      })
      .catch(() => {
        console.log('ERROR');
      });
    setMode('view');
  };

  const getRowstoAdd = () => {
    const xx = data.usersList
      .filter((user) => user.isActive && !user.isFree)
      .map(({ id, name }) => ({ id, name }));

    return xx;
  };

  const updateCharges = (r) => {
    const obj = r.reduce(
      (x, y) => {
        x.devices += +(y.devices || 0);
        x.additional += +(y.additional || 0);
        x.kickbacks += +(y.kickbacks || 0);
        x.credits += +(y.credits || 0);

        x.lineCost = (
          (totalBill - x.devices - x.additional + x.kickbacks) /
          getChargeableLines()
        ).toFixed(2);
        return x;
      },
      { ...initialCharges }
    );

    console.log('IC: ', initialCharges);
    setCharges({ ...obj });
  };

  useEffect(() => {
    updateCharges(rows);
  }, [rows]);

  useEffect(() => {
    console.log('Total Bill update...');
  }, [totalBill]);

  if (!data) return null;
  console.log('***  APP  ***');
  return (
    <UserContextProvider value={data}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />

        {isAuthenticated || userSession ? (
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
                  data={data.monthlyBills}
                  mode={mode}
                  callback={repaintTable}
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
                        console.log(newValue, dayjs(newValue));
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
                        console.log('calculating...');
                        setTotalBill(target.value);
                        // updateCharges(rowData);
                      }}
                    />
                  </>
                ) : (
                  <h2>{formatter(totalBill)}</h2>
                )}
              </div>
            </FlexDiv>
            <FlexDiv justify={'space-between'}>
              <BillingTable
                rows={mode === 'edit' ? getRowstoAdd() : rows}
                mode={mode}
                setMode={setMode}
                onSave={saveBill}
                onCancel={cancelAdding}
              />
              <Charges
                totalBill={totalBill}
                charges={charges}
                numberOfLines={getChargeableLines()}
              />
            </FlexDiv>
          </div>
        ) : (
          <OTP setAuthenticated={setAuthenticated} />
        )}
      </LocalizationProvider>
    </UserContextProvider>
  );
}

export default App;
