
// Input validation helpers for authentication
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateAdminCredentials = (username: string, password: string): boolean => {
  return typeof username === 'string' && 
         typeof password === 'string' && 
         username.trim().length > 0 && 
         password.length > 0;
};
