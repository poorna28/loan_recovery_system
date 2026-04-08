// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5000/uploads';

// File types
export const ALLOWED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';

// Helper function to build file URLs
export const getFileUrl = (fileName) => {
  if (!fileName) return null;
  return `${UPLOAD_BASE_URL}/${fileName}`;
};
