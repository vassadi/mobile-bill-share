/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';

export const DataTable = ({
  rows = [],
  columns = [],
  checkboxSelection = false,
  onCellEditStop = () => {},
  editMode,
  rowModesModel,
  onRowModesModelChange = () => {},
  onRowEditStop = () => {},
  processRowUpdate = () => {},
  slots = {},
  slotProps = {},
}) => (
  <div className="data-grid">
    <DataGrid
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
      checkboxSelection={checkboxSelection}
      onCellEditStop={onCellEditStop}
      experimentalFeatures={{ newEditingApi: true }}
      editMode={editMode}
      rowModesModel={rowModesModel}
      onRowModesModelChange={onRowModesModelChange}
      onRowEditStop={onRowEditStop}
      processRowUpdate={processRowUpdate}
      slots={slots}
      slotProps={slotProps}
    />
  </div>
);

export default DataTable;
