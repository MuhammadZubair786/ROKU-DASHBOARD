import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { addExercise, deleteExercise, getExercise, updateExercise } from '../service/MealAndExercie';

const Exercise = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  //   const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = async (values) => {
    await addExercise(values);
    getdata();
  };
  const getdata = async () => {
    const resp = await getExercise();
    console.log(resp);
    setTableData(resp.data);
  };
  useEffect(() => {
    getdata();
  }, []);

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    await updateExercise(tableData[row.index]._id, values);

    getdata();

    exitEditingMode(); //  required to exit editing mode and close modal
    // if (!Object.keys(validationErrors).length) {

    // }
  };

  //   const handleCancelRowEdits = () => {
  //     setValidationErrors({});
  //   };

  const handleDeleteRow = useCallback(
    async (row) => {
      await deleteExercise(tableData[row.index]._id);
      getdata();
    },
    [tableData]
  );

  //   const getCommonEditTextFieldProps = useCallback(
  //     (cell) => {
  //       return {
  //         error: !!validationErrors[cell.id],
  //         helperText: validationErrors[cell.id],
  //         onBlur: (event) => {
  //           console.log(cell.column, '-=-=-=-');
  //           const isValid =
  //             cell.column.id === 'email'
  //               ? validateEmail(event.target.value)
  //               : cell.column.id === 'age'
  //               ? validateAge(+event.target.value)
  //               : validateRequired(event.target.value);
  //           if (!isValid) {
  //             // set validation error for cell if invalid
  //             setValidationErrors({
  //               ...validationErrors,
  //               [cell.id]: `${cell.column.columnDef.header} is required`,
  //             });
  //           } else {
  //             // remove validation error for cell if valid
  //             delete validationErrors[cell.id];
  //             setValidationErrors({
  //               ...validationErrors,
  //             });
  //           }
  //         },
  //       };
  //     },
  //     [validationErrors]
  //   );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        size: 140,
        enableColumnOrdering: false,
        enableSorting: false,

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          //   ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'kCal',
        header: 'Gain Callories',
        enableColumnOrdering: false,
        // enableEditing: false, // disable editing on this column
        enableSorting: false,
        size: 10,

        type: 'number',

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          //   ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },

      {
        accessorKey: 'lbs',
        header: 'Weight (in lbs)',
        enableColumnOrdering: false,
        // enableEditing: false, // disable editing on this column
        enableSorting: false,
        size: 10,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          //   ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
    ]
    // [getCommonEditTextFieldProps]
  );

  return (
    <>
      <Helmet>
        <title> Exercise </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Exercise
        </Typography>
      </Container>

      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" // default
        // enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        // onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button style={{ backgroundColor: '#f87203' }} onClick={() => setCreateModalOpen(true)} variant="contained">
            Create New Exercise
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

// Exercise of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    // put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Exercise</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button style={{ backgroundColor: '#f87203' }} onClick={handleSubmit} variant="contained">
          Create New Exercise
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// const validateAge = (age) => age >= 18 && age <= 50;

export default Exercise;
