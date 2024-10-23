/* eslint-disable react/prop-types */
import { Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FlexDiv from '../../atoms/FlexDiv';
import { memo, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/userContext';
import {
  currencyFormatter,
  getData,
  monthYearSortComparator,
} from '../../../utils';
import axios from 'axios';

import Splitwise from 'splitwise';
const cellEditValidation = (params) => {
  if (params.hasChanged) {
    const hasError = !Number.parseFloat(+params.props.value);
    return { ...params.props, error: hasError };
  }
};

const additionalColConfig = (mode) => ({
  ...(mode === 'edit' && { editable: true, cellClassName: 'headerBackground' }),
  preProcessEditCellProps: cellEditValidation,
  valueFormatter: ({ value }) => (value ? currencyFormatter(value) : ''),
});

const getColumnConfig = (mode, usersList) => {
  const getNameCell = ({ row }) => {
    const [user] = usersList.filter((x) => x.id === row.id);

    return mode === 'edit' ? (
      <div>
        <Typography>{row.name}</Typography>
        <Typography sx={{ fontSize: '10px' }}>{user.number}</Typography>
      </div>
    ) : (
      <div>
        <Typography title={`${user.number}`}>{row.name}</Typography>
      </div>
    );
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 170,

      renderCell: getNameCell,
    },
    {
      field: 'devices',
      headerName: 'Device Charge',
      ...additionalColConfig(mode),
    },
    {
      field: 'additional',
      headerName: 'Additional Charge',
      ...additionalColConfig(mode),
    },
    {
      field: 'kickbacks',
      headerName: 'Kickback Discount',
      ...additionalColConfig(mode),
    },
    {
      field: 'credits',
      headerName: 'Credit',
      ...additionalColConfig(mode),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      ...(mode === 'edit' && {
        editable: true,
        cellClassName: 'headerBackground',
      }),
    },
  ];

  if (mode !== 'edit') {
    columns.splice(1, 0, {
      field: 'lineCost',
      headerName: 'Line Cost',
      valueFormatter: ({ value }) => (value ? `$ ${value}` : ''),
      valueGetter: (row) => {
        const [user] = usersList.filter((x) => x.id === row.id);
        return user?.isFixed ? null : row.value;
      },
      cellClassName: 'disabledColor',
    });

    columns.push({
      field: 'totalCostPerLine',
      headerName: 'Individual price',
      width: 100,
      valueFormatter: ({ value }) => (value ? currencyFormatter(value) : ''),
      cellClassName: 'justifyEnd',
    });
  }

  return columns;
};

const BillingTable = ({
  mode,
  selectedMonth,
  onSave,
  onCancel,
  updateCharges,
}) => {
  const { usersList, monthlyBills } = useContext(UserContext);

  const isEditable = mode === 'edit';

  const [updatedRows, setUpdatedRows] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const compare = (a, b) => {
    return a.name < b.name ? -1 : 1;
  };

  const SPLITWISE_CONSUMER_KEY = 'FWoRUfxlLgJlAExfB1PjVq2N3VobCOK4sT8gheHD';
  const SPLITWISE_CONSUMER_SECRET = 'VZVMm8Ljrj96ldWVGt9mlq2dpG2LzvKzb75C5z1G';
  const REDIRCT_URL = 'https://vassadi.github.io/mobile-bill-share/';
  // const REDIRCT_URL = 'http://localhost:5173/mobile-bill-share/';

  const exchangeCodeForToken = async (code) => {
    try {
      // const sw = Splitwise({
      //   consumerKey: SPLITWISE_CONSUMER_KEY,
      //   consumerSecret: SPLITWISE_CONSUMER_SECRET,
      //   logger: console.log,
      // });

      // sw.getAccessToken().then(console.log);
      // sw.getCurrentUser().then(console.log);

      // In a real application, this should be done server-side to keep your client secret secure
      // const response = await axios.post(
      //   'https://secure.splitwise.com/oauth/token',
      //   {
      //     client_id: SPLITWISE_CONSUMER_KEY,
      //     client_secret: SPLITWISE_CONSUMER_SECRET,
      //     grant_type: 'authorization_code',
      //     code: code,
      //     redirect_uri: REDIRCT_URL,
      //   },
      //   {
      //     headers: {
      //       'Access-Control-Allow-Origin': window.location.origin,
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   }
      // );

      getData('https://secure.splitwise.com/oauth/token', {
        client_id: SPLITWISE_CONSUMER_KEY,
        client_secret: SPLITWISE_CONSUMER_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRCT_URL,
      });

      getData('https://secure.splitwise.com/oauth/request_token', {
        client_id: SPLITWISE_CONSUMER_KEY,
        client_secret: SPLITWISE_CONSUMER_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRCT_URL,
      });

      getData('https://secure.splitwise.com/oauth/access_token', {
        client_id: SPLITWISE_CONSUMER_KEY,
        client_secret: SPLITWISE_CONSUMER_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRCT_URL,
      });

      // setAccessToken(response.data.access_token);

      const response1 = await axios.get(
        'https://secure.splitwise.com/api/v3.0/get_current_user',
        {
          headers: {
            Authorization: `Bearer `,
          },
        }
      );
      // setUsers([response.data.user]);
      // setLoading(false);
      console.log(response1.data.user);
    } catch (err) {
      // setError('Failed to exchange code for token');
      console.error(err);
    }
  };

  useEffect(() => {
    // Check if there's an access token in the URL (after OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  useEffect(() => {
    console.log(' ***  BILLING TABLE  ***');

    const getRowstoAdd = () => {
      const xx = usersList
        .filter((user) => user.isActive && !user.isFree)
        .map(({ id, name }) => ({ id, name }));

      return xx;
    };

    const key =
      selectedMonth ||
      Object.keys(monthlyBills)?.sort(monthYearSortComparator)?.[0];
    const monthlyBill = monthlyBills[key];
    const rows = isEditable ? getRowstoAdd() : monthlyBill?.details || [];
    const sortedRows = Array.from(rows).sort(compare);

    setUpdatedRows(sortedRows);
  }, [monthlyBills, selectedMonth, isEditable, usersList]);

  const getFooter = () => (
    <FlexDiv justify={'right'} margin="15px 0 0 0">
      {isEditable ? (
        <>
          <Button size="small" className="mr5" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onSave(updatedRows)}
          >
            Save Record
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            console.log('connecting to splitwise api...');
            const clientId = 'FWoRUfxlLgJlAExfB1PjVq2N3VobCOK4sT8gheHD';
            // const redirectUri = 'http://localhost:5173/mobile-bill-share/';
            const authUrl = `https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
              REDIRCT_URL
            )}&state=srv-${Date.now()}`;
            window.location.href = authUrl;
          }}
        >
          Update Splitwise
        </Button>
      )}
    </FlexDiv>
  );

  const columns = getColumnConfig(mode, usersList);
  const slots = { footer: getFooter };
  const initialState = {
    pagination: { paginationModel: { pageSize: 25 } },
  };
  const stopEditCell = (edited, event) => {
    if (edited.reason === 'enterKeyDown' || edited.reason === 'cellFocusOut') {
      const row = edited.row;
      const updatedRow = {
        ...row,
        [edited.field]: event.target?.value || 0,
      };
      const index = updatedRows.findIndex((row) => row.id === edited.id);
      const tempData = [...updatedRows];
      tempData[index] = { ...tempData[index], ...updatedRow };

      setUpdatedRows(tempData);
      updateCharges(tempData);
    }
  };

  return (
    <DataGrid
      className="data-grid basis-3/4"
      rows={updatedRows}
      columns={columns}
      rowHeight={mode === 'edit' ? 55 : 45}
      pageSizeOptions={[]}
      initialState={initialState}
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'break-spaces',
          lineHeight: 1.3,
        },
      }}
      slots={slots}
      hideFooterSelectedRowCount
      experimentalFeatures={{ newEditingApi: true }}
      onCellEditStop={stopEditCell}
    />
  );
};

const MemoizedBillingTable = memo(BillingTable);

export default MemoizedBillingTable;
