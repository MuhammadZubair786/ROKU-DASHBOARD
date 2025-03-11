import React, { useState } from 'react';
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
  TextField,
  Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const staticCustomers = [
  { id: 1, name: 'Alice', points: 5, level: 'Rank 1' },
  { id: 2, name: 'Bob', points: 15, level: 'Rank 2' },
  { id: 3, name: 'Charlie', points: 25, level: 'Rank 3' },
  { id: 4, name: 'David', points: 10, level: 'Rank 1' },
  { id: 5, name: 'Eve', points: 30, level: 'Rank 3' },
  { id: 6, name: 'Frank', points: 20, level: 'Rank 2' },
  { id: 7, name: 'Grace', points: 0, level: 'Rank 0' },
  { id: 8, name: 'Hank', points: 40, level: 'Rank 4' },
  { id: 9, name: 'Ivy', points: 50, level: 'Rank 5' },
  { id: 10, name: 'Jack', points: 100, level: 'Rank 10' },
];

const PointsAccumulation = () => {
  const [customers, setCustomers] = useState(staticCustomers);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [name, setName] = useState('');
  const [points, setPoints] = useState('');

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    setName(customer.name);
    setPoints(customer.points);
    setEditModalOpen(true);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };

  const handleSaveCustomerChanges = () => {
    if (currentCustomer) {
      const updatedCustomers = customers.map((customer) =>
        customer.id === currentCustomer.id ? { ...customer, name, points: parseInt(points, 10) } : customer
      );
      setCustomers(updatedCustomers);
    } else {
      setCustomers([...customers, { id: customers.length + 1, name, points: parseInt(points, 10), level: 'Rank 0' }]);
    }
    setEditModalOpen(false);
    setName('');
    setPoints('');
    setCurrentCustomer(null);
  };

  const calculateLevel = (points) => {
    if (points >= 100) return 'Rank 10';
    if (points >= 50) return 'Rank 5';
    if (points >= 40) return 'Rank 4';
    if (points >= 30) return 'Rank 3';
    if (points >= 20) return 'Rank 2';
    if (points >= 10) return 'Rank 1';
    return 'Rank 0';
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Points Accumulation Module
      </Typography>
      <Button
        onClick={() => {
          setCurrentCustomer(null);
          setName('');
          setPoints('');
          setEditModalOpen(true);
        }}
        variant="contained"
        style={{ backgroundColor: '#f87203' }}
        sx={{ mb: 2 }}
      >
        Add Customer
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.points}</TableCell>
                <TableCell>{calculateLevel(customer.points)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditCustomer(customer)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit/Add Customer Modal */}
      {isEditModalOpen && (
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>{currentCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          <DialogContent>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="dense" />
            <TextField
              label="Points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCustomerChanges} color="primary">
              {currentCustomer ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PointsAccumulation;
