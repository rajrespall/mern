import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Dialog, DialogContent, Typography, Box, CardMedia, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddDrinks from './AddDrinks';
import EditDrinks from './EditDrinks';
import Carousel from 'react-material-ui-carousel';
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

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    // Fetch products when component mounts
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Transform products into menu data format when products change
    const transformedData = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      origin: product.origin,
      stocks: product.stocks || 0,
      images: product.images.map(img => img.url)
    }));
    setMenuData(transformedData);
  }, [products]);

  const handleOpenAdd = () => {
    setEditingDrink(null);
    setOpenAddModal(true); // Set openAddModal to true to show the modal
  };

  const handleOpenEdit = (drink) => {
    setEditingDrink(drink);
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    setMenuData((prevData) => prevData.filter((drink) => drink.id !== id));
    enqueueSnackbar('Drink deleted successfully!', { variant: 'success' });
  };

  const handleBulkDelete = () => {
    setMenuData((prevData) => prevData.filter((drink) => !selectedRows.includes(drink.id)));
    setSelectedRows([]); 
    enqueueSnackbar('Selected drinks deleted successfully!', { variant: 'success' });
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
    { name: 'id', label: 'ID' },
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
    selectableRows: 'multiple', // Allow multiple row selection
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map((row) => row.dataIndex)); // Get selected rows' IDs
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
          <Typography variant="body1">Price: ${row.price}</Typography>
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
              <Carousel>
                {currentImages.map((image, index) => (
                  <img key={index} src={image} alt={`Drink Image ${index}`} style={{ width: '100%' }} />
                ))}
              </Carousel>
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