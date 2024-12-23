import React, { useState, useEffect } from "react";
import { IconButton, Select, MenuItem, InputLabel, FormControl, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useProductStore from '../../store/productStore';
import { Loader } from 'lucide-react';

const EditDrinks = ({ isOpen, onClose, drink }) => {
  const [drinkName, setDrinkName] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const { updateProduct } = useProductStore();

  useEffect(() => {
    if (drink) {
      setDrinkName(drink.name || "");
      setOrigin(drink.origin || "");
      setPrice(drink.price || "");
      setStock(drink.stocks || "");
      setDescription(drink.description || "");
      setImages(drink.images || []);
    }
  }, [drink]);

  const handleSave = async () => {
    try {
      if (!drinkName || !origin || !price || !stock || !description) {
        alert("Please fill all fields.");
        return;
      }

      setLoading(true);

      await updateProduct(drink.id, {
        name: drinkName,
        description,
        price: Number(price),
        category: origin,
        stock: Number(stock),
        images: images.length > 0 ? images : undefined // Only send if new images uploaded
      });

      // Cleanup preview URLs
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      onClose();
    } catch (error) {
      alert(error.message || "Error updating drink");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create and set preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#1b2433',
          color: 'white',
          width: '450px',
          padding: '20px',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
        Edit Drink
        <IconButton edge="end" color="inherit" onClick={handleClose} sx={{ position: 'absolute', right: 15, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Drink Name"
              value={drinkName}
              onChange={(e) => setDrinkName(e.target.value)}
              fullWidth
              sx={{ backgroundColor: '#2c3e50', borderRadius: '4px', padding: '5px' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              type="number"
              sx={{ backgroundColor: '#2c3e50', borderRadius: '4px', padding: '5px' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              fullWidth
              type="number"
              sx={{ backgroundColor: '#2c3e50', borderRadius: '4px', padding: '5px' }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ backgroundColor: '#2c3e50', borderRadius: '4px', padding: '8px' }}>
              <InputLabel>Origin</InputLabel>
              <Select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                label="Origin"
                sx={{ color: 'white' }}
              >
                <MenuItem value="Brazilian">Brazil</MenuItem>
                <MenuItem value="Vietnamese">Vietnam</MenuItem>
                <MenuItem value="Ethiopian">Ethiopia</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{ backgroundColor: '#2c3e50', borderRadius: '4px', padding: '8px', mb: 2 }}
            />
          </Grid>
        </Grid>

        <Button variant="contained" component="label" fullWidth sx={{
          mb: 2,
          backgroundColor: '#2a3342',
          color: '#fff',
          fontWeight: 'bold',
        }}>
          Upload Images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageChange}
          />
        </Button>

        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '10px' }}>
          {images.length > 0 && images.map((image, index) => (
            <img key={index} src={image} alt={`Drink ${index}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }} />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" sx={{ color: 'white' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" sx={{ backgroundColor: '#27ae60', color: 'white', '&:hover': { backgroundColor: '#2ecc71' } }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDrinks;
