/**
 * Formats a price as a string with Euro currency
 * @param price The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * Formats a date in Dutch format
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats a time in Dutch 24-hour format
 * @param date The date/time to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}; 