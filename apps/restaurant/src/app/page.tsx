import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect naar de staff login pagina (later kunnen we hier een keuze-pagina maken)
  redirect('/staff-login');
} 