#!/bin/bash
# Dit script installeert alle shadcn/ui componenten in één keer met de --all optie

# Zorg ervoor dat je in de UI package directory staat
cd "$(dirname "$0")/.."

# Initialiseer shadcn in de UI package
echo "🚀 Initialiseren van shadcn/ui..."
pnpm dlx shadcn@latest init --yes \
  --tailwind-config=./tailwind.config.js \
  --tailwind-css=./src/styles/globals.css \
  --base-color=slate \
  --style=default \
  --components-dir=./src/components/ui \
  --utils-dir=./src/lib

# Installeer alle componenten in één keer met de --all optie
echo "🧩 Installeren van alle componenten in één keer..."
pnpm dlx shadcn@latest add --all

echo "✅ Alle shadcn/ui componenten zijn geïnstalleerd!"
echo "
Je kunt de componenten gebruiken in je code als volgt:

import { Button } from '@repo/ui/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui/components/ui/accordion';
"

echo "🎉 Klaar! Shadcn/ui is nu geïnstalleerd en geconfigureerd in je project." 