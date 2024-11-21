// frontend/src/admin/origins/OriginTable.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Rating } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import useReviewStore from '../../store/reviewStore';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const OriginTable = () => {
  const { allReviews, stats, pagination, isLoading, fetchAllReviews } = useReviewStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('createdAt');

  useEffect(() => {
    fetchAllReviews(page + 1, rowsPerPage, sortField, sortOrder);
  }, [page, rowsPerPage, sortField, sortOrder]);

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
        customBodyRender: (value, tableMeta) => (
          <Box>
            <IconButton onClick={() => handleEdit(tableMeta.rowData)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(tableMeta.rowData)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )
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

  const StatCard = ({ title, value }) => (
    <Box sx={{
      bgcolor: 'rgba(255,255,255,0.1)',
      p: 2,
      borderRadius: 1,
      textAlign: 'center'
    }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        {stats && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            <StatCard title="Total Reviews" value={stats.totalReviews} />
            <StatCard title="Average Rating" value={stats.averageRating} />
            <StatCard 
              title="5★ Reviews" 
              value={stats.ratingDistribution.find(r => r._id === 5)?.count || 0} 
            />
          </Box>
        )}

        <MUIDataTable
          title="Reviews Management"
          data={allReviews}
          columns={columns}
          options={options}
        />
      </Box>
    </ThemeProvider>
  );
};

export default OriginTable;