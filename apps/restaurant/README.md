# Restaurant App

This is the restaurant management application for the Eatsome platform, built with Next.js 14, React 19, and Supabase.

## Prerequisites

- Node.js 18.0.0 or later
- pnpm 8.x or later
- Supabase account and project

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/eatsome.git
   cd eatsome
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Copy the `.env.example` file to `.env.local` and update the values:
   ```bash
   cp apps/restaurant/.env.example apps/restaurant/.env.local
   ```
   Update the values in `.env.local` with your Supabase credentials.

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS 4.1.6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion & GSAP
- **Icons**: Lucide React
- **UI Components**: Radix UI + Custom Components

## Project Structure

```
apps/restaurant/
├── app/                    # App Router pages and layouts
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
├── public/                 # Static assets
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions and hooks
```

## Environment Variables

Create a `.env.local` file in the `apps/restaurant` directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Next Auth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Deployment

The app can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
