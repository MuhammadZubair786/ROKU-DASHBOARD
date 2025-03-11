import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  TextField,
  Checkbox,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import TableLoading from '../components/table-loading/tableLoading';

const FlashSaleManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [isFlashSale, setIsFlashSale] = useState(false);

  // Simulate fetching products data
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          title: 'Product 1',
          imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.9vOj25uyE-Aj7RUw1WM2xgHaE8&pid=Api&P=0&h=220',
          description: 'Product 1 Description',
          isFlashSale: false,
          discount: 0,
        },
        {
          id: 2,
          title: 'Product 2',
          imageUrl: 'https://wallpaperaccess.com/full/1312776.jpg',
          description: 'Product 2 Description',
          isFlashSale: true,
          discount: 20, // 20% off
        },
        {
          id: 3,
          title: 'Product 3',
          imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.9vOj25uyE-Aj7RUw1WM2xgHaE8&pid=Api&P=0&h=220',
          description: 'Product 1 Description',
          isFlashSale: true,
          discount: 30,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setTitle(product.title);
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setDiscount(product.discount);
    setIsFlashSale(product.isFlashSale);
    setEditModalOpen(true);
  };

  const handleSaveProductChanges = () => {
    if (currentProduct) {
      setProducts((prevData) =>
        prevData.map((product) =>
          product.id === currentProduct.id
            ? { ...product, title, imageUrl, description, discount, isFlashSale }
            : product
        )
      );
    } else {
      setProducts((prevData) => [
        ...prevData,
        {
          id: prevData.length + 1,
          title,
          imageUrl,
          description,
          discount,
          isFlashSale,
        },
      ]);
    }
    setEditModalOpen(false);
    setTitle('');
    setImageUrl('');
    setDescription('');
    setDiscount('');
    setIsFlashSale(false);
  };

  const handleDeleteProduct = (product) => {
    setCurrentProduct(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setProducts((prevData) => prevData.filter((product) => product.id !== currentProduct.id));
    setDeleteModalOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Flash Sale Management
      </Typography>
      <Button
        style={{ backgroundColor: '#f87203' }}
        onClick={() => {
          setCurrentProduct(null);
          setTitle('');
          setImageUrl('');
          setDescription('');
          setDiscount('');
          setIsFlashSale(false);
          setEditModalOpen(true);
        }}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add Flash Product
      </Button>

      {isLoading ? (
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableBody>
              <TableLoading />
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Flash Sale</TableCell>
                <TableCell>Discount (%)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>
                    <img src={product.imageUrl} alt={product.title} style={{ width: '100px', height: 'auto' }} />
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={product.isFlashSale}
                      onChange={(e) =>
                        setProducts((prevData) =>
                          prevData.map((p) => (p.id === product.id ? { ...p, isFlashSale: e.target.checked } : p))
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{product.discount}%</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditProduct(product)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteProduct(product)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit/Add Product Modal */}
      {isEditModalOpen && (
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>{currentProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Discount (%)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              fullWidth
              margin="dense"
            />
            <Box display="flex" alignItems="center" mt={2}>
              <Checkbox checked={isFlashSale} onChange={(e) => setIsFlashSale(e.target.checked)} />
              <Typography>Flash Sale</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProductChanges} color="primary">
              {currentProduct ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Product Modal */}
      {currentProduct && (
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the product titled <strong>{currentProduct.title}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default FlashSaleManagement;
