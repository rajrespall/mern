import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Dialog, DialogContent, Typography, Box, CardMedia, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddDrinks from './AddDrinks';
import EditDrinks from './EditDrinks';
// import Carousel from 'react-material-ui-carousel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useProductStore from "../../store/productStore";

const MenuTable = () => {
  const [menuData, setMenuData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [editingDrink, setEditingDrink] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const { products, fetchProducts, deleteProduct, bulkDeleteProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const transformedData = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      origin: product.category,
      stocks: product.stock || 0,
      images: product.images.map(img => img.url)
    }));
    setMenuData(transformedData);
  }, [products]);

  const handleOpenAdd = () => {
    setEditingDrink(null);
    setOpenAddModal(true); 
  };

  const handleOpenEdit = (drink) => {
    setEditingDrink(drink);
    setOpenEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
      enqueueSnackbar('Drink deleted successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Error deleting drink', { variant: 'error' });
    }
  };

  const handleBulkDelete = async () => {
  try {
    if (!selectedRows.length) {
      enqueueSnackbar('Please select items to delete', { variant: 'warning' });
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedRows.length} items?`);
    if (!confirmed) return;

    await bulkDeleteProducts(selectedRows);
    setSelectedRows([]);
    enqueueSnackbar('Items deleted successfully', { variant: 'success' });
    
  } catch (error) {
    enqueueSnackbar(error.message || 'Error deleting items', { variant: 'error' });
  }
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

  const columns = [
    { name: 'id', 
      label: 'ID',
      options: {
        display: false // Hide original ID column
      }
    },
    {
      name: 'sequentialId',
      label: '#',
      options: {
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
        sort: false // Disable sorting since it's just visual
      }
    },
    {
      name: 'images',
      label: 'Images',
      options: {
        customBodyRender: (images) => (
          <CardMedia
            component="img"
            image={images[0]}
            alt="Drink Image"
            sx={{ width: 80, height: 60, borderRadius: '4px' }}
          />
        ),
        sort: false
      },
    },
    { name: 'name', label: 'Item Name' },
    { name: 'origin', label: 'Origin' },
    { name: 'price', label: 'Price', options: { customBodyRender: (value) => `$${value.toFixed(2)}` } },
    { name: 'stocks', label: 'Stocks' },
    { name: 'description', label: 'Description' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = menuData[rowIndex];
          return (
            <div>
              <IconButton onClick={() => handleOpenEdit(rowData)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(rowData.id)} disabled={isLoading}>
                <DeleteIcon />
              </IconButton>
            </div>
          );
        },
        sort: false
      }
    }
  ];

  const options = {
    selectableRows: 'multiple', // Allow multiple row selection
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      const selectedIds = allRowsSelected.map(row => products[row.dataIndex]._id);
      setSelectedRows(selectedIds); // Get selected rows' IDs
    },
    expandableRows: true,
    renderExpandableRow: (rowData) => {
      const row = menuData.find((drink) => drink.id === rowData[0]);
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
          <Typography variant="body1">Origin: {row.origin}</Typography>
          <Typography variant="body1">Price: ₱{row.price}</Typography>
          <Typography variant="body1">Stocks: {row.stocks}</Typography>
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
        Delete Selected Drinks
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
              Add New Drink
            </Button>
          </div>
        </div>

        <MUIDataTable
          title={"Menu Table"}
          data={menuData}
          columns={columns}
          options={options}
          sx={{
            '& .MuiTable-root': {
              backgroundColor: '#1b2433',
            },
          }}
        />

{openImageDialog && (
  <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
    <DialogContent>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        {currentImages.map((image, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={image} alt={`Drink Image ${index}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
)}

        {openAddModal && (
          <AddDrinks
            open={openAddModal}
            onClose={() => setOpenAddModal(false)} // Close modal when clicked outside or after submission
            onAddDrink={(newDrink) => setMenuData([...menuData, newDrink])}
          />
        )}

        {openEditModal && (
          <EditDrinks
            isOpen={openEditModal}  // Pass the state variable as 'isOpen'
            drink={editingDrink}
            onClose={() => setOpenEditModal(false)}
            onEditDrink={(updatedDrink) => {
              setMenuData((prevData) =>
                prevData.map((drink) => (drink.id === updatedDrink.id ? updatedDrink : drink))
              );
            }}
          />
        )}

      </div>
    </ThemeProvider>
  );
};

export default MenuTable;