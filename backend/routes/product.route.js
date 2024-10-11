import express from "express";
import multer from "multer";
import {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

router.get("/prod-list", getProducts);
router.get("/prod-change/:id", getOneProduct);
router.post("/products", upload.single("image"), addProduct);
router.put("/prod-change/:id", upload.single("image"), updateProduct);
router.delete("/prod-delete/:id", deleteProduct);

export default router;
