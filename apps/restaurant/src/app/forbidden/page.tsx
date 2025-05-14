import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-3 text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/staff-login" 
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-center"
          >
            Return to Login
          </Link>
          
          <Link 
            href="/" 
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 