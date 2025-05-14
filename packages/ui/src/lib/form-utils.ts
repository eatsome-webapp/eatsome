export type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export const validateRequired = (message = 'This field is required'): ValidationRule => ({
  validate: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },
  message,
});

export const validateEmail = (message = 'Please enter a valid email address'): ValidationRule => ({
  validate: (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  },
  message,
});

export const validateMinLength = (minLength: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (typeof value === 'string') {
      return value.length >= minLength;
    }
    return false;
  },
  message: message || `Must be at least ${minLength} characters`,
});

export const validateMatch = (matchValue: any, message = 'Values do not match'): ValidationRule => ({
  validate: (value) => value === matchValue,
  message,
});

export const validatePhone = (message = 'Please enter a valid phone number'): ValidationRule => ({
  validate: (value) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(value.replace(/\s+/g, ''));
  },
  message,
});

export const validateUrl = (message = 'Please enter a valid URL'): ValidationRule => ({
  validate: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message,
});

export const validateNumber = (message = 'Please enter a valid number'): ValidationRule => ({
  validate: (value) => !isNaN(Number(value)),
  message,
});

export const validateRange = (min: number, max: number, message?: string): ValidationRule => ({
  validate: (value) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  },
  message: message || `Value must be between ${min} and ${max}`,
});

// Helper to run multiple validations
export const validateValue = (value: any, rules: ValidationRule[]): { isValid: boolean; error?: string } => {
  for (const rule of rules) {
    const isValid = rule.validate(value);
    if (!isValid) {
      return { isValid, error: rule.message };
    }
  }
  
  return { isValid: true };
}; 