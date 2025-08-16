# Component Hierarchy and Design Patterns Analysis

## 1. Page-Level Components (src/pages/)

### Components:
- **Index.tsx** - Landing page
- **TopicGenerator.tsx** - Main topic generation tool
- **Archive.tsx** - Saved topics management
- **Feedback.tsx** - Student record improvement
- **Login.tsx** - Authentication
- **ProjectTopic.tsx** - Project topic generator
- **NotFound.tsx** - 404 page

### Design Patterns:
- **Layout Pattern**: All pages use Header component for consistent navigation
- **Container Pattern**: Uses `container mx-auto` for consistent width
- **Section-based Structure**: Pages divided into semantic sections with consistent spacing (`py-20`, `py-[60px]`)
- **Hero Section Pattern**: Large typography with gradient text effects
- **Card-based Content**: Heavy use of Card components for content organization

### Visual Characteristics:
- Background: `bg-gray-100` as base, white sections with `rounded-3xl`
- Typography: Large, bold headings (text-5xl to text-7xl) with tight tracking
- Spacing: Generous padding and margins for breathing room
- Gradients: Purple gradients (`from-purple-600 to-purple-700`) for emphasis

## 2. Feature-Specific Components (src/components/topic-generator/)

### Components:
- **CareerSentenceDialog.tsx** - Modal for career sentence input
- **CareerSentenceGeneratorSection.tsx** - Career sentence generation
- **CareerSentenceSection.tsx** - Display career sentences
- **CarouselControls.tsx** - Navigation controls
- **DetailedProjectCard.tsx** - Detailed project display
- **PreparationMethodSection.tsx** - Research preparation methods
- **ProjectTopicCarousel.tsx** - Project topic carousel
- **ProjectTopicGeneratorSection.tsx** - Project topic generation
- **TopicCarousel.tsx** - Topic carousel display
- **TopicGeneratorSection.tsx** - Main topic generation section
- **YouTubePopup.tsx** - YouTube video modal

### Design Patterns:
- **Carousel Pattern**: Multiple carousel implementations for browsing content
- **Multi-step Flow**: Progressive disclosure with stages (initial → generated → selected)
- **Card Carousel**: Combining Card components with carousel navigation
- **Section Components**: Self-contained sections with their own state management
- **Modal Pattern**: Dialog components for focused interactions

### Visual Characteristics:
- Card-based layouts with consistent shadows
- Gradient buttons for primary actions
- Icon usage (Lucide icons) for visual hierarchy
- Progress indicators and state badges
- Hover effects with transform animations

## 3. UI Library Components (src/components/ui/)

### Core Components (Most Used):
- **button.tsx** - Variant-based button system
- **card.tsx** - Card container system (Card, CardHeader, CardContent, etc.)
- **dialog.tsx** - Modal dialogs
- **select.tsx** - Dropdown selections
- **input.tsx** - Form inputs
- **badge.tsx** - Status badges
- **tooltip.tsx** - Hover tooltips

### Design Patterns:
- **Compound Component Pattern**: Card system with sub-components
- **Variant System**: Using CVA (class-variance-authority) for consistent variants
- **Forwarded Refs**: All components use React.forwardRef
- **Composable Design**: Components designed to work together
- **Accessibility First**: Built on Radix UI primitives

### Visual Characteristics:
- Consistent border radius (`rounded-lg`, `rounded-md`)
- Shadow system (`shadow-sm`, custom shadow values)
- Color tokens (primary, secondary, destructive, etc.)
- Focus states with ring system
- Transition animations on interactions

## 4. Shared/Common Components (src/components/)

### Components:
- **Header.tsx** - Global navigation header
- **FileUpload.tsx** - File upload functionality
- **FaqChat.tsx** - FAQ chat interface
- **ChangelogPostCard.tsx** - Changelog display
- **ResearchMethodsCard.tsx** - Research methods display
- **SelectedTopicCard.tsx** - Selected topic display
- **StructuredResearchMethod.tsx** - Structured research display
- **TopicGeneratorCard.tsx** - Topic generation interface
- **TopicResultsCard.tsx** - Topic results display
- **CareerSentenceGeneratorCard.tsx** - Career sentence generation
- **ResearchTopicsResult.tsx** - Research results display

### Design Patterns:
- **Card-based Architecture**: Almost all components extend Card component
- **Icon Integration**: Consistent use of Lucide icons
- **Action Buttons**: Consistent button placement and styling
- **Loading States**: Skeleton loaders and loading indicators
- **Toast Notifications**: Using sonner for feedback

### Visual Characteristics:
- Consistent card styling with white backgrounds
- Icon + text combinations for clarity
- Gradient accents for important elements
- Hover animations (scale, shadow changes)
- Consistent spacing patterns (p-6, gap-4)

## 5. Context Providers and Hooks

### Contexts:
- **ArchiveContext.tsx** - Global state for saved topics
- **CareerSentenceContext.tsx** - Shared career sentence state

### Hooks:
- **useTopicManager.ts** - Topic generation state management
- **useProjectTopicManager.ts** - Project topic state management
- **use-mobile.tsx** - Responsive design detection
- **use-toast.ts** - Toast notification system

### Design Patterns:
- **Provider Pattern**: Context API for global state
- **Custom Hook Pattern**: Encapsulated business logic
- **Local Storage Integration**: Persistent state management
- **Polling Pattern**: N8N integration with polling

## Design System Summary

### Visual Hierarchy:
1. **Primary Actions**: Purple gradients with strong shadows
2. **Secondary Actions**: Outline buttons with subtle hover states
3. **Content Containers**: White cards with light shadows
4. **Background Layers**: Gray-100 base with white sections

### Consistent Patterns:
1. **Spacing**: 4px grid system (p-4, p-6, p-8)
2. **Border Radius**: Consistent use of rounded-lg for cards, rounded-md for buttons
3. **Typography**: Font-bold for headings, clear hierarchy with size variations
4. **Colors**: Purple as primary accent, gray scale for content
5. **Animations**: Transform-based hover effects, smooth transitions

### Component Composition:
1. **Page** → **Section** → **Card** → **Content**
2. Heavy reliance on Card component as base building block
3. Consistent header/content/footer structure
4. Icon usage for visual communication
5. Progressive disclosure with carousels and modals

This architecture shows a well-structured component system with clear separation of concerns and consistent design patterns throughout the application.