/* eslint-disable react/prop-types */
import { forwardRef, useContext, useState } from 'react';

import { Button, Slide } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { store } from '../../../config/getClientConfig';
import { UserContext } from '../../../context/userContext';
import { phoneFormatter } from '../../../utils';
import { MobileBrick, WebBrick } from '../../atoms/Bricks';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditToolbar = (props) => {
  const { setRows, setRowModesModel } = props;

  const handleAddClick = () => {
    const id = `user_${Date.now()}`;
    setRows((oldRows) => [
      ...oldRows,
      {
        id: id,
        name: '',
        number: '',
        isAdmin: false,
        isActive: false,
        isFixed: false,
        isFree: false,
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
};

const AdminModule = ({ open, handleClose }) => {
  const context = useContext(UserContext);

  const { usersList, groupId, isAdmin } = context;
  console.log('*** ADMIN MODULE ***');

  const [rows, setRows] = useState([...usersList]);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    // const deletedRow = rows.find((row) => row.id === id);

    const document = doc(store, 'users', id);
    deleteDoc(document).then(() => {
      console.log('Deleted...');
      setRows(rows.filter((row) => row.id !== id));
    });

    // const docData = { [`${deletedRow.number}`]: deleteField() };

    // updateDoc(document, docData)
    //   .then(() => {
    //     console.log('success');
    //     setRows(rows.filter((row) => row.id !== id));
    //   })
    //   .catch(() => {
    //     console.log('ERROR');
    //   });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow, groupId) => {
    const { isNew, ...rest } = newRow;

    console.log('new row => ', isNew);
    let document = '';

    const docData = { ...rest };
    const mergeData = {};

    if (isNew) {
      document = doc(collection(store, 'users'));
      docData.id = document.id;
      docData.groupId = groupId;
    } else {
      document = doc(store, 'users', newRow.id);
      mergeData.merge = true;
    }

    // document.set(docData);

    setDoc(document, docData, mergeData)
      .then(() => {
        console.log('success');
      })
      .catch((e) => {
        console.log('ERROR', e);
      });

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const tcolumns = [
    { field: 'groupId', headerName: 'Group ID' },
    { field: 'name', headerName: 'Name', width: 175, editable: true },
    {
      field: 'number',
      headerName: 'Mobile',
      width: 150,
      editable: true,
      valueFormatter: ({ value }) => phoneFormatter(value),
    },
    {
      field: 'isAdmin',
      headerName: 'is Admin',
      type: 'boolean',
      width: 150,
      editable: true,
    },
    {
      field: 'isActive',
      headerName: 'Active',
      type: 'boolean',
      width: 150,
      editable: true,
    },
    {
      field: 'isFixed',
      headerName: 'Fixed charge lines',
      type: 'boolean',
      width: 150,
      editable: true,
    },
    {
      field: 'isFree',
      headerName: 'No charge lines',
      type: 'boolean',
      width: 150,
      editable: true,
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        if (!isAdmin) return [];

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`Save_${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`Cancel_${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={`Edit_${id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`Delete_${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  console.log('ROWS', rows);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <WebBrick>
          <DataGrid
            className="data-grid"
            initialState={{
              columns: {
                columnVisibilityModel: {
                  groupId: false,
                },
              },
            }}
            columns={tcolumns}
            rows={rows}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={(newRow) => processRowUpdate(newRow, groupId)}
            onProcessRowUpdateError={(error) => {
              console.log(error);
            }}
            slots={isAdmin ? { toolbar: EditToolbar } : {}}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </WebBrick>
        <MobileBrick>
          <DataGrid
            className="data-grid"
            initialState={{
              columns: {
                columnVisibilityModel: {
                  groupId: false,
                },
              },
            }}
            columns={[
              { field: 'groupId', headerName: 'Group ID' },
              { field: 'name', headerName: 'Name', width: 175, editable: true },
              {
                field: 'number',
                headerName: 'Mobile',
                width: 150,
                editable: true,
                valueFormatter: ({ value }) => phoneFormatter(value),
              },
            ]}
            rows={rows}
          />
        </MobileBrick>
      </Dialog>
    </>
  );
};

export default AdminModule;
