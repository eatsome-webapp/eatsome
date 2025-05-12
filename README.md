# Eatsome

Eatsome is a modern food ordering platform built with Next.js and Supabase.

## Project Structure

This is a monorepo managed with Turborepo and contains the following:

### Apps

- `apps/restaurant` - Restaurant management application (port 3001)
- `apps/customer` - Customer-facing application (port 3002)
- `apps/admin` - Admin dashboard application (port 3003)

### Packages

- `packages/ui` - Shared UI components
- `packages/auth` - Supabase authentication utilities
- `packages/utils` - Common utility functions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.9.0+

### Installation

```bash
# Install dependencies
pnpm install

# Start all applications in development mode
pnpm dev
```

To run a specific app:

```bash
pnpm dev --filter=customer
```

## Tech Stack

- **Framework**: Next.js 15
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo

## Color Palette

### Primary Colors (Yellow-Based)
- Primary-50: #FFFBEB - Very light yellow
- Primary-100: #FFF5CC - Light yellow
- Primary-200: #FFEDB3 - Light yellow
- Primary-300: #FFE280 - Medium yellow
- Primary-400: #FFD600 - Bright yellow
- Primary-500: #FFD600 - Base yellow (primary color)
- Primary-600: #E6BF00 - Deeper yellow
- Primary-700: #CCAA00 - Dark yellow
- Primary-800: #998000 - Very dark yellow
- Primary-900: #665500 - Almost brown
- Primary-950: #332B00 - Deep brown

### Neutral Colors
- Neutral-0: #FFFFFF - White
- Neutral-50: #FAFAFA - Almost white
- Neutral-100: #F2F2F2 - Very light gray
- Neutral-200: #E6E6E6 - Light gray
- Neutral-300: #CCCCCC - Gray
- Neutral-400: #B3B3B3 - Medium gray
- Neutral-500: #808080 - Dark gray
- Neutral-600: #4D4D4D - Darker gray
- Neutral-700: #333333 - Primary Text color
- Neutral-800: #1A1A1A - Very dark gray
- Neutral-900: #0A0A0A - Almost black
- Neutral-950: #000000 - Deep black 