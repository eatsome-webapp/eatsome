import React from 'react';
import Link from 'next/link';

export default function RestaurantHomePage() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Eatsome Restaurant Portal</h1>
      <p>Dit project gebruikt alleen de authenticatiefunctionaliteit.</p>
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Link href="/auth/login" style={{ color: 'blue', textDecoration: 'underline' }}>
            Inloggen
          </Link>
        </div>
        <div>
          <Link href="/auth/register" style={{ color: 'blue', textDecoration: 'underline' }}>
            Registreren
          </Link>
        </div>
      </div>
    </div>
  );
}
