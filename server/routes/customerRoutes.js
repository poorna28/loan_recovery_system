// const express = require('express');
// const router = express.Router();
// const customerController = require('../controllers/customerController');
// const multer = require('multer');
// const path = require('path');

// // Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
// filename: (req, file, cb) => {
//   const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
//   file.savedAs = uniqueName + path.extname(file.originalname);
//   cb(null, file.savedAs);
// }

// });

// const upload = multer({ storage });

// // Multer fields
// const uploadFields = upload.fields([
//   { name: 'addressProof', maxCount: 1 },
//   { name: 'idDocumentUpload', maxCount: 1 },
//   { name: 'customerPhoto', maxCount: 1 }
// ]);

// router.post('/basic_info', uploadFields, customerController.createCustomer);
// router.put('/customers/:id', uploadFields, customerController.updateCustomer);
// router.get('/customers/:customer_id', customerController.getCustomerById);

// router.get('/customers', customerController.getAllCustomers);
// router.delete('/customers/:id', customerController.deleteCustomer);

// module.exports = router;


const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const multer = require('multer');
const path = require('path');
const { validateCustomer, validateIdParam } = require('../middlewares/validationMiddleware');

/* ========= Multer config (unchanged) ========= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads folder if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    file.savedAs = uniqueName + path.extname(file.originalname);
    cb(null, file.savedAs);
  }
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'addressProof', maxCount: 1 },
  { name: 'idDocumentUpload', maxCount: 1 },
  { name: 'customerPhoto', maxCount: 1 }
]);

/* ========= ROUTES WITH VALIDATION ========= */

// Create with validation
router.post('/customers', uploadFields, validateCustomer, customerController.createCustomer);

// Read
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:customer_id', customerController.getCustomerById);

// Update with validation
router.put(
  '/customers/:customer_id',
  uploadFields,
  validateCustomer,
  customerController.updateCustomer
);

// Delete with validation
router.delete(
  '/customers/:customer_id',
  customerController.deleteCustomer
);

module.exports = router;
