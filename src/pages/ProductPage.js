import React, { useState, useEffect } from 'react';
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
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import './PostPage.css';
import TableLoading from '../components/table-loading/tableLoading';

const ProductList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditRow = (row) => {
    setCurrentRow(row);
    setEditModalOpen(true); // Open edit dialog
  };

  const handleDeleteRow = (row) => {
    setCurrentRow(row);
    setDeleteModalOpen(true); // Open delete confirmation dialog
  };

  const handleSaveChanges = () => {
    // Save edited data logic
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // Perform delete logic
    setTableData((prevData) => prevData.filter((item) => item.id !== currentRow.original.id));
    setDeleteModalOpen(false);
  };

  const TABLE_HEAD = [
    { id: 'profile.image.file', label: 'Image', alignRight: false },
    { id: 'profile.fullName', label: 'Name', alignRight: false },
    { id: 'isCompleteProfile', label: 'Role', alignRight: false },
    { id: 'userType', label: 'Profile Complete', alignRight: false },
    { id: 'status', label: 'Posts', alignRight: false },
    { id: 'Action', label: 'Action', alignRight: false },
    { id: '_id' },
  ];

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setTableData([
        {
          id: 1,
          name: 'Product 1',
          price: 100,
          category: 'Category 1',
          image:
            'https://media.istockphoto.com/id/1215516074/photo/shopping-basket-with-fresh-food-isolated-on-white-grocery-supermarket-food-and-eats-online.jpg?s=612x612&w=0&k=20&c=feX2DMmoW0c36k8eQdHM2SGcMu_IAj3lFrf3VMRf-qU=',
        },
        {
          id: 2,
          name: 'Product 2',
          price: 200,
          category: 'Category 2',
          image:
            'https://media.istockphoto.com/id/475438008/vector/shopping-online-background.jpg?s=2048x2048&w=is&k=20&c=VD7bJLuCa7om0qdmLisZh9cuogC6oHpPtFMis4RVObI=',
        },
        {
          id: 1,
          name: 'Product 3',
          price: 100,
          category: 'Category 3',
          image:
            'https://media.istockphoto.com/id/1215516074/photo/shopping-basket-with-fresh-food-isolated-on-white-grocery-supermarket-food-and-eats-online.jpg?s=612x612&w=0&k=20&c=feX2DMmoW0c36k8eQdHM2SGcMu_IAj3lFrf3VMRf-qU=',
        },
        {
          id: 2,
          name: 'Product 4',
          price: 200,
          category: 'Category 4',
          image:
            'https://media.istockphoto.com/id/475438008/vector/shopping-online-background.jpg?s=2048x2048&w=is&k=20&c=VD7bJLuCa7om0qdmLisZh9cuogC6oHpPtFMis4RVObI=',
        },
        {
          id: 1,
          name: 'Product 5',
          price: 100,
          category: 'Category 5',
          image:
            'https://media.istockphoto.com/id/1215516074/photo/shopping-basket-with-fresh-food-isolated-on-white-grocery-supermarket-food-and-eats-online.jpg?s=612x612&w=0&k=20&c=feX2DMmoW0c36k8eQdHM2SGcMu_IAj3lFrf3VMRf-qU=',
        },
        {
          id: 2,
          name: 'Product 6',
          price: 200,
          category: 'Category 6',
          image:
            'https://media.istockphoto.com/id/475438008/vector/shopping-online-background.jpg?s=2048x2048&w=is&k=20&c=VD7bJLuCa7om0qdmLisZh9cuogC6oHpPtFMis4RVObI=',
        },
        {
          id: 1,
          name: 'Product 7',
          price: 100,
          category: 'Category 8',
          image:
            'https://media.istockphoto.com/id/1215516074/photo/shopping-basket-with-fresh-food-isolated-on-white-grocery-supermarket-food-and-eats-online.jpg?s=612x612&w=0&k=20&c=feX2DMmoW0c36k8eQdHM2SGcMu_IAj3lFrf3VMRf-qU=',
        },
        {
          id: 2,
          name: 'Product 2',
          price: 200,
          category: 'Category 2',
          image:
            'https://media.istockphoto.com/id/475438008/vector/shopping-online-background.jpg?s=2048x2048&w=is&k=20&c=VD7bJLuCa7om0qdmLisZh9cuogC6oHpPtFMis4RVObI=',
        },
      ]);
      setIsLoading(false); // Stop loading after 2 seconds
    }, 1000);
  }, []);

  // Handle creating a new product
  const handleCreateNewProduct = (values) => {
    setTableData((prevData) => [...prevData, { id: prevData.length + 1, ...values }]);
    setCreateModalOpen(false);
  };

  // const handleDeleteRow = (row) => {
  //   setTableData((prevData) => prevData.filter((item, index) => index !== row.index));
  // };

  const columns = [
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'price', header: 'Price', type: 'number' },
    { accessorKey: 'category', header: 'Category' },
    {
      accessorKey: 'image',
      header: 'Image',
      Cell: ({ cell }) => (
        <img
          src={cell.getValue()} // Assuming cell.getValue() returns the image URL
          alt="Product"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Set your desired size
        />
      ),
    },
    {
      header: 'Actions',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip arrow placement="left" title="Edit">
            <IconButton onClick={() => handleEditRow(row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Product List
      </Typography>
      {isLoading ? (
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableBody>
              <TableLoading tableHeading={TABLE_HEAD} />
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={tableData}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton>
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
              Add New Product
            </Button>
          )}
        />
      )}
      {/* Edit Modal */}
      {currentRow && (
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Product Name"
              value={currentRow?.original?.name || ''}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, original: { ...currentRow.original, name: e.target.value } })
              }
              fullWidth
              margin="dense"
            />
            <TextField
              label="Price"
              value={currentRow?.original?.price || ''}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, original: { ...currentRow.original, price: e.target.value } })
              }
              fullWidth
              margin="dense"
            />
            <TextField
              label="Category"
              value={currentRow?.original?.category || ''}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, original: { ...currentRow.original, category: e.target.value } })
              }
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {currentRow && (
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete {currentRow?.original?.name}?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <CreateProductModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewProduct}
      />
    </>
  );
};

// Modal for creating a new product
const CreateProductModal = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
  });

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Product</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            width: '100%',
            minWidth: { xs: '300px', sm: '360px', md: '400px' },
            gap: '1.5rem',
          }}
        >
          <TextField
            label="Product Name"
            name="name"
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            onChange={(e) => setValues({ ...values, price: e.target.value })}
          />
          <Select
            name="category"
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
          >
            <MenuItem value="Category 1">Category 1</MenuItem>
            <MenuItem value="Category 2">Category 2</MenuItem>
            <MenuItem value="Category 3">Category 3</MenuItem>
          </Select>
          <TextField label="Image" name="image" onChange={(e) => setValues({ ...values, image: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button style={{ backgroundColor: '#f87203' }} onClick={handleSubmit} variant="contained">
          Create Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductList;
