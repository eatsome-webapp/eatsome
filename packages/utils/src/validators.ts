/**
 * Validates if a string is a valid email format
 * @param email The email to validate
 * @returns True if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is empty or only whitespace
 * @param value The string to validate
 * @returns True if the string is empty or only whitespace
 */
export const isEmpty = (value: string): boolean => {
  return value.trim() === '';
};

/**
 * Validates if a value is within a specified range
 * @param value The value to validate
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns True if the value is within the specified range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
}; 