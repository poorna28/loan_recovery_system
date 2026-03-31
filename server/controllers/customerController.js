const customerModel = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
  try {
    // Remove auto-generated fields that should not be set by client
    const { customer_id, id, ...bodyData } = req.body;
    
    const payload = {
      ...bodyData,
      // Address Proof
      addressProof:
        req.files?.addressProof?.[0]?.savedAs ||
        bodyData.addressProof ||
        null,

      addressProofOriginal:
        req.files?.addressProof?.[0]?.originalname ||
        bodyData.addressProofOriginal ||
        null,

      // ID Document
      idDocumentUpload:
        req.files?.idDocumentUpload?.[0]?.savedAs ||
        bodyData.idDocumentUpload ||
        null,

      idDocumentUploadOriginal:
        req.files?.idDocumentUpload?.[0]?.originalname ||
        bodyData.idDocumentUploadOriginal ||
        null,

      // Customer Photo
      customerPhoto:
        req.files?.customerPhoto?.[0]?.savedAs ||
        bodyData.customerPhoto ||
        null,

      customerPhotoOriginal:
        req.files?.customerPhoto?.[0]?.originalname ||
        bodyData.customerPhotoOriginal ||
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

    const customers = await customerModel.getCustomersWithLoanCount();

    res.status(200).json({ customers });
  } catch (err) {
    console.error('❌ Error fetching customers:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
        res.set('Cache-Control', 'no-store'); // disable caching

    const { customer_id  } = req.params;
    await customerModel.deleteCustomer(customer_id );
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
        res.set('Cache-Control', 'no-store'); // disable caching

    const { customer_id  } = req.params;

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

    await customerModel.updateCustomer(customer_id , payload);

    res.status(200).json({ message: 'Customer updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
        res.set('Cache-Control', 'no-store'); // disable caching

    const { customer_id } = req.params;
    const customer = await customerModel.getCustomerById(customer_id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



