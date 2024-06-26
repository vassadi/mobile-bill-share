/* eslint-disable react/prop-types */
import { Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FlexDiv from '../../atoms/FlexDiv';
import { memo, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/userContext';
import { currencyFormatter, monthYearSortComparator } from '../../../utils';

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
      {...(isEditable && { slots: slots })}
      hideFooterSelectedRowCount
      experimentalFeatures={{ newEditingApi: true }}
      onCellEditStop={stopEditCell}
    />
  );
};

const MemoizedBillingTable = memo(BillingTable);

export default MemoizedBillingTable;
