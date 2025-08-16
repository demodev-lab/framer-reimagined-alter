# Design Inconsistencies Report

## 1. Button Styles and Variants

### Inconsistent Button Implementations
- **Standard shadcn/ui Button**: Uses predefined variants (default, destructive, outline, secondary, ghost, link)
  - Example: `<Button variant="outline">` in Header.tsx and most components
  
- **Custom Gradient Buttons**: Found in Index.tsx with complex inline styles
  ```tsx
  // Index.tsx line 42
  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_12px_24px_rgba(147,51,234,0.4)] hover:shadow-[0_16px_32px_rgba(147,51,234,0.5)] transform hover:translate-y-[-3px] transition-all duration-300 border-2 border-purple-500"
  ```
  
- **Inconsistent sizing**: 
  - Some buttons use `px-8 py-4` (Index.tsx)
  - Others use `px-6 py-2` (Index.tsx secondary button)
  - Default button uses `h-10 px-4 py-2` (button.tsx)

### Recommendations:
- Create additional button variants in the button component for gradient styles
- Standardize button sizes using the existing size prop (sm, default, lg)

## 2. Card Component Variations

### Standard Card Usage
- Most components use the shadcn/ui Card component with consistent styling
- Base style: `rounded-lg border bg-card text-card-foreground shadow-sm`

### Custom Card Implementations
- **Index.tsx Video Card** (line 71): 
  ```tsx
  className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-gray-200 p-8 text-left transform hover:translate-y-[-8px] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-300"
  ```
  Uses:
  - Different border radius (`rounded-3xl` vs `rounded-lg`)
  - Custom shadows instead of standard `shadow-sm`
  - Gradient backgrounds
  - Transform animations on hover

### Recommendations:
- Create card variants or a separate "feature card" component for special cases
- Standardize shadow values in Tailwind config

## 3. Color Schemes and Gradients

### Color Usage Inconsistencies
- **Purple gradient**: `from-purple-600 to-purple-700` (Index.tsx)
- **Black to gray gradient**: `from-black to-gray-800` (Index.tsx)
- **White to gray gradient**: `from-white to-gray-50` (Index.tsx)
- No gradients defined in the design system (tailwind.config.ts)

### Recommendations:
- Define gradient color schemes in Tailwind config
- Create reusable gradient classes

## 4. Spacing and Padding Patterns

### Inconsistent Spacing
- **Container padding**: 
  - `px-4 sm:px-6 lg:px-8` (Index.tsx)
  - `p-6` (Card components)
  - `p-8` (Custom cards in Index.tsx)
  
- **Section spacing**:
  - `py-20 md:py-[70px]` (Index.tsx hero)
  - `py-[60px]` (Index.tsx features)
  - `py-0` (Index.tsx benefits)

- **Gap spacing**:
  - `gap-2`, `gap-4`, `gap-6` used inconsistently
  - `space-y-2`, `space-y-4` mixed with gap utilities

### Recommendations:
- Define standard spacing scales
- Use consistent patterns for responsive spacing

## 5. Typography Styles

### Font Size Inconsistencies
- **Headings**:
  - `text-5xl md:text-7xl` (Index.tsx hero)
  - `text-4xl md:text-5xl` (Index.tsx features)
  - `text-2xl md:text-3xl` (Index.tsx subtitle)
  - `text-2xl` (CardTitle default)
  
- **Font weights**:
  - `font-bold` used extensively
  - `font-semibold` in card titles
  - `font-medium` for body text

### Recommendations:
- Create typography scale in design system
- Use consistent heading hierarchy

## 6. Shadow and Border Radius Usage

### Shadow Inconsistencies
- **Standard shadows**: `shadow-sm` (Card component)
- **Custom shadows**:
  - `shadow-[0_12px_24px_rgba(147,51,234,0.4)]` (purple button)
  - `shadow-[0_20px_50px_rgba(0,0,0,0.15)]` (video card)
  - `shadow-[0_30px_70px_rgba(0,0,0,0.25)]` (video card hover)
  - `shadow-lg` (logo in Index.tsx)

### Border Radius Inconsistencies
- `rounded-md` (default buttons)
- `rounded-lg` (cards)
- `rounded-xl` (custom button)
- `rounded-3xl` (video card)
- `rounded-full` (badges, pills)
- `rounded-2xl` (various elements)

### Recommendations:
- Standardize shadow values in Tailwind config
- Limit border radius options to design system values

## 7. Animation and Transition Patterns

### Inconsistent Animations
- **Transform animations**: `transform hover:translate-y-[-3px]` (custom button)
- **Transform animations**: `transform hover:translate-y-[-8px]` (video card)
- **Transition durations**: `transition-all duration-300` vs `transition-colors` (default)
- **Custom animations**: Shimmer effect on gradient button

### Recommendations:
- Create standard animation utilities
- Define consistent transition durations

## Summary of Key Issues

1. **Button styling** is split between standard shadcn/ui components and custom implementations
2. **Card components** have both standard and heavily customized versions
3. **Color gradients** are used inline without being part of the design system
4. **Spacing** lacks consistency across different sections and components
5. **Typography scale** is not well-defined, leading to arbitrary size choices
6. **Shadows and border radius** values are scattered and inconsistent
7. **Animations** are implemented ad-hoc without standardization

## Recommended Actions

1. **Extend the design system** in `tailwind.config.ts` to include:
   - Gradient color schemes
   - Custom shadow values
   - Animation utilities
   - Consistent spacing scale

2. **Create variant props** for existing components to handle special cases

3. **Document design patterns** for consistent usage across the team

4. **Refactor existing custom implementations** to use the standardized system