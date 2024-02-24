/* eslint-disable react/prop-types */
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FlexDiv from '../FlexDiv';
import { memo, useEffect, useState } from 'react';

const cellEditValidation = (params) => {
  if (params.hasChanged) {
    const hasError = !Number.parseFloat(+params.props.value);
    return { ...params.props, error: hasError };
  }
};

const additionalColConfig = (mode) => ({
  ...(mode === 'edit' && { editable: true }),
  preProcessEditCellProps: cellEditValidation,
  valueFormatter: ({ value }) => (value ? `$${value}` : ''),
});

const getColumnConfig = (mode) => {
  const columns = [
    { field: 'name', headerName: 'Name', width: 175 },
    { field: 'lineCost', headerName: 'Line Cost', w: 100 },
    {
      field: 'devices',
      headerName: 'Device Charge',
      w: 120,
      ...additionalColConfig(mode),
    },
    {
      field: 'additional',
      headerName: 'Additional Charge',
      w: 150,
      ...additionalColConfig(mode),
    },
    {
      field: 'kickbacks',
      headerName: 'Kickback Discount',
      w: 100,
      ...additionalColConfig(mode),
    },
    {
      field: 'credits',
      headerName: 'Credit',
      w: 100,
      ...(mode === 'edit' && { editable: true }),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 150,
      ...(mode === 'edit' && { editable: true }),
    },
    { field: 'costPerLine', headerName: 'Individual price', w: 100 },
  ];
  return columns;
};

// eslint-disable-next-line react/prop-types, react/display-name
const BillingTable = memo(({ rows, mode, onSave, onCancel }) => {
  console.log(' ***  BILLING TABLE  ***');

  const [updatedRows, setUpdatedRows] = useState([...rows]);

  useEffect(() => {
    setUpdatedRows(rows);
  }, [rows]);
  const isEditable = mode === 'edit';

  const columns = getColumnConfig(mode);

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

  return (
    <DataGrid
      className="data-grid"
      rows={rows}
      columns={columns}
      rowHeight={35}
      pageSizeOptions={[25, 50, 75, 100]}
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'break-spaces',
          lineHeight: 1.3,
        },
      }}
      {...(isEditable && { slots: { footer: getFooter } })}
      hideFooterSelectedRowCount
      experimentalFeatures={{ newEditingApi: true }}
      onCellEditStop={(edited, event) => {
        if (
          edited.reason === 'enterKeyDown' ||
          edited.reason === 'cellFocusOut'
        ) {
          const updatedRow = {
            ...edited.row,
            [edited.field]: event.target?.value,
          };
          const index = rows.findIndex((row) => row.id === edited.id);
          const tempData = [...updatedRows];
          tempData[index] = { ...tempData[index], ...updatedRow };
          setUpdatedRows(tempData);
          // updateCharges(tempData);
        }
      }}
    />
  );
});

export default BillingTable;
