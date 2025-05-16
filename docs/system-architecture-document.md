# System Architecture Document

## 1. Overall Architecture Overview

### 1.1 Architecture Style
The All-in-One Food Platform implements a modern microservices-oriented architecture using a monorepo structure. This approach allows for independent development and deployment of multiple applications while sharing common code through internal packages.

### 1.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Applications                        │
├───────────────┬───────────────┬────────────────┬───────────────────┤
│  Customer App │  Courier App  │ Restaurant App │   Admin App       │
│  (Next.js)    │  (Next.js)    │  (Next.js)     │   (Next.js)       │
└───────┬───────┴───────┬───────┴────────┬───────┴─────────┬─────────┘
        │               │                │                 │
        ▼               ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Shared Components & Utilities                │
├─────────────┬───────────────┬────────────────┬──────────────────────┤
│    @repo/ui │  @repo/auth   │   @repo/i18n   │   Other shared libs  │
└─────────────┴───────┬───────┴────────────────┴──────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Backend Services                            │
├─────────────┬───────────────┬────────────────┬──────────────────────┤
│  Supabase   │    Stripe     │  Google Maps   │   OpenAI             │
│  Database   │    Payments   │  Platform      │   API                │
│  Auth       │    Connect    │  Geocoding     │                      │
│  Storage    │              │  Routes         │                      │
│  Realtime   │              │                │                      │
│  Edge Funcs │              │                │                      │
└─────────────┴───────────────┴────────────────┴──────────────────────┘
```

### 1.3 Key Technology Choices

1. **Monorepo Management**
   - Turborepo 2.5.3 for build orchestration and dependency management
   - pnpm for efficient package management

2. **Frontend Framework**
   - Next.js 15.3+ utilizing the App Router architecture
   - React 19 for UI component development
   - TypeScript for type safety

3. **Backend Services**
   - Supabase as the primary backend platform
   - PostgreSQL for data storage with PostGIS extensions
   - Row Level Security (RLS) for data access control
   - Supabase Auth for authentication and authorization
   - Supabase Realtime for real-time updates
   - Supabase Edge Functions for serverless computing

4. **Additional Services**
   - Stripe for payment processing
   - Google Maps Platform for mapping and location services
   - OpenAI API for AI and personalization features

5. **Deployment & Infrastructure**
   - Vercel for hosting and serverless functions
   - GitHub Actions for CI/CD pipeline
   - Docker for containerization (optional)

## 2. Application Architecture

### 2.1 Monorepo Structure

```
eatsome/
├── apps/
│   ├── customer/      # Customer-facing web application
│   ├── courier/       # Delivery personnel application
│   ├── restaurant/    # Restaurant management application
│   └── admin/         # Platform administration application
├── packages/
│   ├── ui/            # Shared UI components
│   ├── auth/          # Authentication utilities
│   ├── database/      # Database types and utilities
│   ├── i18n/          # Internationalization support
│   ├── eslint-config/ # Shared ESLint configuration
│   └── tsconfig/      # Shared TypeScript configuration
└── turbo.json         # Turborepo configuration
```

### 2.2 Application Structure (Next.js Apps)

Each application follows a similar structure based on the Next.js 15 App Router pattern:

```
app/
├── [locale]/          # Locale-based routing
│   ├── (auth)/        # Authentication routes
│   │   └── login/     # Login page
│   ├── (staff)/       # Staff-facing routes (restaurant app)
│   │   ├── orders/    # Orders management
│   │   ├── kitchen/   # Kitchen display
│   │   └── tables/    # Table management
│   └── (admin)/       # Admin-facing routes (restaurant app)
│       ├── dashboard/ # Admin dashboard
│       ├── menu/      # Menu management
│       └── settings/  # Restaurant settings
├── api/               # API routes (where needed)
│   └── [...]/         # API endpoints
└── auth/              # Auth callback handlers
    └── callback/      # Auth callback route
```

### 2.3 Shared Package Architecture

Shared packages are structured to promote reusability across applications:

1. **@repo/ui**
   - Contains all shared UI components using Shadcn/UI
   - Implements design system and theming
   - Provides reusable layouts and composite components

2. **@repo/auth**
   - Authentication utilities for all applications
   - Integration with Supabase Auth
   - Role-based access control
   - Authentication flows

3. **@repo/database**
   - TypeScript types for database schema
   - Database utility functions
   - Migrations and seed data

4. **@repo/i18n**
   - Internationalization utilities
   - Dictionary management
   - Locale detection and routing

## 3. Data Flow Architecture

### 3.1 Client-Server Interaction

```
┌────────────┐     HTTP/HTTPS     ┌─────────────┐
│            ├──────────────────►│             │
│  Browser   │                    │  Next.js    │
│  Client    │◄──────────────────┤  Server     │
│            │                    │             │
└────────────┘                    └──────┬──────┘
                                        │
                                        ▼
┌────────────┐                   ┌─────────────┐
│            │◄──────────────────┤             │
│  Supabase  │                    │  Server    │
│  Backend   ├──────────────────►│  Components │
│            │                    │             │
└────────────┘                    └─────────────┘
```

1. **Client Request Flow**
   - Browser makes request to Next.js server
   - Next.js server renders page using Server Components
   - Server Components fetch data from Supabase
   - Rendered page is sent to client
   - Client-side JavaScript hydrates the page

2. **Authentication Flow**
   - Authentication handled via Supabase Auth
   - JWT tokens stored in cookies for session management
   - Middleware checks authorization for protected routes

3. **Real-time Updates**
   - Supabase Realtime used for live data updates
   - WebSockets established for persistent connections
   - Database changes trigger client updates

### 3.2 Inter-Application Communication

```
┌────────────┐                   ┌─────────────┐
│            │                    │             │
│  Customer  │                    │ Restaurant  │
│  App       │                    │ App         │
│            │                    │             │
└─────┬──────┘                    └──────┬──────┘
      │                                  │
      │                                  │
      ▼                                  ▼
┌──────────────────────────────────────────────┐
│                                              │
│              Supabase Database               │
│                                              │
└──────────────────────────────────────────────┘
      ▲                                  ▲
      │                                  │
      │                                  │
┌─────┴──────┐                    ┌──────┴──────┐
│            │                    │             │
│  Courier   │                    │  Admin      │
│  App       │                    │  App        │
│            │                    │             │
└────────────┘                    └─────────────┘
```

- All applications connect to the same Supabase instance
- Applications communicate indirectly through database changes
- Realtime subscriptions enable cross-application updates
- Row Level Security enforces data access controls

## 4. Database Architecture

### 4.1 Database Schema

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  auth.users   ├────►│ public.profiles◄────┤ user_roles    │
│               │     │               │     │               │
└───────────────┘     └───────┬───────┘     └───────────────┘
                             │
                             ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  vendors      │◄────┤  restaurants  ├────►│  foodtrucks   │
│               │     │               │     │               │
└─────┬─────────┘     └───────────────┘     └───────────────┘
      │
      ▼
┌─────┴─────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  products     ├────►│ product_options     │  categories   │
│               │     │               │     │               │
└─────┬─────────┘     └───────────────┘     └───────────────┘
      │
      ▼
┌─────┴─────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  orders       ├────►│ order_items   ├────►│  order_status │
│               │     │               │     │               │
└─────┬─────────┘     └───────────────┘     └───────────────┘
      │
      ▼
┌─────┴─────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  couriers     ├────►│ deliveries    │     │  reservations │
│               │     │               │     │               │
└───────────────┘     └───────────────┘     └───────┬───────┘
                                                   │
                                                   ▼
                                           ┌───────────────┐
                                           │               │
                                           │  tables       │
                                           │               │
                                           └───────┬───────┘
                                                   │
                                                   ▼
                                           ┌───────────────┐
                                           │               │
                                           │  floorplans   │
                                           │               │
                                           └───────────────┘
```

### 4.2 Key Entities and Relationships

1. **Users and Authentication**
   - `auth.users`: Supabase-managed user authentication table
   - `public.profiles`: Extended user information
   - `user_roles`: Role assignments for different user types

2. **Vendor Management**
   - `vendors`: Parent table for all food providers
   - `restaurants`: Restaurant-specific information
   - `foodtrucks`: Food truck specific information, including location tracking

3. **Menu Management**
   - `products`: Food and beverage items
   - `product_options`: Customization options for products
   - `categories`: Product categorization

4. **Order Processing**
   - `orders`: Order header information
   - `order_items`: Individual items within an order
   - `order_status`: Status tracking for orders

5. **Delivery Management**
   - `couriers`: Delivery personnel information
   - `deliveries`: Delivery assignment and tracking

6. **Reservation System**
   - `reservations`: Table reservations
   - `tables`: Individual tables
   - `floorplans`: Restaurant floor layouts

### 4.3 Database Security

1. **Row Level Security Policies**

```sql
-- Example RLS policy for orders
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
USING (auth.uid() = customer_id);

-- Example RLS policy for restaurant staff
CREATE POLICY "Staff can view their restaurant orders"
ON orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM restaurant_staff
    WHERE user_id = auth.uid()
    AND restaurant_id = orders.restaurant_id
  )
);
```

2. **Security Implementation**
   - JWT-based authentication
   - Role-based access control
   - Row Level Security (RLS) for fine-grained data access
   - Stored procedures for sensitive operations
   - Database functions for complex operations

## 5. Integration Architecture

### 5.1 Payment Processing (Stripe)

```
┌────────────┐     Create Payment Intent    ┌─────────────┐
│            ├─────────────────────────────►│             │
│  App       │                              │  Stripe API │
│            │◄─────────────────────────────┤             │
└─────┬──────┘      Payment Intent Data     └─────────────┘
      │
      │ Payment Confirmation
      ▼
┌─────┴──────┐    Store Transaction Data    ┌─────────────┐
│  Supabase  ├─────────────────────────────►│  Stripe     │
│  Database  │◄─────────────────────────────┤  Connect    │
│            │      Split Payments Data     │             │
└────────────┘                              └─────────────┘
```

1. **Customer Payment Flow**
   - Customer selects payment method
   - Application creates Payment Intent with Stripe
   - Customer confirms payment
   - Webhook receives payment confirmation
   - Database updated with payment status

2. **Vendor Payout Flow**
   - Stripe Connect manages vendor accounts
   - Platform fee automatically calculated
   - Payments split between platform and vendors
   - Regular settlement to vendor accounts

### 5.2 Mapping & Location Services (Google Maps)

```
┌────────────┐     Location Lookup      ┌─────────────────┐
│            ├──────────────────────────►│                 │
│  App       │                          │  Google Maps    │
│            │◄──────────────────────────┤  Geocoding API  │
└─────┬──────┘     Address Data         └─────────────────┘
      │
      │ Route Request
      ▼
┌─────┴──────┐     Route Calculation    ┌─────────────────┐
│  App       ├──────────────────────────►│                 │
│            │◄──────────────────────────┤  Google Maps    │
└────────────┘     Route Data           │  Directions API  │
                                        └─────────────────┘
```

1. **Address Handling**
   - Address validation and standardization
   - Geocoding for latitude/longitude
   - Reverse geocoding for location display

2. **Routing & Navigation**
   - Optimal route calculation
   - ETA prediction
   - Turn-by-turn directions

3. **Location Tracking**
   - Periodic location updates
   - PostGIS for spatial queries
   - Privacy-focused tracking (delayed updates)

### 5.3 Real-time Communication

```
┌────────────┐     Subscribe to Channel    ┌─────────────┐
│            ├───────────────────────────►│             │
│  Client    │                            │  Supabase   │
│  Browser   │◄───────────────────────────┤  Realtime   │
└─────┬──────┘     Channel Subscription    └──────┬──────┘
      │                                          │
      │ Database Changes                         │
      ▼                                          ▼
┌─────┴──────┐    Database Triggers      ┌──────┴──────┐
│  Other     ├─────────────────────────►│             │
│  Clients   │                          │  PostgreSQL │
│            │◄─────────────────────────┤  Database   │
└────────────┘    Broadcast Updates     └─────────────┘
```

1. **Channel Subscription**
   - Clients subscribe to relevant channels
   - Restaurant subscribes to order updates
   - Customer subscribes to delivery status

2. **Data Synchronization**
   - Database triggers publish changes
   - Clients receive real-time updates
   - Conflict resolution for concurrent changes

## 6. Security Architecture

### 6.1 Authentication & Authorization

```
┌────────────┐     Login Request      ┌─────────────┐
│            ├─────────────────────►│             │
│  Browser   │                        │  Supabase   │
│  Client    │◄─────────────────────┤  Auth       │
└─────┬──────┘     JWT Token          └──────┬──────┘
      │                                    │
      │ Request with JWT                   │ Verify Token
      ▼                                    ▼
┌─────┴──────┐    Authorization     ┌──────┴──────┐
│  Next.js   ├────────────────────►│             │
│  Middleware│                      │  Row Level  │
│            │◄────────────────────┤  Security   │
└────────────┘    Access Control    └─────────────┘
```

1. **Authentication Methods**
   - Email/password authentication
   - Social authentication providers
   - PIN-based authentication for staff
   - JWT token storage in HTTP-only cookies

2. **Authorization Flow**
   - Middleware checks authentication status
   - Role-based route protection
   - Row Level Security for data access
   - Time-limited sessions with auto-refresh

### 6.2 Data Protection

1. **Data in Transit**
   - HTTPS for all communications
   - API request encryption
   - Secure WebSocket connections

2. **Data at Rest**
   - Encrypted database storage
   - Sensitive data encryption
   - Tokenization of payment information

3. **PCI Compliance**
   - Stripe for payment processing
   - No storage of card details
   - Compliance with PCI-DSS requirements

## 7. Deployment Architecture

### 7.1 Infrastructure Setup

```
┌────────────┐     Git Push        ┌─────────────────┐
│            ├───────────────────►│                 │
│  Developer │                     │  GitHub         │
│  Workspace │◄───────────────────┤  Repository     │
└─────┬──────┘     Pull Request    └────────┬────────┘
      │                                    │
      │                                    │ Trigger
      ▼                                    ▼
┌─────┴──────┐    CI Pipeline      ┌──────┴──────┐
│  Local     ├───────────────────►│             │
│  Testing   │                     │  GitHub     │
│            │◄───────────────────┤  Actions    │
└────────────┘    Test Results     └──────┬──────┘
                                         │
                                         │ Deploy
                                         ▼
┌───────────────┐   Domain Config   ┌────┴───────┐
│               │◄─────────────────┤            │
│  DNS Provider │                   │  Vercel    │
│               ├─────────────────►│  Platform  │
└───────────────┘   SSL Certificate └────────────┘
```

1. **Development Workflow**
   - Local development environment
   - Git-based version control
   - Pull request reviews
   - Automated testing with GitHub Actions

2. **Deployment Process**
   - Continuous integration/continuous deployment
   - Turborepo-managed build process
   - Vercel deployment for all applications
   - Environment-specific configurations

### 7.2 Scaling Strategy

1. **Horizontal Scaling**
   - Vercel's serverless architecture scales automatically
   - Database connection pooling
   - Read replicas for database scaling

2. **Performance Optimization**
   - Edge caching for static content
   - Incremental Static Regeneration (ISR)
   - Server-side rendering for dynamic content
   - Client-side caching strategies

## 8. Monitoring & Observability

### 8.1 Monitoring Architecture

```
┌────────────┐     Application Metrics    ┌─────────────┐
│            ├─────────────────────────►│             │
│  Next.js   │                          │  Vercel      │
│  Apps      │◄─────────────────────────┤  Analytics   │
└─────┬──────┘     Performance Data      └──────┬──────┘
      │                                        │
      │ User Interactions                      │ Aggregated Metrics
      ▼                                        ▼
┌─────┴──────┐    Behavioral Data      ┌──────┴──────┐
│  Browser   ├─────────────────────────►│             │
│  Client    │                          │  Google     │
│            │◄─────────────────────────┤  Analytics  │
└────────────┘    User Metrics          └─────────────┘
```

1. **Application Monitoring**
   - Error tracking and reporting
   - Performance monitoring
   - API endpoint monitoring
   - Database query performance

2. **User Experience Monitoring**
   - Core Web Vitals tracking
   - User journey analysis
   - Conversion funnel tracking
   - Session recording (optional)

### 8.2 Alerting Strategy

1. **Critical Alerts**
   - Service availability issues
   - Payment processing failures
   - Database performance degradation
   - Security incidents

2. **Performance Alerts**
   - Slow API responses
   - Increased error rates
   - Unusual traffic patterns
   - Resource utilization thresholds

## 9. Future Architecture Considerations

### 9.1 Scalability Enhancements
- Microservices decomposition for specific functions
- Dedicated API gateway
- Distributed caching layer
- Message queue for asynchronous processing

### 9.2 Technology Evolution
- Native mobile applications
- Progressive Web App (PWA) enhancements
- Advanced AI integration
- Blockchain for specific use cases (e.g., supply chain)

This architecture document provides a comprehensive overview of the All-in-One Food Platform's technical structure, data flows, and integration points. It serves as a blueprint for development and a reference for future enhancements.
