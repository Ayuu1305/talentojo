/**
 * Validation Middleware for Form Inputs
 * Requirements:
 * - Name: Min 20 characters, Max 60 characters.
 * - Address: Max 400 characters.
 * - Password: 8-16 characters, must include at least one uppercase letter and one special character.
 * - Email: Must follow standard email validation rules.
 */

// Helper: Validate email format
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Helper: Validate password rules (8-16 chars, >= 1 uppercase, >= 1 special character)
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 16) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  return hasUppercase && hasSpecialChar;
};

// Helper: Validate Name length (20 - 60 chars)
const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 20 && trimmed.length <= 60;
};

// Helper: Validate Address length (<= 400 chars)
const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return trimmed.length > 0 && trimmed.length <= 400;
};

/**
 * Middleware to validate User Registration and User Creation inputs
 */
const validateUserRegistration = (req, res, next) => {
  const { name, email, password, address, role } = req.body;
  const errors = [];

  // Name validation
  if (!name || !name.trim()) {
    errors.push('Name is required.');
  } else if (name.trim().length < 20 || name.trim().length > 60) {
    errors.push('Name must be between 20 and 60 characters long.');
  }

  // Email validation
  if (!email || !email.trim()) {
    errors.push('Email is required.');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required.');
  } else if (!isValidPassword(password)) {
    errors.push('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
  }

  // Address validation
  if (!address || !address.trim()) {
    errors.push('Address is required.');
  } else if (address.trim().length > 400) {
    errors.push('Address cannot exceed 400 characters.');
  }

  // Role validation (if provided)
  if (role && !['admin', 'user', 'store_owner'].includes(role)) {
    errors.push('Role must be one of: admin, user, store_owner.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate Store creation inputs
 */
const validateStoreCreation = (req, res, next) => {
  const { name, email, address } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Store name is required.');
  } else if (name.trim().length > 60) {
    errors.push('Store name cannot exceed 60 characters.');
  }

  if (!email || !email.trim()) {
    errors.push('Store email is required.');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!address || !address.trim()) {
    errors.push('Store address is required.');
  } else if (address.trim().length > 400) {
    errors.push('Address cannot exceed 400 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate Password Update inputs
 */
const validatePasswordUpdate = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push('Current password is required.');
  }

  if (!newPassword) {
    errors.push('New password is required.');
  } else if (!isValidPassword(newPassword)) {
    errors.push('New password must be 8-16 characters and contain at least one uppercase letter and one special character.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
  validateUserRegistration,
  validateStoreCreation,
  validatePasswordUpdate,
};
