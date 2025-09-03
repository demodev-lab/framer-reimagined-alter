# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` - Start development server on port 5173 with auto-reload
- `pnpm run build` - Production build with minification
- `pnpm run build:dev` - Development build without minification
- `pnpm run lint` - Run ESLint for code quality checks
- `pnpm run preview` - Preview production build locally

## Project Architecture

This is a Korean student academic record (학생부) management system built with React and TypeScript, featuring AI-powered research topic generation and career sentence creation.

### Tech Stack

**Core Technologies**:
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API (ArchiveContext, AuthContext, CareerSentenceContext)
- **Backend**: Supabase (PostgreSQL database with Row Level Security)
- **Authentication**: Supabase Auth with email/magic link
- **External APIs**: N8N webhook integration for AI workflows

**Key Libraries**:
- TanStack Query for server state management
- React Hook Form + Zod for form validation
- PDF.js and Tesseract.js for document processing
- React Router DOM for client-side routing
- Lucide React for icons

### Application Flow

**Authentication Flow**:
1. User logs in via `/login` with email (magic link or password)
2. Supabase handles auth and redirects to `/auth/callback`
3. Protected routes require authentication via `ProtectedRoute` component
4. User data isolated via Supabase RLS policies

**Topic Generation Flow**:
1. Career sentence generation from career aspirations (진로 문장)
2. Subject selection and concept input (교과 과목 + 개념)
3. AI generates multiple research topics via N8N webhooks
4. User selects topic and generates research methods
5. Topics can be saved to archive with status tracking

**Data Persistence**:
- Supabase database stores user-specific data (topics, research methods)
- Local storage migration to cloud when user authenticates
- Real-time data sync across sessions

### N8N Integration

The app integrates with N8N workflows via polling client (`n8nPollingClient`):
- **Career Sentence Generation**: `/webhook/request?path=dream`
- **Topic Generation**: `/webhook/request?path=topics`
- **Research Methods**: `/webhook/request?path=protocol`

Uses async job polling pattern:
1. Submit request → receive jobId
2. Poll status endpoint until completion
3. Handle CORS and network errors gracefully

### Database Schema

**Main Tables**:
- `topics`: Stores research topics with user_id, title, status, priority
- `research_methods`: Related methods for each topic
- `career_sentences`: User's career aspiration sentences
- `research_concepts`: Core concepts for topic generation

All tables use Row Level Security (RLS) for user data isolation.

### Key Components Architecture

**Context Providers**:
- `AuthContext`: Manages Supabase authentication state
- `ArchiveContext`: Handles saved topics with CRUD operations
- `CareerSentenceContext`: Manages career sentence generation state

**Page Components**:
- `TopicGenerator`: Main topic creation workflow with demo mode
- `Archive`: Topic management dashboard with filtering/sorting
- `ProjectTopic`: Alternative project-based topic generation
- `Index`: Landing page with feature showcase

**Demo Mode**:
Special mode (`?demo=true`) for non-authenticated users to try the service with limited features and simulated AI responses.

### TypeScript Configuration

- Path aliasing: `@/*` maps to `src/*`
- Relaxed type checking for rapid development
- Allow JavaScript files for gradual migration

### Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Korean Language Context

Key terminology used throughout:
- 학생부 (Student Record) - Academic portfolio
- 세특 (Subject-specific Activities) - Detailed subject achievements
- 진로 문장 (Career Sentence) - Career aspiration statement
- 탐구 주제 (Research Topic) - Investigation theme
- 보관함 (Archive) - Saved topics storage

### Development Notes

- Lovable platform integration for collaborative development
- PDF/image processing for document analysis
- Real-time collaboration features planned
- Mobile-responsive design with touch gestures
- YouTube video embeds for tutorials