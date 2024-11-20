import React, { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { Button, IconButton, CardMedia, Dialog, DialogContent, Typography, Box } from "@mui/material";
import AddUser from "./AddUser"; // Import your AddUser component
import EditUser from "./EditUser"; // Import your EditUser component
import Carousel from 'react-material-ui-carousel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const USERS_DATA = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", password: "password123", profilePicture: null, images: ['/img/admin.png'] },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", password: "securepass", profilePicture: null, images: ['/img/admin.png'] },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Editor", password: "alicepass456", profilePicture: null, images: ['/img/admin.png'] },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(USERS_DATA);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = USERS_DATA.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleAddUser = (newUser) => {
    const updatedUsers = [
      ...filteredUsers,
      { ...newUser, id: filteredUsers.length + 1 }, // Add a unique ID
    ];
    setFilteredUsers(updatedUsers);
    handleCloseAdd();
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    handleOpenEdit();
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = filteredUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setFilteredUsers(updatedUsers);
    handleCloseEdit();
  };

  const handleDeleteClick = (id) => {
    const updatedUsers = filteredUsers.filter((user) => user.id !== id);
    setFilteredUsers(updatedUsers);
    enqueueSnackbar('User deleted successfully!', { variant: 'success' });
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
      name: 'profilePicture',
      label: 'Profile',
      options: {
        customBodyRender: (profilePicture) => (
          <CardMedia
            component="img"
            image={profilePicture ? URL.createObjectURL(profilePicture) : "/img/admin.png"} // Default image if no picture
            alt="Profile"
            sx={{ width: 40, height: 40, borderRadius: '50%', marginRight: 2 }}
          />
        ),
      },
    },
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    { name: 'role', label: 'Role' },
    { name: 'password', label: 'Password' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = filteredUsers[rowIndex];
          return (
            <div className="flex gap-2">
              <IconButton
                className="text-indigo-400 hover:text-indigo-300"
                onClick={() => handleEditClick(rowData)}
              >
                <Edit size={18} />
              </IconButton>
              <IconButton
                className="text-red-400 hover:text-red-300"
                onClick={() => handleDeleteClick(rowData.id)}
              >
                <Trash2 size={18} />
              </IconButton>
              <IconButton onClick={() => handleExpandClick(rowData.id)}>
                {expandedRows.includes(rowData.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map((row) => row.dataIndex));
    },
    expandableRows: true,
    renderExpandableRow: (rowData) => {
      const row = filteredUsers.find((user) => user.id === rowData[0]);
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
          <Typography variant="body1">Email: {row.email}</Typography>
          <Typography variant="body1">Role: {row.role}</Typography>
          <Typography variant="body1">Password: {row.password}</Typography>
          <Button variant="outlined" color="primary" onClick={() => handleViewImages(row.images)} sx={{ mt: 2 }}>
            View Images
          </Button>
        </Box>
      );
    },
    customToolbarSelect: () => (
      <Button variant="contained" color="error" onClick={() => handleBulkDelete()}>
        Delete Selected Users
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
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Users List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Button onClick={handleOpenAdd} variant="contained" className="ml-4 bg-indigo-500">
            Add User
          </Button>
        </div>

        <MUIDataTable
          title={"Users Table"}
          data={filteredUsers}
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
                  <img key={index} src={image} alt={`User Image ${index}`} style={{ width: '100%' }} />
                ))}
              </Carousel>
            </DialogContent>
          </Dialog>
        )}

        {/* AddUser component */}
        {openAdd && (
          <AddUser
            isOpen={openAdd}
            onClose={handleCloseAdd}
            handleAddUser={handleAddUser}
          />
        )}
        {/* EditUser component */}
        {openEdit && (
          <EditUser
            isOpen={openEdit}
            onClose={handleCloseEdit}
            user={currentUser}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </motion.div>
    </ThemeProvider>
  );
};

export default UsersTable;