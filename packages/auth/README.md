# @repo/auth - Eatsome Auth Package

Dit package bevat de authenticatie en autorisatie utilities voor het Eatsome platform, inclusief Supabase Auth integratie met Next.js 15.3+ en App Router.

## Supabase Auth met Next.js 15.3+

De manier waarop Supabase Auth geïntegreerd wordt met Next.js is significant veranderd in recente versies. Deze package volgt de nieuwste best practices:

### Belangrijke veranderingen

- **Nieuwe package @supabase/ssr**: De oudere `@supabase/auth-helpers-nextjs` package is gedepreceerd. We gebruiken nu `@supabase/ssr` voor server-side authentication.

- **Client-side vs. Server-side clients**: Er zijn nu twee verschillende Supabase clients:
  - `createBrowserClient`: Te gebruiken in client components
  - `createServerClient`: Te gebruiken in server components, server actions en route handlers

- **Middleware vereist voor Auth Session**: Next.js middleware is essentieel voor het vernieuwen van Auth tokens

### Directory Structuur

Elke app in de monorepo heeft een consistente structuur voor Supabase Auth:

```
app/
  utils/
    supabase/
      client.ts       # createBrowserClient voor Client Components
      server.ts       # createServerClient voor Server Components
      actions.ts      # Voor Server Actions
      route.ts        # Voor Route Handlers
  middleware.ts       # Auth middleware op root niveau
```

### Client-side Gebruik (in Client Components)

```tsx
'use client';

import { createClient } from '@/utils/supabase/client';

export default function ClientComponent() {
  // Maak client bij eerste render
  const supabase = createClient();
  
  // Gebruik in event handlers
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password',
    });
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

### Server-side Gebruik (in Server Components)

```tsx
import { getUser } from '@/utils/supabase/server';

export default async function ServerComponent() {
  // Altijd getUser() gebruiken in server code, NOOIT getSession()
  const user = await getUser();
  
  if (!user) {
    return <div>Niet ingelogd</div>;
  }
  
  return <div>Welkom, {user.email}</div>;
}
```

### In Server Actions

```tsx
'use server';

import { getUserInAction } from '@/utils/supabase/actions';

export async function myServerAction() {
  const user = await getUserInAction();
  
  if (!user) {
    throw new Error('Niet geautoriseerd');
  }
  
  // Voer actie uit...
  
  return { success: true };
}
```

### In Route Handlers (API Routes)

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { getUserInRouteHandler } from '@/utils/supabase/route';

export async function GET(request: NextRequest) {
  const user = await getUserInRouteHandler(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }
  
  return NextResponse.json({ message: 'Success' });
}
```

## Beveiligingsrichtlijnen

- Gebruik altijd `getUser()` in server code, nooit `getSession()` omdat die laatste niet garandeert dat de auth token wordt gevalideerd.
- Controleer altijd op rollen en rechten met de juiste utility functies in `@repo/auth/roles`.
- Zorg ervoor dat middleware correct is ingesteld voor token vernieuwing.

## Rolgebaseerde Toegangscontrole (RBAC)

Bekijk de RBAC utilities in `@repo/auth/roles` voor informatie over rolgebaseerde toegangscontrole in het Eatsome platform. 