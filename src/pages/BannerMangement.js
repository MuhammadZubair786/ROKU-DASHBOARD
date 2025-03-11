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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import TableLoading from '../components/table-loading/tableLoading';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const TABLE_HEAD = [
    { id: 'profile.image.file', label: 'Image', alignRight: false },
    { id: 'profile.fullName', label: 'Name', alignRight: false },
    { id: 'isCompleteProfile', label: 'Role', alignRight: false },
    { id: 'isCompleteProfile', label: 'Role', alignRight: false },
  ];

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setBanners([
        {
          id: 1,
          title: 'Summer Sale',
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLCtC-P2Xk8SkiPfnuNNsCAslO2GqQCXXXxw&s',
          description: 'Up to 50% off!',
        },
        {
          id: 2,
          title: 'Winter Sale',
          imageUrl:
            'https://png.pngtree.com/thumb_back/fh260/background/20230703/pngtree-d-smartphone-with-gifts-and-discount-percentage-e-commerce-web-banner-image_3753281.jpg',
          description: 'Exclusive offers!',
        },
        {
          id: 3,
          title: 'Summer Sale 2',
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLCtC-P2Xk8SkiPfnuNNsCAslO2GqQCXXXxw&s',
          description: 'Up to 50% off!',
        },
        {
          id: 4,
          title: 'Winter Sale 2',
          imageUrl:
            'https://png.pngtree.com/thumb_back/fh260/background/20230703/pngtree-d-smartphone-with-gifts-and-discount-percentage-e-commerce-web-banner-image_3753281.jpg',
          description: 'Exclusive offers!',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEditBanner = (banner) => {
    setCurrentBanner(banner);
    setTitle(banner.title);
    setImageUrl(banner.imageUrl);
    setDescription(banner.description);
    setEditModalOpen(true);
  };

  const handleDeleteBanner = (banner) => {
    setCurrentBanner(banner);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setBanners((prevData) => prevData.filter((banner) => banner.id !== currentBanner.id));
    setDeleteModalOpen(false);
  };

  const handleSaveBannerChanges = () => {
    if (currentBanner) {
      setBanners((prevData) =>
        prevData.map((banner) =>
          banner.id === currentBanner.id ? { ...banner, title, imageUrl, description } : banner
        )
      );
    } else {
      setBanners((prevData) => [...prevData, { id: prevData.length + 1, title, imageUrl, description }]);
    }
    setEditModalOpen(false);
    setTitle('');
    setImageUrl('');
    setDescription('');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Banner Management
      </Typography>
      <Button
        //     style={{ backgroundColor: '#f87203' }}
        style={{ backgroundColor: '#f87203' }}
        onClick={() => {
          setCurrentBanner(null);
          setTitle('');
          setImageUrl('');
          setDescription('');
          setEditModalOpen(true);
        }}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add New Banner
      </Button>

      {isLoading ? (
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableBody>
              <TableLoading tableHeading={TABLE_HEAD} />
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Image URL</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>
                    {' '}
                    <img src={banner.imageUrl} alt={banner.title} style={{ width: '100px', height: 'auto' }} />
                  </TableCell>
                  <TableCell>{banner.description}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditBanner(banner)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteBanner(banner)}>
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

      {/* Edit/Add Banner Modal */}
      {isEditModalOpen && (
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>{currentBanner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBannerChanges} color="primary">
              {currentBanner ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Banner Modal */}
      {currentBanner && (
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the banner titled <strong>{currentBanner.title}</strong>?
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

export default BannerManagement;
