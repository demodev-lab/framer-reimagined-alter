# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` - Start development server with auto-reload
- `pnpm run build` - Production build
- `pnpm run build:dev` - Development build
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build

## Project Architecture

This is a React application built with modern web technologies, focusing on Korean student record (학생부) management and analysis.

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom component library
- **UI Components**: shadcn/ui (Radix-based components)
- **Routing**: React Router DOM
- **State Management**: React Context API (ArchiveContext)
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **File Processing**: PDF.js for PDF handling, Tesseract.js for OCR
- **Icons**: Lucide React

### Application Structure

The app consists of several main pages:
- **Index** (`/`) - Landing page with features overview
- **TopicGenerator** (`/topic-generator`) - Main tool for generating research topics
- **Archive** (`/archive`) - Saved topics management with status tracking
- **Feedback** (`/feedback`) - Student record improvement tool
- **Login** (`/login`) - Authentication page

### Key Components Architecture

**State Management**: 
- `ArchiveContext` provides global state for saved topics with localStorage persistence
- Topics have status ('Todo', 'In Progress', 'Done') and priority ('High', 'Medium', 'Low')
- Each topic includes metadata like creation date, subject, and research methods

**Topic Generation Flow**:
- Multi-stage process: initial → topics_generated → topic_selected
- Topics can be "locked" to prevent regeneration
- Integration with research methods and career sentence generation

**UI System**:
- Built on shadcn/ui components with consistent design tokens
- Heavy use of Card components for content organization
- Custom gradient buttons and shadow effects
- Responsive design with mobile-first approach

### File Structure Patterns

- `src/components/` - Reusable UI components
- `src/components/ui/` - shadcn/ui component library
- `src/components/topic-generator/` - Specialized components for topic generation flow
- `src/pages/` - Route components
- `src/contexts/` - React Context providers
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### Korean Language Context

This application is designed for Korean students and uses Korean language throughout. Key terms:
- 학생부 (Student Record)
- 세특 (Subject-specific Activities)
- 보관함 (Archive/Storage)
- 탐구 (Research/Investigation)

### Development Notes

- Uses Lovable platform for collaborative development
- File uploads support PDF processing and text extraction
- Local storage used for data persistence
- No backend - all data stored client-side
- YouTube integration for educational content

<rules>
The following rules should be considered foundational. Make sure you're familiar with them before working on this project:
@.cursor/rules/cursor-rules.mdc
@.cursor/rules/self-improve.mdc
@.cursor/rules/vibe-coding.mdc

Git convention defining branch naming, commit message format, and issue labeling based on GitFlow and Conventional Commits.:
@.cursor/rules/git-convention.mdc

Playwright 테스트 작성 가이드:
@.cursor/rules/playwright-test-guide.mdc

Guidelines for writing Next.js apps with Supabase Auth:
@.cursor/rules/supabase-bootstrap-auth.mdc

Guidelines for writing Supabase database functions:
@.cursor/rules/supabase-create-db-functions.mdc

Guidelines for writing Postgres migrations:
@.cursor/rules/supabase-create-migration.mdc

Guidelines for writing Postgres Row Level Security policies:
@.cursor/rules/supabase-create-rls-policies.mdc

For when modifying the Supabase database schema.:
@.cursor/rules/supabase-declarative-database-schema.mdc

Guidelines for writing Postgres SQL:
@.cursor/rules/supabase-postgres-sql-style-guide.mdc

Coding rules for Supabase Edge Functions:
@.cursor/rules/supabase-writing-edge-functions.mdc

When working with files that match the following extensions (.js, .jsx, .ts, .tsx), review and apply the relevant rules:
@.cursor/rules/nextjs-convention.mdc
@.cursor/rules/toss-frontend.mdc
</rules>