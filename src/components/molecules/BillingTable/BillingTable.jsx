/* eslint-disable react/prop-types */
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FlexDiv from '../FlexDiv';
import { memo, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/userContext';
import { monthYearSortComparator } from '../../../utils';

const cellEditValidation = (params) => {
  if (params.hasChanged) {
    const hasError = !Number.parseFloat(+params.props.value);
    return { ...params.props, error: hasError };
  }
};

const additionalColConfig = (mode) => ({
  ...(mode === 'edit' && { editable: true, cellClassName: 'headerBackground' }),
  preProcessEditCellProps: cellEditValidation,
  valueFormatter: ({ value }) => (value ? `$ ${value}` : ''),
});

const getColumnConfig = (mode) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 170,
      // headerClassName: 'headerBackground',
      // cellClassName: 'headerBackground',
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
      ...(mode === 'edit' && { editable: true }),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 170,
      ...(mode === 'edit' && { editable: true }),
    },
    {
      field: 'costPerLine',
      headerName: 'Individual price',
      width: 150,
      valueFormatter: ({ value }) => (value ? `$ ${value}` : ''),
    },
  ];

  columns.map((c) => {
    c.headerClassName = 'headerBackground1';
  });
  return columns;
};

// eslint-disable-next-line react/prop-types, react/display-name
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

  const compare = (a, b) => {
    return a.name < b.name ? -1 : 1;
  };
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
    </FlexDiv>
  );

  const columns = getColumnConfig(mode);
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
      className="data-grid"
      rows={updatedRows}
      columns={columns}
      rowHeight={35}
      pageSizeOptions={[25, 50, 75, 100]}
      initialState={initialState}
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'break-spaces',
          lineHeight: 1.3,
        },
      }}
      {...(isEditable && { slots: slots })}
      hideFooterSelectedRowCount
      experimentalFeatures={{ newEditingApi: true }}
      onCellEditStop={stopEditCell}
    />
  );
};

const MemoizedBillingTable = memo(BillingTable);

export default MemoizedBillingTable;
