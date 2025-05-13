import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <div className="mt-4 text-gray-600">
            <p>There was a problem with the authentication process.</p>
            <p className="mt-2">Possible reasons:</p>
            <ul className="mt-2 list-disc list-inside text-left">
              <li>The verification link has expired</li>
              <li>The link was already used</li>
              <li>There was a technical issue with the verification process</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 pt-4">
          <Link 
            href="/auth/login" 
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition duration-200"
          >
            Return to Login
          </Link>
          
          <Link 
            href="/" 
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center rounded-md transition duration-200"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
} 