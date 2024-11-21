import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Dialog, DialogContent, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddOrigin from './AddOrigin';
import EditOrigin from './EditOrigin';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const OriginTable = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenAdd = () => {
    setEditingFeedback(null);
    setOpenAddModal(true);
  };

  const handleOpenEdit = (feedback) => {
    setEditingFeedback(feedback);
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    setFeedbackData((prevData) => prevData.filter((feedback) => feedback.id !== id));
    enqueueSnackbar('Feedback deleted successfully!', { variant: 'success' });
  };

  const handleBulkDelete = () => {
    setFeedbackData((prevData) => prevData.filter((feedback) => !selectedRows.includes(feedback.id)));
    setSelectedRows([]);
    enqueueSnackbar('Selected feedback deleted successfully!', { variant: 'success' });
  };

  const handleExpandClick = (id) => {
    setExpandedRows((prevState) =>
      prevState.includes(id) ? prevState.filter((item) => item !== id) : [...prevState, id]
    );
  };

  useEffect(() => {
    setFeedbackData([
      { id: 1, user: 'John Doe', comment: 'Great service!', rating: 5, date: '2023-01-01' },
      { id: 2, user: 'Jane Smith', comment: 'Could be better.', rating: 3, date: '2023-01-02' },
    ]);
  }, []);

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'user', label: 'User' },
    { name: 'comment', label: 'Comment' },
    { name: 'rating', label: 'Rating' },
    { name: 'date', label: 'Date' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = feedbackData[rowIndex];
          return (
            <div>
              <IconButton onClick={() => handleOpenEdit(rowData)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(rowData.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleExpandClick(rowData.id)}>
                {expandedRows.includes(rowData.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
          );
        }
      }
    }
  ];

  const options = {
    selectableRows: 'multiple',
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map((row) => row.dataIndex));
    },
    expandableRows: true,
    renderExpandableRow: (rowData) => {
      const row = feedbackData.find((feedback) => feedback.id === rowData[0]);
      return (
        <Box
          key={row.id}
          sx={{
            width: '450%',
            maxWidth: '1000px',
            paddingTop: '12px',
            paddingLeft: '50px',
            paddingRight: '20px',
            paddingBottom: '10px',
            bgcolor: '#1b2433',
            color: '#fff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {row.user}
          </Typography>
          <Typography variant="body1">ID: {row.id}</Typography>
          <Typography variant="body1">Rating: {row.rating}</Typography>
          <Typography variant="body1">Date: {row.date}</Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Comment: {row.comment}
          </Typography>
        </Box>
      );
    },
    customToolbarSelect: () => (
      <Button variant="contained" color="error" onClick={handleBulkDelete}>
        Delete Selected Feedback
      </Button>
    ),
    responsive: 'standard',
    pagination: true,
    filterType: 'checkbox',
    viewColumns: false,
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#1b2433',
        paper: '#1b2433',
      },
      text: {
        primary: '#fff',
      },
    },
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: '#1b2433',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#282c34',
            color: '#fff',
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            backgroundColor: '#1b2433',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: '#fff',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: '10px' }}>
        <div style={{ padding: '10px' }}>
          <div style={{ padding: '5px' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{
                mb: 2,
                backgroundColor: '#2a3342',
                border: '2px solid #fff',
                borderRadius: '4px',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              Add New Feedback
            </Button>
          </div>
        </div>

        <MUIDataTable
          title={"Feedback Table"}
          data={feedbackData}
          columns={columns}
          options={options}
          sx={{
            '& .MuiTable-root': {
              backgroundColor: '#1b2433',
            },
          }}
        />

        {openAddModal && (
          <AddOrigin
            isOpen={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onAddOrigin={(newFeedback) => setFeedbackData([...feedbackData, newFeedback])}
          />
        )}

        {openEditModal && (
          <EditOrigin
            isOpen={openEditModal}
            origin={editingFeedback}
            onClose={() => setOpenEditModal(false)}
            onEditOrigin={(updatedFeedback) => {
              setFeedbackData((prevData) =>
                prevData.map((feedback) => (feedback.id === updatedFeedback.id ? updatedFeedback : feedback))
              );
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default OriginTable;