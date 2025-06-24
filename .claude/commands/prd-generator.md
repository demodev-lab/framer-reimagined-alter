# PRD Generation Assistant

This Claude Code assistant helps you create comprehensive Product Requirements Documents (PRDs) for MVP development projects.

## Setup Instructions

1. Create a `docs` folder in your project root
2. The assistant will generate a `PRD.md` file with detailed product specifications
3. All PRDs will be generated in Korean for better localization

## Usage

Run this command to generate a PRD:

```bash
claude-code "Please create a docs folder and generate a comprehensive PRD.md file. I'll provide the following project information:

Project Name: [Enter your project name]
Project Description: [Enter the core problem you're solving and your solution]
Target Users: [B2B/B2C/Both] - [Detailed user description]
Domain/Industry: [Application field]

Please ask me for these details and then create a detailed PRD in Korean using the comprehensive template below."
```

## PRD Template

You are a product management expert. Based on the project information provided, create a comprehensive PRD for an MVP that can be completed within 3 months.

### Tech Stack (Fixed)
- **Frontend**: Next.js 14+ (App Router), shadcn/ui, TailwindCSS, Lucide Icons
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **ORM**: Drizzle ORM
- **Deployment**: Vercel
- **Development**: TypeScript, ESLint, Prettier

### Development Timeline
- **Total Duration**: 12 weeks (3 months)
- **Team Assumption**: 1-2 full-stack developers

---

## PRD Structure Guidelines

### 1. Product Vision & Value Proposition
Answer these questions:
- **Why is this product needed?** (Problem Statement)
- **Who will use this product?** (Target Audience)  
- **What value does it provide?** (Value Proposition)
- **What differentiates it from competitors?** (Unique Selling Points)

### 2. Core Features Definition (3-5 features)
For each feature, use this detailed template:

```markdown
## Feature [Number]: [Feature Name]

### Overview
- **Purpose**: [Problem this feature solves]
- **Priority**: P0(Essential)/P1(Important)/P2(Optional)
- **Estimated Development Time**: [Days/Weeks]

### User Story
As a [user type], I want to [action] So that [goal]

### Detailed Specifications

1. **Basic Operations**
   - [Detailed operation description]
   - [Usage scenarios]

2. **Acceptance Criteria**
   - [ ] [Measurable completion condition 1]
   - [ ] [Measurable completion condition 2]
   - [ ] [Measurable completion condition 3]

3. **UI/UX Requirements**
   - Required screens: [Screen list]
   - Key components: [shadcn/ui components]
   - Interactions: [User interaction flow]
   - Responsive: [Mobile/Tablet/Desktop support]

4. **Technical Implementation Details**
   - API endpoints: [Required API list]
   - Data models: [Related tables/fields]
   - State management: [Client/Server state]
   - Security requirements: [Auth/Authorization/Data protection]

5. **Edge Cases & Error Handling**
   - [Expected edge cases]
   - [Error scenarios and handling approaches]
```

### 3. Data Architecture
```typescript
// Drizzle ORM schema examples
// Table definitions for each core feature
// Relationship setup and indexing strategy
// Supabase RLS policies
```

### 4. User Flow Diagrams
```
[Start] → [Step1] → [Step2] → ... → [Complete]
   ↓         ↓
[Exception] [Alternative Path]
```

### 5. MVP Development Roadmap

**🚀 Sprint 1-2 (Week 1-2): Project Initialization**
- [ ] Development environment setup (Next.js + Supabase + Vercel)
- [ ] Basic project structure and routing
- [ ] UI component library setup (shadcn/ui)
- [ ] Basic authentication system implementation

**🏗 Sprint 3-6 (Week 3-6): Core Features 1-2 Implementation**
- [ ] Data models and API implementation
- [ ] Main screens and functionality
- [ ] Basic CRUD operations
- [ ] Real-time features (if needed)

**⚡ Sprint 7-10 (Week 7-10): Core Features 3-5 Implementation**
- [ ] Remaining core features
- [ ] Complex business logic handling
- [ ] Performance optimization
- [ ] Integration testing

**🎨 Sprint 11-12 (Week 11-12): Finalization & Deployment**
- [ ] UI/UX improvements and responsive completion
- [ ] Bug fixes and QA
- [ ] Production deployment preparation
- [ ] Basic documentation

### 6. Technical Considerations
- **Performance Goals**: [Core Web Vitals standards]
- **Scalability**: [User/Data growth response]
- **Security**: [OWASP Top 10 compliance]
- **Accessibility**: [WCAG 2.1 AA compliance]
- **SEO**: [Next.js feature utilization]

### 7. Risk Assessment & Mitigation
| Risk Factor | Impact Level | Mitigation Strategy |
|-------------|--------------|-------------------|
| [Risk 1] | High/Medium/Low | [Response strategy] |

### 8. Success Metrics (MVP Validation)
- [ ] [Quantitative metric 1]
- [ ] [Quantitative metric 2]
- [ ] [Qualitative metric 1]

---

## Instructions for Claude Code

1. **First, ask the user for the required project information:**
   - Project Name
   - Project Description (core problem and solution)
   - Target Users (B2B/B2C/Both with details)
   - Domain/Industry

2. **Create the docs folder structure:**
   ```
   docs/
   └── PRD.md
   ```

3. **Generate a comprehensive PRD in Korean** following the template above

4. **Ensure the PRD includes:**
   - All sections filled out based on the provided project information
   - Realistic 3-month development timeline
   - Detailed technical specifications using the specified tech stack
   - Korean language throughout (except code examples)
   - Actionable user stories and acceptance criteria

5. **Validate the output:**
   - Check that all required sections are present
   - Ensure the scope is appropriate for a 3-month MVP
   - Verify that technical requirements align with the specified stack