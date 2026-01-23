const customerModel = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
  try {
const payload = {
  ...req.body,
// Address Proof
      addressProof:
        req.files?.addressProof?.[0]?.savedAs ||
        req.body.addressProof ||
        null,

      addressProofOriginal:
        req.files?.addressProof?.[0]?.originalname ||
        req.body.addressProofOriginal ||
        null,

      // ID Document
      idDocumentUpload:
        req.files?.idDocumentUpload?.[0]?.savedAs ||
        req.body.idDocumentUpload ||
        null,

      idDocumentUploadOriginal:
        req.files?.idDocumentUpload?.[0]?.originalname ||
        req.body.idDocumentUploadOriginal ||
        null,

      // Customer Photo
      customerPhoto:
        req.files?.customerPhoto?.[0]?.savedAs ||
        req.body.customerPhoto ||
        null,

      customerPhotoOriginal:
        req.files?.customerPhoto?.[0]?.originalname ||
        req.body.customerPhotoOriginal ||
        null
};


    const customer = await customerModel.createCustomer(payload);

    res.status(201).json({
      message: 'Customer created',
      customerId: customer.customerId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store'); // disable caching
    const customers = await customerModel.getAllCustomers();
    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await customerModel.deleteCustomer(id);
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = {
      ...req.body,

      // Address Proof
      addressProof:
        req.files?.addressProof?.[0]?.savedAs ||
        req.body.addressProof ||
        null,

      addressProofOriginal:
        req.files?.addressProof?.[0]?.originalname ||
        req.body.addressProofOriginal ||
        null,

      // ID Document
      idDocumentUpload:
        req.files?.idDocumentUpload?.[0]?.savedAs ||
        req.body.idDocumentUpload ||
        null,

      idDocumentUploadOriginal:
        req.files?.idDocumentUpload?.[0]?.originalname ||
        req.body.idDocumentUploadOriginal ||
        null,

      // Customer Photo
      customerPhoto:
        req.files?.customerPhoto?.[0]?.savedAs ||
        req.body.customerPhoto ||
        null,

      customerPhotoOriginal:
        req.files?.customerPhoto?.[0]?.originalname ||
        req.body.customerPhotoOriginal ||
        null
    };

    await customerModel.updateCustomer(id, payload);

    res.status(200).json({ message: 'Customer updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


