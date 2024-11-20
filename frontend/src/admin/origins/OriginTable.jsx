import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Dialog, DialogContent, Typography, Box, CardMedia, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddOrigin from './AddOrigin';
import EditOrigin from './EditOrigin';
import Carousel from 'react-material-ui-carousel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const OriginTable = () => {
  const [originData, setOriginData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [editingOrigin, setEditingOrigin] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenAdd = () => {
    setEditingOrigin(null);
    setOpenAddModal(true);
  };

  const handleOpenEdit = (origin) => {
    setEditingOrigin(origin);
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    setOriginData((prevData) => prevData.filter((origin) => origin.id !== id));
    enqueueSnackbar('Origin deleted successfully!', { variant: 'success' });
  };

  const handleBulkDelete = () => {
    setOriginData((prevData) => prevData.filter((origin) => !selectedRows.includes(origin.id)));
    setSelectedRows([]);
    enqueueSnackbar('Selected origins deleted successfully!', { variant: 'success' });
  };

  const handleExpandClick = (id) => {
    setExpandedRows((prevState) =>
      prevState.includes(id) ? prevState.filter((item) => item !== id) : [...prevState, id]
    );
  };

  const handleViewImages = (images) => {
    setCurrentImages(images);
    setOpenImageDialog(true);
  };

  useEffect(() => {
    setOriginData([
      { id: 1, name: 'Ethiopia', description: 'Known for its rich coffee culture', price: 25, region: 'Africa', images: ['/img/ethiopia1.png', '/img/ethiopia2.png'] },
      { id: 2, name: 'Colombia', description: 'Famous for its smooth coffee', price: 20, region: 'South America', images: ['/img/colombia1.png', '/img/colombia2.png'] },
    ]);
  }, []);

  const columns = [
    { name: 'id', label: 'ID' },
    {
      name: 'images',
      label: 'Images',
      options: {
        customBodyRender: (images) => (
          <CardMedia
            component="img"
            image={images[0]}
            alt="Origin Image"
            sx={{ width: 80, height: 60, borderRadius: '4px' }}
          />
        ),
      },
    },
    { name: 'name', label: 'Origin Name' },
    { name: 'region', label: 'Region' },
    { name: 'price', label: 'Price', options: { customBodyRender: (value) => `$${value.toFixed(2)}/kg` } },
    { name: 'description', label: 'Description' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = originData[rowIndex];
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
              <IconButton onClick={() => handleViewImages(rowData.images)}>
                <img src="/img/view-icon.png" alt="View" style={{ width: 18, height: 18 }} />
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
      const row = originData.find((origin) => origin.id === rowData[0]);
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
            {row.name}
          </Typography>
          <Typography variant="body1">ID: {row.id}</Typography>
          <Typography variant="body1">Region: {row.region}</Typography>
          <Typography variant="body1">Price: ${row.price}/kg</Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Description: {row.description}
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => handleViewImages(row.images)} sx={{ mt: 2 }}>
            View Images
          </Button>
        </Box>
      );
    },
    customToolbarSelect: () => (
      <Button variant="contained" color="error" onClick={handleBulkDelete}>
        Delete Selected Origins
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
              Add New Origin
            </Button>
          </div>
        </div>

        <MUIDataTable
          title={"Origin Table"}
          data={originData}
          columns={columns}
          options={options}
          sx={{
            '& .MuiTable-root': {
              backgroundColor: '#1b2433',
            },
          }}
        />

        {openImageDialog && (
          <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="md" fullWidth>
            <DialogContent>
              <Carousel>
                {currentImages.map((image, index) => (
                  <img key={index} src={image} alt={`Origin Image ${index}`} style={{ width: '100%' }} />
                ))}
              </Carousel>
            </DialogContent>
          </Dialog>
        )}

        {openAddModal && (
          <AddOrigin
            isOpen={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onAddOrigin={(newOrigin) => setOriginData([...originData, newOrigin])}
          />
        )}

        {openEditModal && (
          <EditOrigin
            isOpen={openEditModal}
            origin={editingOrigin}
            onClose={() => setOpenEditModal(false)}
            onEditOrigin={(updatedOrigin) => {
              setOriginData((prevData) =>
                prevData.map((origin) => (origin.id === updatedOrigin.id ? updatedOrigin : origin))
              );
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default OriginTable;