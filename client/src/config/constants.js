// API Configuration
// <<<<<<< HEAD
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://loan-recovery-system-7vv5.onrender.com';
export const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'https://loan-recovery-system-7vv5.onrender.com';
// =======
// export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// export const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5000/uploads';
// >>>>>>> 06eb77230932ab7784391e9b63e7d1558b33ac85

// File types
export const ALLOWED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';

// Helper function to build file URLs
export const getFileUrl = (fileName) => {
  if (!fileName) return null;
  return `${UPLOAD_BASE_URL}/${fileName}`;
};
