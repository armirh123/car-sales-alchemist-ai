
// Input validation functions for authentication
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 255;
};

export const validatePassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6 && password.length <= 128;
};

export const validateAdminCredentials = (username: string, password: string): boolean => {
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return false;
  }
  return username.trim().length > 0 && password.length > 0;
};

// Sanitize string inputs to prevent XSS
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};
