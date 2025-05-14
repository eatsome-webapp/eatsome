#!/bin/bash
# Dit script voegt shadcn/ui toe aan je project

# Zorg ervoor dat je in de UI package directory staat
cd "$(dirname "$0")/.."

# Maak een tijdelijk directory voor de installatie
mkdir -p temp/shadcn-ui

# Initialiseer shadcn in de UI package
echo "🚀 Initialiseren van shadcn/ui..."
pnpm dlx shadcn@latest init --yes \
  --tailwind-config=./tailwind.config.js \
  --tailwind-css=./src/styles/globals.css \
  --base-color=slate \
  --style=default \
  --components-dir=./src/components/ui \
  --utils-dir=./src/lib

# Installeer alle componenten
echo "🧩 Installeren van alle componenten..."
pnpm dlx shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge 
pnpm dlx shadcn@latest add button calendar card checkbox collapsible command
pnpm dlx shadcn@latest add context-menu dialog dropdown-menu form hover-card input
pnpm dlx shadcn@latest add label menubar navigation-menu popover progress radio-group
pnpm dlx shadcn@latest add scroll-area select separator sheet skeleton slider
pnpm dlx shadcn@latest add switch table tabs textarea toast toggle toggle-group tooltip

echo "✅ Alle shadcn/ui componenten zijn geïnstalleerd!"
echo "
Je kunt de componenten gebruiken in je code als volgt:

import { Button } from '@repo/ui/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui/components/ui/accordion';
"

# Optioneel: installeer de '--all' optie (als alternatief voor bovenstaande individuele installaties)
# Opmerking: deze optie installeert alle componenten in één keer
# echo "🧩 Installeren van alle componenten in één keer..."
# pnpm dlx shadcn@latest add --all

echo "🎉 Klaar! Shadcn/ui is nu geïnstalleerd en geconfigureerd in je project." 