# Cheque Management System

## Overview

A web-based financial management application for tracking and managing cheques. The system provides filtering capabilities by status, issue date, and due date, along with creation and organization tools for cheque records. Built with a modern React frontend and Express backend, utilizing PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, bundled via Vite

**UI Component System**: shadcn/ui (New York style) with Radix UI primitives
- Custom design system inspired by Linear/Notion aesthetics
- Tailwind CSS for styling with custom color variables and spacing primitives
- Component-based architecture with reusable UI elements (buttons, cards, dialogs, form controls)

**State Management**: 
- TanStack Query (React Query) for server state management
- React hooks for local component state
- Centralized query client configuration with custom fetch wrapper

**Routing**: Wouter for client-side routing

**Form Handling**: React Hook Form with Zod validation resolvers

**Key Design Decisions**:
- Typography uses Inter font family via Google Fonts CDN
- Spacing system based on Tailwind units (2, 4, 6, 8, 12)
- Clean, minimal interface with subtle borders and hover states
- Mobile-responsive design with breakpoint at 768px

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Design**: RESTful API endpoints
- `GET /api/cheques` - Query cheques with optional filters (status, date ranges)
- `POST /api/cheques` - Create new cheque records

**Validation**: Zod schemas for runtime type checking and validation

**Request Logging**: Custom middleware that logs API requests with duration and response data

**Development Server**: Hot module replacement via Vite middleware in development mode

**Key Design Decisions**:
- Raw body capture for request verification
- Centralized route registration pattern
- JSON response format for all API endpoints
- Error handling with appropriate HTTP status codes (400 for validation, 500 for server errors)

### Data Storage

**Database**: PostgreSQL (via Neon serverless driver)

**ORM**: Drizzle ORM
- Type-safe database queries
- Schema-first approach with TypeScript inference
- Migration management via drizzle-kit

**Schema Design**:
- `cheques` table with fields: chequeId (serial PK), userId, chequeNumber, toPayee, issuedDate, dueDate, amount (numeric 12,2), status (enum)
- `users` table with fields: id (UUID), username, password
- Cheque status enum: "past", "today", "upcoming", "cancelled"

**Key Design Decisions**:
- WebSocket-based connection pooling for serverless compatibility
- Shared schema definitions between client and server
- Zod schemas derived from Drizzle tables for validation consistency
- Database credentials managed via environment variables

### External Dependencies

**Database Service**: Neon Postgres (serverless)
- Connection via `@neondatabase/serverless` package
- WebSocket-based pooling for serverless environments

**UI Component Libraries**:
- Radix UI primitives (accordion, dialog, dropdown, select, toast, etc.)
- date-fns for date formatting and manipulation
- Embla Carousel for carousel functionality
- class-variance-authority and clsx for conditional styling

**Development Tools**:
- Replit-specific plugins (runtime error modal, cartographer, dev banner)
- ESBuild for production bundling
- PostCSS with Tailwind CSS and Autoprefixer

**Third-Party Integrations**:
- Google Fonts CDN for Inter font family
- No external authentication services (credentials stored in database)
- No payment processing or external API integrations

**Key Design Decisions**:
- Monorepo structure with shared code between client and server
- Path aliases for cleaner imports (@/, @shared/, @assets/)
- Type safety enforced across the stack with TypeScript
- Environment-based configuration (development vs production builds)