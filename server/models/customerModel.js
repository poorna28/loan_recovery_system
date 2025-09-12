const db = require('./db');

const Customer = {
  // Create a new customer
  createCustomer: async ({
    firstName, email, profileStatus, title, lastName, PhoneNumber, dateOfBirth, address, EmploymentStatus, AnnualIncome, creditScore
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO customers (firstName, email, PhoneNumber, dateOfBirth, address, EmploymentStatus, AnnualIncome, creditScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, email, profileStatus, title, lastName, PhoneNumber, dateOfBirth, address, EmploymentStatus, AnnualIncome, creditScore],
        (err, results) => {
          if (err) return reject(err);
          const insertId = results.insertId;
          const customerId = `USR${1000 + insertId}`;
          db.query(
            'UPDATE customers SET customer_id = ? WHERE id = ?',
            [customerId, insertId],
            (err2) => {
              if (err2) return reject(err2);
              resolve({ id: insertId, customerId });
            }
          );
        }
      );
    });
  },

  // Get all customers
  getAllCustomers: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM customers', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Delete a customer by customer_id
  deleteCustomer: (customerId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM customers WHERE customer_id = ?', [customerId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  updateCustomer: (customerId, {
    firstName,
    lastName,
    title,
    gender,
    dateOfBirth,
    nationality,
    email,
    PhoneNumber,
    primaryNumber,
    secondaryNumber,
    address,
    city,
    state,
    postalCode,
    profileStatus,
    employmentStatus,
    companyName,
    jobTitle,
    monthlyIncome,
    annualIncome,
    incomeProofDocument,
    creditScore,
    creditScoreBand,
    govtIdType,
    govtIdNumber,
    idIssueDate,
    idExpiryDate,
    addressProof,
    idDocumentUpload,
    customerPhoto
  }) => {
    return new Promise((resolve, reject) => {
      console.log('🔧 Updating customer:', customerId);
      console.log('📦 Payload:', {
        firstName,
        lastName,
        title,
        gender,
        dateOfBirth,
        nationality,
        email,
        PhoneNumber,
        primaryNumber,
        secondaryNumber,
        address,
        city,
        state,
        postalCode,
        profileStatus,
        employmentStatus,
        companyName,
        jobTitle,
        monthlyIncome,
        annualIncome,
        incomeProofDocument,
        creditScore,
        creditScoreBand,
        govtIdType,
        govtIdNumber,
        idIssueDate,
        idExpiryDate,
        addressProof,
        idDocumentUpload,
        customerPhoto
      });

      db.query(
        `UPDATE customers SET firstName = ?, email = ?, PhoneNumber = ?, dateOfBirth = ?, address = ?, EmploymentStatus = ?, AnnualIncome = ?, creditScore = ? WHERE customer_id = ?`,
        [firstName,
          lastName,
          title,
          gender,
          dateOfBirth,
          nationality,
          email,
          PhoneNumber,
          primaryNumber,
          secondaryNumber,
          address,
          city,
          state,
          postalCode,
          profileStatus,
          employmentStatus,
          companyName,
          jobTitle,
          monthlyIncome,
          annualIncome,
          incomeProofDocument,
          creditScore,
          creditScoreBand,
          govtIdType,
          govtIdNumber,
          idIssueDate,
          idExpiryDate,
          addressProof,
          idDocumentUpload,
          customerPhoto],
        (err, results) => {
          if (err) {
            console.error('❌ SQL Error:', err.sqlMessage || err.message);
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

};

module.exports = Customer;
