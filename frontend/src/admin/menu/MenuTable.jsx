import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Grid, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSnackbar } from 'notistack';

const MenuTable = () => {
  const [open, setOpen] = useState(false);
  const [newDrink, setNewDrink] = useState({
    name: '',
    description: '',
    price: '',
    images: []
  });
  const [menuData, setMenuData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows for the table
  const [editingDrink, setEditingDrink] = useState(null); // To keep track of which drink to edit
  const { enqueueSnackbar } = useSnackbar();

  // Open modal for Add Drink
  const handleOpenAdd = () => {
    setEditingDrink(null); // Reset editing drink for adding new drink
    setNewDrink({
      name: '',
      description: '',
      price: '',
      images: []
    });
    setOpen(true);
  };

  // Open modal for Edit Drink
  const handleOpenEdit = (drink) => {
    setEditingDrink(drink); // Set the drink to be edited
    setNewDrink({ ...drink }); // Pre-fill the form with the selected drink's data
    setOpen(true);
  };

  // Close modal
  const handleClose = () => setOpen(false);

  // Handle input change for drink details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDrink({
      ...newDrink,
      [name]: value
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setNewDrink({
      ...newDrink,
      images: [...e.target.files]
    });
  };

  // Handle drink form submission (Add or Edit)
  const handleSubmit = () => {
    if (editingDrink) {
      // If editing, update the drink
      const updatedData = menuData.map(drink =>
        drink.id === editingDrink.id ? { ...editingDrink, ...newDrink } : drink
      );
      setMenuData(updatedData);
      enqueueSnackbar('Drink updated successfully!', { variant: 'success' });
    } else {
      // If adding, create a new drink
      const newDrinkData = { ...newDrink, id: menuData.length + 1 };  // New drink's ID
      setMenuData([newDrinkData, ...menuData]); // Insert new drink at the top
      enqueueSnackbar('New drink added successfully!', { variant: 'success' });
    }
    handleClose();
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const filteredData = menuData.filter((drink) => !selectedRows.includes(drink.id));
    setMenuData(filteredData);
    setSelectedRows([]);
    enqueueSnackbar('Selected drinks deleted successfully!', { variant: 'success' });
  };

  // Handle delete for a single drink
  const handleDelete = (id) => {
    const filteredData = menuData.filter((drink) => drink.id !== id);
    setMenuData(filteredData);
    enqueueSnackbar('Drink deleted successfully!', { variant: 'success' });
  };

  // Toggle the expanded/collapsed state of rows
  const handleExpandClick = (id) => {
    setExpandedRows((prevState) =>
      prevState.includes(id) ? prevState.filter((item) => item !== id) : [...prevState, id]
    );
  };

  // Simulate fetching initial menu data
  useEffect(() => {
    setMenuData([
      { id: 1, name: 'Latte', description: 'A smooth coffee with steamed milk that provides a rich and creamy texture. It is a favorite for many coffee lovers!', price: 5.99, image: '/img/latte.png' },
      { id: 2, name: 'Espresso', description: 'Strong and bold coffee, made by forcing hot water through finely-ground coffee beans. The foundation for many coffee drinks.', price: 3.99, image: '/img/espresso.png' },
    ]);
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 100, sortable: false },
    {
      field: 'image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => <img src={params.value} alt={params.row.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
    },
    { field: 'name', headerName: 'Name', width: 200, cellClassName: 'text-white' },
    { field: 'price', headerName: 'Price', width: 120, cellClassName: 'text-white' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <IconButton
            style={{ cursor: 'pointer', marginRight: '10px', color: 'white' }}
            onClick={() => handleOpenEdit(params.row)} // Open modal for editing
          >
            <EditIcon />
          </IconButton>
          <IconButton
            style={{ cursor: 'pointer', color: 'white' }}
            onClick={() => handleDelete(params.row.id)} // Delete the selected drink
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            style={{ cursor: 'pointer', color: 'white', marginLeft: '10px' }}
            onClick={() => handleExpandClick(params.row.id)} // Expand/Collapse the row details
          >
            {expandedRows.includes(params.row.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      )
    },
    {
      field: 'expandDetails',
      headerName: 'Details',
      width: 200,
      renderCell: (params) => (
        expandedRows.includes(params.row.id) && (
          <div style={{ marginTop: '10px', background: '#444', color: 'white', padding: '10px', borderRadius: '5px' }}>
            <p><strong>Price:</strong> ${params.row.price}</p>
            <p><strong>Description:</strong> {params.row.description}</p>
          </div>
        )
      ),
    }
  ];

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  return (
    <div>
      {/* Button to open modal for adding a new drink */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        style={{ marginBottom: '20px' }}
      >
        Add New Drink
      </Button>

      {/* Bulk Delete Button */}
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkDelete}
          style={{ marginBottom: '20px', marginLeft: '10px' }}
        >
          Delete Selected Drinks
        </Button>
      )}

      {/* DataGrid to show menu data */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={menuData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={handleSelectionModelChange}
        />
      </div>

      {/* Modal for adding/editing drink */}
      <Modal open={open} onClose={handleClose}>
        <Box
          style={{
            width: '400px',
            margin: 'auto',
            padding: '20px',
            backgroundColor: 'white',
            marginTop: '100px',
            borderRadius: '8px'
          }}
        >
          <h2>{editingDrink ? 'Edit Drink' : 'Add New Drink'}</h2>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Drink Name"
                variant="outlined"
                name="name"
                value={newDrink.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                name="description"
                value={newDrink.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                variant="outlined"
                name="price"
                value={newDrink.price}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {editingDrink ? 'Save Changes' : 'Add Drink'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default MenuTable;
