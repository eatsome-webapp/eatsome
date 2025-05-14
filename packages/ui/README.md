# @repo/ui

Dit pakket bevat de UI componenten voor het Eatsome platform, inclusief:

- Gedeelde UI-componenten gemaakt met shadcn/ui en Tailwind CSS
- Specifieke componenten voor restaurants, bestellingen en gebruikers
- Layout componenten en animaties
- Utility functies voor styling en interacties

## Gebruik

Import componenten in je Next.js applicatie:

```tsx
import { Button, LayeredCard, ResponsiveCardGrid } from "@repo/ui";
import "@repo/ui/styles.css"; // Importeer dit in je globale CSS
```

## Shadcn/UI Componenten

Dit pakket gebruikt shadcn/ui componenten als basis. Alle componenten zijn al geïnstalleerd en beschikbaar in de `components/ui` directory.

### shadcn/ui Installeren of Bijwerken

Als je shadcn/ui componenten wilt bijwerken of opnieuw installeren, kun je de volgende methoden gebruiken:

1. **Alle componenten in één keer installeren:**

```bash
# In de root van de monorepo
pnpm --filter @repo/ui install-shadcn-all
```

2. **Individuele componenten beheren:**

```bash
# Een component toevoegen
pnpm --filter @repo/ui shadcn add button

# Alle componenten bekijken
pnpm --filter @repo/ui shadcn
```

## Eatsome Componenten

Naast de standaard shadcn/ui componenten, bevat dit pakket ook specifieke componenten voor het Eatsome platform:

### Food Componenten

- `MenuItemCard`: Kaarten voor menu-items
- `RestaurantCard`: Kaarten voor restaurants
- `ExpandableMenuItem`: Uitklapbare menu-items met opties
- `OrderSummary`: Besteloverzicht component

### Layout Componenten

- `ResponsiveCardGrid`: Responsive grid layout voor kaarten
- `CardStack`: Gestapelde kaart layout
- `CardHeader`: Header component met scroll animatie
- `CardPageLayout`: Volledige pagina layout met kaarten

### Admin Componenten

- `CardSidebar`: Inklapbare zijbalk met navigatie
- `OrderCard`: Bestelkaart met statusindicatoren

## Utilities

- `gsap-animations.ts`: Animatie utilities met GSAP
- `card-utils.ts`: Helper functies voor kaart expansie en stacks
- `utils.ts`: Algemene utility functies

## Ontwikkeling

```bash
# Start de ontwikkelomgeving
pnpm dev

# Bouw het pakket
pnpm build
``` 