/**
 * Query Builder Utility
 * Builds consistent query parameters for API requests
 */

/**
 * Build query string from filter object
 * @param {Object} filters - Filter object
 * @param {string} filters.search - Search term
 * @param {string} filters.sortBy - Sort field
 * @param {string} filters.sortOrder - 'asc' or 'desc'
 * @param {number} filters.page - Page number (1-indexed)
 * @param {number} filters.limit - Records per page
 * @param {string} filters.status - Status filter
 * @param {string} filters.employment - Employment status filter
 * @param {string} filters.loanStatus - Loan status filter
 * @returns {string} - Query string (without leading ?)
 */
export const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  // Standard filters
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  // Status filters
  if (filters.status) params.append('status', filters.status);
  if (filters.employment) params.append('employment', filters.employment);
  if (filters.loanStatus) params.append('loanStatus', filters.loanStatus);
  if (filters.profileStatus) params.append('profileStatus', filters.profileStatus);
  if (filters.employmentStatus) params.append('employmentStatus', filters.employmentStatus);

  // Date filters
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);

  // Custom filters
  if (filters.customFilter) {
    Object.entries(filters.customFilter).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  return params.toString();
};

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base endpoint
 * @param {Object} filters - Filter object
 * @returns {string} - Complete URL with query string
 */
export const buildUrl = (baseUrl, filters = {}) => {
  const queryString = buildQueryString(filters);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Build payload for POST/PUT requests
 * @param {Object} data - Form data
 * @param {Object} options - Options
 * @returns {Object} - Formatted payload
 */
export const buildPayload = (data = {}, options = {}) => {
  const {
    excludeFields = [],
    includeFields = null,
    transformFields = {}
  } = options;

  let payload = { ...data };

  // Remove excluded fields
  excludeFields.forEach(field => {
    delete payload[field];
  });

  // Keep only included fields if specified
  if (includeFields && Array.isArray(includeFields)) {
    payload = {};
    includeFields.forEach(field => {
      if (field in data) payload[field] = data[field];
    });
  }

  // Transform fields
  Object.entries(transformFields).forEach(([oldKey, newKey]) => {
    if (oldKey in payload) {
      payload[newKey] = payload[oldKey];
      delete payload[oldKey];
    }
  });

  // Remove null and undefined values
  Object.keys(payload).forEach(key => {
    if (payload[key] === null || payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
};

/**
 * Get default filter state
 * @returns {Object} - Default filters
 */
export const getDefaultFilters = () => ({
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: 10,
  status: '',
  customFilter: {}
});
