const db = require('./db');

const Customer = {
  // Create a new customer
createCustomer: async (data) => {
  const {
    firstName,
    lastName,
    title,
    email,
    phoneNumber,
    primaryNumber,
    secondaryNumber,
    dateOfBirth,
    gender,
    nationality,
    address,
    city,
    state,
    postalCode,
    profileStatus,
    employmentStatus,
    jobTitle,
    annualIncome,
    incomeProofDocument,
    creditScore,
    govtIdType,
    govtIdNumber,
    addressProof,
    idDocumentUpload,
    customerPhoto,
    idDocumentUploadOriginal,
    addressProofOriginal,
    customerPhotoOriginal
  } = data;

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO customers (
      firstName, lastName, title, email, phoneNumber, primaryNumber, secondaryNumber,
      dateOfBirth, gender, nationality, address, city, state, postalCode, profileStatus,
      employmentStatus, jobTitle, annualIncome, incomeProofDocument,
      creditScore, govtIdType, govtIdNumber,
      addressProof, idDocumentUpload, customerPhoto,
      idDocumentUploadOriginal, addressProofOriginal, customerPhotoOriginal
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      firstName,
      lastName,
      title,
      email,
      phoneNumber,
      primaryNumber,
      secondaryNumber,
      dateOfBirth || null,
      gender,
      nationality,
      address,
      city,
      state,
      postalCode,
      profileStatus,
      employmentStatus,
      jobTitle,
      annualIncome || null,
      incomeProofDocument,
      creditScore || null,
      govtIdType,
      govtIdNumber,
      addressProof,
      idDocumentUpload,
      customerPhoto,
      idDocumentUploadOriginal,
      addressProofOriginal,
      customerPhotoOriginal
    ];

    db.query(sql, values, (err, results) => {
      if (err) return reject(err);

      const insertId = results.insertId;
      const customerId = `customer-delete-USR${1000 + insertId}`;

      db.query(
        'UPDATE customers SET customer_id = ? WHERE id = ?',
        [customerId, insertId],
        (err2) => {
          if (err2) return reject(err2);
          resolve({ id: insertId, customerId });
        }
      );
    });
  });
},

  
  // Update existing customer
updateCustomer: async (customerId, data) => {
  const {
    firstName,
    lastName,
    title,
    email,
    phoneNumber,
    primaryNumber,
    secondaryNumber,
    dateOfBirth,
    gender,
    nationality,
    address,
    city,
    state,
    postalCode,
    profileStatus,
    employmentStatus,
    jobTitle,
    annualIncome,
    incomeProofDocument,
    creditScore,
    govtIdType,
    govtIdNumber,
    addressProof,
    idDocumentUpload,
    customerPhoto,
    idDocumentUploadOriginal,
    addressProofOriginal,
    customerPhotoOriginal
  } = data;

  return new Promise((resolve, reject) => {
    const sql = `UPDATE customers SET
      firstName=?, lastName=?, title=?, email=?, phoneNumber=?, primaryNumber=?, secondaryNumber=?,
      dateOfBirth=?, gender=?, nationality=?, address=?, city=?, state=?, postalCode=?, profileStatus=?,
      employmentStatus=?, jobTitle=?, annualIncome=?, incomeProofDocument=?,
      creditScore=?, govtIdType=?, govtIdNumber=?,
      addressProof=?, idDocumentUpload=?, customerPhoto=?,
      idDocumentUploadOriginal=?, addressProofOriginal=?, customerPhotoOriginal=?
      WHERE customer_id=?`;

    const values = [
      firstName,
      lastName,
      title,
      email,
      phoneNumber,
      primaryNumber,
      secondaryNumber,
      dateOfBirth || null,
      gender,
      nationality,
      address,
      city,
      state,
      postalCode,
      profileStatus,
      employmentStatus,
      jobTitle,
      annualIncome || null,
      incomeProofDocument,
      creditScore || null,
      govtIdType,
      govtIdNumber,
      addressProof,
      idDocumentUpload,
      customerPhoto,
      idDocumentUploadOriginal,
      addressProofOriginal,
      customerPhotoOriginal,
      customerId
    ];

    db.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
},

  // Get all customers
  getAllCustomers: async () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM customers', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Delete a customer by customer_id
  deleteCustomer: async (customerId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM customers WHERE customer_id = ?', [customerId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getCustomersWithLoanCount: async () => {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT 
        c.customer_id,
        c.firstName,
        c.lastName,
        c.email,
        c.phoneNumber,
        c.employmentStatus,
        c.profileStatus,
        c.annualIncome,
        c.creditScore,
        COUNT(l.id) AS loan_count
      FROM customers c
      LEFT JOIN loan_customer l
        ON c.customer_id = l.customer_id
      GROUP BY 
        c.customer_id,
        c.firstName,
        c.lastName,
        c.email,
        c.phoneNumber,
        c.employmentStatus,
        c.profileStatus,
        c.annualIncome,
        c.creditScore
    `;
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  getCustomerById: async (customer_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM customers WHERE customer_id = ?',
        [customer_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0] || null);
        }
      );
    });
  }


};

module.exports = Customer;
