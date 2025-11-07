# Cheque Management System - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Linear/Notion Inspired
**Justification:** Financial management tools require clarity, precision, and efficient data processing. Linear's clean aesthetic combined with structured data presentation provides the optimal balance for a cheque management interface.

## Core Design Elements

### Typography
- **Primary Font:** Inter (via Google Fonts CDN)
- **Headings:** 
  - Page titles: text-2xl font-semibold
  - Section headers: text-lg font-medium
  - Card titles: text-base font-medium
- **Body Text:** text-sm font-normal
- **Data/Numbers:** text-sm font-mono (for cheque numbers, amounts)
- **Labels:** text-xs font-medium uppercase tracking-wide

### Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Page margins: mx-auto max-w-7xl px-4 to px-8
- Card spacing: p-6
- Form field spacing: space-y-4

### Component Library

#### Navigation & Header
- Top navigation bar with app branding
- User menu/profile in top-right
- Quick action button: "New Cheque" prominently placed (top-right before user menu)

#### Data Table (Primary Component)
- Clean table with subtle borders (border-b on rows)
- Column headers: sticky positioning, medium weight text
- Row hover states for interactivity
- Columns: Cheque Number, Payee, Issue Date, Due Date, Amount, Status
- Pagination controls at bottom
- Empty state illustration when no cheques exist

#### Filter Panel
- Horizontal filter bar above table
- Filter components in a row: Status dropdown, Issue Date range picker, Due Date range picker
- "Clear Filters" button on the right
- Active filter count indicator
- Each filter component: compact with clear labels

#### Status Badges
- Pill-shaped badges with distinct styling per status
- Size: text-xs px-3 py-1 rounded-full
- Past Due, Today, Upcoming, Cancelled states
- Clear visual hierarchy through badge design

#### Form Design (Create Cheque)
- Modal overlay or slide-out panel for creation
- Single-column form layout
- Field groups with consistent spacing (space-y-4)
- Input fields: Full-width with subtle borders, p-3 height
- Label positioning: Above inputs with mb-2
- Date pickers: Calendar popup components
- Amount field: Currency symbol prefix, right-aligned numeric input
- Action buttons: Primary (Create) and Secondary (Cancel) at bottom

#### Cards & Containers
- Subtle elevation with border instead of shadow
- Rounded corners: rounded-lg
- Background distinction from page background
- Consistent internal padding: p-6

### Responsive Behavior
- Desktop (lg+): Full table view with all filters horizontal
- Tablet (md): Filters stack to 2-column grid
- Mobile (base): 
  - Table converts to card-based layout
  - Each cheque as an individual card
  - Filters stack vertically in accordion

### Interaction Patterns
- Table rows: Clickable for details view
- Hover feedback on interactive elements
- Loading states: Skeleton loaders for table rows
- Success/error toast notifications for actions
- Confirmation dialog for destructive actions

### Data Visualization
- Amount formatting: Currency symbol with thousand separators
- Date formatting: Consistent format throughout (MM/DD/YYYY or regional)
- Numeric data: Monospace font for alignment
- Status indicators: Color-coded badge system

## Key Features Layout

**Dashboard View:**
- Header with title "Cheque Management" and action button
- Filter bar spanning full width
- Data table with sorting capabilities
- Pagination at bottom-right

**Create Cheque Form:**
Fields in order:
1. Cheque Number (text input)
2. Payee Name (text input)
3. Issue Date (date picker)
4. Due Date (date picker)
5. Amount (currency input)
6. Status (dropdown: Past, Today, Upcoming, Cancelled)

**Empty States:**
- Centered message with icon
- Call-to-action to create first cheque
- Helpful description text

This design prioritizes data clarity, efficient workflows, and professional presentation suitable for financial management contexts.