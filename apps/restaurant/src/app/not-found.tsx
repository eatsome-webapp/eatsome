import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1>404 - Pagina niet gevonden</h1>
      <p>De pagina die je zoekt bestaat niet of is verplaatst.</p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Ga naar de homepage
        </Link>
      </div>
    </div>
  );
} 