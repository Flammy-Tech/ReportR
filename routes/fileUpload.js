const express = require('express');
const multer = require('multer');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/') // Files will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original file name
  }
})

const upload = multer({ storage: storage });

// Render the file upload form
router.get('/', (req, res) => {
  res.render('fileUpload');
});

// Handle file upload
router.post('/', upload.single('file'), (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // If file was uploaded, log the filename to the console
  console.log('File uploaded:', req.file.originalname);

  // Send success message
  res.send('File uploaded successfully');
});

module.exports = router;
