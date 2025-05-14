const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Lijst van shadcn/ui componenten die geïnstalleerd moeten worden
// Dit vervangt alle Radix UI componenten
const components = [
  'accordion',
  'alert',
  'alert-dialog',
  'aspect-ratio',
  'avatar',
  'badge',
  'button',
  'calendar',
  'card',
  'checkbox',
  'collapsible',
  'command',
  'context-menu',
  'dialog',
  'dropdown-menu',
  'form',
  'hover-card',
  'input',
  'label',
  'menubar',
  'navigation-menu',
  'popover',
  'progress',
  'radio-group',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'skeleton',
  'slider',
  'switch',
  'table',
  'tabs',
  'textarea',
  'toast',
  'toggle',
  'toggle-group',
  'tooltip',
];

// Pad naar de ui package directory
const uiDir = path.resolve(__dirname, '..');

// Zorg ervoor dat de ui/components/ui directory bestaat
const componentsDir = path.join(uiDir, 'src', 'components', 'ui');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Zorg ervoor dat de lib directory bestaat
const libDir = path.join(uiDir, 'src', 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Maak de utils.ts file aan als deze nog niet bestaat
const utilsPath = path.join(libDir, 'utils.ts');
if (!fs.existsSync(utilsPath)) {
  fs.writeFileSync(
    utilsPath,
    `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
  );
  console.log('✅ Created utils.ts');
}

// Installeer alle benodigde shadcn/ui componenten
console.log('🔄 Installeren van shadcn/ui componenten...');

try {
  // Initialiseer shadcn in de UI package als dit nog niet is gedaan
  console.log('🚀 Initialiseren van shadcn/ui...');
  execSync('pnpm dlx shadcn@latest init --yes ' +
    '--tailwind-config=./tailwind.config.js ' +
    '--tailwind-css=./src/styles/globals.css ' +
    '--base-color=slate ' +
    '--style=default ' +
    '--components-dir=./src/components/ui ' +
    '--utils-dir=./src/lib', { cwd: uiDir, stdio: 'inherit' });

  // Installeer elk component
  for (const component of components) {
    console.log(`📦 Installeren van component: ${component}`);
    execSync(`pnpm dlx shadcn@latest add ${component}`, { cwd: uiDir, stdio: 'inherit' });
  }

  console.log(`
✅ Alle shadcn/ui componenten zijn geïnstalleerd!

Gebruik ze in je code als volgt:

import { Button } from "@repo/ui/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@repo/ui/components/ui/accordion";
// etc...

Deze componenten bieden dezelfde functionaliteit als Radix UI, maar met geïntegreerde Tailwind styling.
`);
} catch (error) {
  console.error('❌ Er is een fout opgetreden bij het installeren van shadcn/ui componenten:', error);
  process.exit(1);
} 