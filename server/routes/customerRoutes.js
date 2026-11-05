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
const fs = require('fs');
const { validateCustomer, validateIdParam } = require('../middlewares/validationMiddleware');
<<<<<<< HEAD
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

=======
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

/* ========= Multer config (unchanged) ========= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads folder if it doesn't exist
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
<<<<<<< HEAD
router.post('/customers', authMiddleware, authorizeRoles('Admin','Manager','Staff'), uploadFields, validateCustomer, customerController.createCustomer);

// Read
router.get('/customers', authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant','Auditor','Customer Service'), customerController.getAllCustomers);
router.get('/customers/:customer_id', authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant','Auditor','Customer Service'), customerController.getCustomerById);
=======
router.post('/customers', uploadFields, validateCustomer, customerController.createCustomer);

// Read
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:customer_id', customerController.getCustomerById);
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

// Update with validation
router.put(
  '/customers/:customer_id',
<<<<<<< HEAD
  authMiddleware,
  authorizeRoles('Admin','Manager','Staff','Customer Service'),
=======
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
  uploadFields,
  validateCustomer,
  customerController.updateCustomer
);

// Delete with validation
router.delete(
<<<<<<< HEAD
  '/customers/:customer_id', authMiddleware, authorizeRoles('Admin'), customerController.deleteCustomer
=======
  '/customers/:customer_id',
  customerController.deleteCustomer
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
);

module.exports = router;
