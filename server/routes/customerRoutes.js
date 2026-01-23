const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
filename: (req, file, cb) => {
  const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
  file.savedAs = uniqueName + path.extname(file.originalname);
  cb(null, file.savedAs);
}

});

const upload = multer({ storage });

// Multer fields
const uploadFields = upload.fields([
  { name: 'addressProof', maxCount: 1 },
  { name: 'idDocumentUpload', maxCount: 1 },
  { name: 'customerPhoto', maxCount: 1 }
]);

router.post('/basic_info', uploadFields, customerController.createCustomer);
router.put('/customers/:id', uploadFields, customerController.updateCustomer);

router.get('/customers', customerController.getAllCustomers);
router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;
