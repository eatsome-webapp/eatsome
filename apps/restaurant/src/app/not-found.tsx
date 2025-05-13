import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-neutral-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Pagina niet gevonden</h2>
        <p className="text-gray-600 mb-8">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="space-y-4">
          <Link 
            href="/" 
            className="block w-full bg-primary-500 hover:bg-primary-600 text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            Ga naar de homepage
          </Link>
          <Link 
            href="/dashboard"
            className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Ga naar het dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 