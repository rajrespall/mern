import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
};

export const upload = multer({ storage, fileFilter }).array('images', 10); // Adjust the field name and max count as needed

export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('profileImage'); // Specific field name for profile image