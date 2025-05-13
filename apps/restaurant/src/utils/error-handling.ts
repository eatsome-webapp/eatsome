// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Custom error class for validation errors
export class ValidationError extends Error {
  fields: Record<string, string>;
  
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

// Custom error class for authentication errors
export class AuthError extends Error {
  constructor(message: string = 'Je bent niet geautoriseerd voor deze actie') {
    super(message);
    this.name = 'AuthError';
  }
}

// Helper to handle errors from Supabase client
export function handleSupabaseError(error: any): never {
  console.error('Supabase error:', error);
  
  if (error.code === 'PGRST301') {
    throw new AuthError('Je hebt geen toegang tot deze gegevens');
  }
  
  if (error.code === '42501') {
    throw new AuthError('Je hebt geen rechten om deze actie uit te voeren');
  }
  
  if (error.code === '23505') {
    throw new ValidationError('Deze gegevens bestaan al', {
      [error.details.split('=')[0].replace(/[()]/g, '').trim()]: 
        'Deze waarde bestaat al in het systeem'
    });
  }
  
  throw new ApiError(
    error.message || 'Er is een fout opgetreden bij het verwerken van je verzoek',
    error.status || 500
  );
}

// Format error message for display
export function formatErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  if (error instanceof AuthError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Er is een onbekende fout opgetreden';
}

// Function to safely parse error response from API
export async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.message || data.error || 'Er is een fout opgetreden';
  } catch (e) {
    return 'Er is een fout opgetreden bij het verwerken van je verzoek';
  }
} 