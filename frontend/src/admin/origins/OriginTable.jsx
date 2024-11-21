// frontend/src/admin/origins/OriginTable.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Dialog, DialogActions, DialogContent, 
  DialogTitle, Typography, Rating } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import useReviewStore from '../../store/reviewStore';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-hot-toast';

const OriginTable = () => {
  const { allReviews, stats, pagination, isLoading, fetchAllReviews, deleteReview } = useReviewStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('createdAt');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchAllReviews(page + 1, rowsPerPage, sortField, sortOrder);
  }, [page, rowsPerPage, sortField, sortOrder]);

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(selectedReview._id);
      toast.success('Review deleted successfully');
      setDeleteConfirmOpen(false);
      fetchAllReviews(); // Refresh list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      name: 'product',
      label: 'Product',
      options: {
        customBodyRender: (value) => value?.name || 'N/A'
      }
    },
    {
      name: 'user',
      label: 'Customer',
      options: {
        customBodyRender: (value) => value?.name || 'Anonymous'
      }
    },
    {
      name: 'rating',
      label: 'Rating',
      options: {
        customBodyRender: (value) => (
          <Rating value={value} readOnly size="small" />
        )
      }
    },
    { name: 'text', label: 'Review' },
    {
      name: 'createdAt',
      label: 'Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString()
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const review = allReviews[tableMeta.rowIndex];
          return (
            <Box>
              <IconButton onClick={() => handleDeleteClick(review)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        }
      }
    }
  ];

  const options = {
    serverSide: true,
    count: pagination?.totalReviews || 0,
    page,
    rowsPerPage,
    onChangePage: (newPage) => setPage(newPage),
    onChangeRowsPerPage: (newRowsPerPage) => {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    onColumnSortChange: (changedColumn, direction) => {
      setSortField(changedColumn);
      setSortOrder(direction === 'ascending' ? 'asc' : 'desc');
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: { default: '#1b2433', paper: '#1b2433' }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <MUIDataTable
          title="Reviews Management"
          data={allReviews}
          columns={columns}
          options={options}
        />

        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this review?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default OriginTable;