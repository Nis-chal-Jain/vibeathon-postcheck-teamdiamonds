# Cheque Management System

A full-stack web application for managing and tracking cheques with AI-powered natural language querying.

## Overview

This application provides a comprehensive cheque management system with features for creating, filtering, and querying cheques. It includes an intelligent AI chatbot powered by Google's Gemini API that allows users to query their cheque data using natural language.

## Features

### Core Functionality
- **Create Cheques**: Add new cheques with all required details (cheque number, payee, dates, amount, status)
- **Filter & Search**: Filter cheques by:
  - Status (past, today, upcoming, cancelled)
  - Issue date range
  - Due date range
  - Multiple filters can be combined
- **Responsive Table View**: Display all cheques with proper formatting and visual indicators
- **Status Badges**: Color-coded status indicators for quick visual recognition

### AI Chatbot (Optional)
- **Dedicated Chat Page**: Full-screen chatbot interface at `/chat` with spacious conversation layout
- **Natural Language Queries**: Ask questions in plain English like:
  - "Give me all cheques due by 21st November"
  - "What's the total amount of upcoming cheques?"
  - "List all cheques for John Smith"
- **Intelligent Responses**: Get formatted, context-aware answers with:
  - Proper date formatting
  - Currency formatting with commas and decimals
  - Bullet-pointed lists
  - Summaries and totals
- **Seamless Navigation**: Easy navigation between cheques page and chat page
- **Graceful Degradation**: System works fully without Gemini API key; chatbot simply becomes unavailable

## Tech Stack

### Frontend
- **React** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching and caching
- **Shadcn UI** component library
- **Tailwind CSS** for styling
- **date-fns** for date formatting
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database (Neon-backed)
- **Drizzle ORM** for database management
- **Google Gemini AI** (2.5 Flash) for chatbot

## Database Schema

### Cheques Table
- `chequeId`: Serial (auto-increment primary key)
- `userId`: Varchar(255) - User identifier
- `chequeNumber`: Integer - Physical cheque number
- `toPayee`: Varchar(255) - Payee name
- `issuedDate`: Date - Issue date
- `dueDate`: Date - Due date
- `amount`: Numeric(12,2) - Amount with decimal precision
- `status`: Enum - One of: 'past', 'today', 'upcoming', 'cancelled'

## API Endpoints

### GET /api/cheques
Query cheques with optional filters.

**Query Parameters** (all optional):
- `status`: Filter by status
- `issueStart`: Issue date range start (YYYY-MM-DD)
- `issueEnd`: Issue date range end (YYYY-MM-DD)
- `dueStart`: Due date range start (YYYY-MM-DD)
- `dueEnd`: Due date range end (YYYY-MM-DD)

**Response**: Array of cheque objects

### POST /api/cheques
Create a new cheque.

**Request Body**:
```json
{
  "userId": "string",
  "chequeNumber": number,
  "toPayee": "string",
  "issuedDate": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD",
  "amount": number,
  "status": "past" | "today" | "upcoming" | "cancelled"
}
```

**Response**: Created cheque object

### POST /api/chat
Query cheques using natural language (requires GEMINI_API_KEY).

**Request Body**:
```json
{
  "query": "string"
}
```

**Response**:
```json
{
  "response": "string"
}
```

## Environment Variables

### Required for Core Functionality
- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)
- `SESSION_SECRET`: Session encryption secret (auto-configured)

### Optional (for Chatbot)
- `GEMINI_API_KEY`: Google Gemini API key
  - Get one free at https://ai.google.dev/
  - System works without this; chatbot simply becomes unavailable

## Setup & Development

### Database Migrations
Run database schema updates:
```bash
npm run db:push
```

### Running the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── chatbot.tsx   # Legacy chatbot component (deprecated)
│   │   │   ├── create-cheque-dialog.tsx
│   │   │   ├── date-range-picker.tsx
│   │   │   └── ui/           # Shadcn components
│   │   ├── pages/            # Page components
│   │   │   ├── chat.tsx      # Dedicated AI chatbot page
│   │   │   └── cheques.tsx   # Main cheques page
│   │   └── lib/              # Utilities and configurations
├── server/                    # Backend Express application
│   ├── db.ts                 # Database connection
│   ├── gemini.ts             # Gemini AI integration
│   ├── routes.ts             # API route handlers
│   └── storage.ts            # Data access layer
└── shared/                    # Shared TypeScript types
    └── schema.ts             # Database schema & Zod validators
```

## Design Guidelines

The application follows a modern, clean design system inspired by Linear/Notion:
- **Typography**: Inter font family for clean, professional text
- **Colors**: Carefully selected semantic color tokens with dark mode support
- **Spacing**: Consistent spacing system (4px, 8px, 16px, 24px)
- **Components**: Shadcn UI components with custom styling
- **Interactions**: Subtle hover states and smooth transitions

See `design_guidelines.md` for detailed design specifications.

## Security & Best Practices

- **Data Summarization**: Chatbot receives summarized data, not raw JSON, to prevent data leakage
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Input Validation**: Zod schemas validate all inputs
- **Environment Validation**: Graceful degradation when optional features are unavailable
- **Type Safety**: Full TypeScript coverage for type safety

## Recent Changes

- **2025-11-07**: Created dedicated full-screen chat page at /chat with improved UX and spacious layout
- **2025-11-07**: Added seamless navigation between cheques page and chat page
- **2025-11-07**: Removed floating chatbot button in favor of dedicated page
- **2025-11-07**: Fixed TypeScript error with amount field type handling (string/number)
- **2025-11-07**: Added Gemini AI chatbot for natural language queries
- **2025-11-07**: Fixed decimal amount handling in database schema
- **2025-11-07**: Implemented complete filtering system with date ranges
- **2025-11-07**: Created initial cheque management system with CRUD operations

## User Preferences

- Clean, professional UI design
- Natural language interaction preferred for queries
- Visual indicators for status (color-coded badges)
- Responsive design for all screen sizes
