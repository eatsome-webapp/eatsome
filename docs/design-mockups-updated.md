# Design System & UI Mockups

## 1. Design System Foundation

### 1.1 Color Palette

#### Primary Colors
- **Rich Black (#121212)**: Primary color for text, headers, and key UI elements
- **Vibrant Yellow (#FFD43A)**: Primary accent color for CTAs, highlighting, and important elements
- **Smoke Gray (#F8F9FA)**: Main background color for light theme, providing clean aesthetics

#### Secondary Colors
- **Warm Yellow (#FFBB00)**: For hover states and secondary accents
- **Light Yellow (#FFE380)**: For subtle highlights and secondary elements
- **Pale Yellow (#FFF4CC)**: For very light backgrounds and notifications
- **Golden Yellow (#F5A623)**: For premium features and special offers

#### Neutral Colors
- **Pure Black (#000000)**: For text that truly needs to stand out
- **Soft Black (#1A1A1A)**: For backgrounds and panels in dark mode
- **Charcoal (#2A2A2A)**: For cards and secondary elements in dark mode
- **Dark Gray (#3D3D3D)**: For subtle distinctions and borders in dark mode
- **Light Gray (#E0E0E0)**: For borders and dividers
- **Silver (#C8C8C8)**: For inactive elements
- **Medium Gray (#949494)**: For secondary text

#### Functional Colors
- **Success Green (#4CAF50)**: For positive indicators, completed states, and confirmations
- **Warning Amber (#FF9800)**: For alerts, attention-needed indicators, and important notices
- **Error Red (#F44336)**: For errors, destructive actions, and critical notifications
- **Info Blue (#2196F3)**: For informational messages and neutral notifications

### 1.2 Typography

#### Primary Font: Poppins
- Used for 70% of UI elements
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Primary Heading (H1)**: Poppins, 28px/32px, Bold, Rich Black (#121212)
- **Secondary Heading (H2)**: Poppins, 24px/28px, SemiBold, Rich Black (#121212)
- **Section Heading (H3)**: Poppins, 20px/24px, SemiBold, Rich Black (#121212)
- **Subsection Heading (H4)**: Poppins, 18px/22px, Medium, Rich Black (#121212)
- **Body Text**: Poppins, 16px/24px, Regular, Rich Black (#121212)
- **Small Text**: Poppins, 14px/20px, Regular, Rich Black (#121212)

#### Secondary Font: Montserrat
- Used for 30% of UI elements, primarily for contrasting elements
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Feature Headings**: Montserrat, 22px/26px, Bold, Rich Black (#121212)
- **Button Text**: Montserrat, 14px/16px, SemiBold, varies based on button type
- **Labels**: Montserrat, 12px/16px, Medium, Rich Black (#121212) or Medium Gray (#949494)
- **Micro Text**: Montserrat, 10px/14px, Regular, Medium Gray (#949494)

### 1.3 Component Design

#### Button Styles
- **Primary Button**: 
  - Background: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Border: None
  - Hover: Warm Yellow (#FFBB00)
  - Border Radius: 8px
  - Animation: Slight scale (1.02) on hover with 0.2s transition

- **Secondary Button**: 
  - Background: Transparent
  - Text: Vibrant Yellow (#FFD43A)
  - Border: 1px solid Vibrant Yellow (#FFD43A)
  - Hover: Background fade to Light Yellow (#FFE380), 0.2s transition
  - Border Radius: 8px

- **Text Button**: 
  - Background: None
  - Text: Vibrant Yellow (#FFD43A)
  - Hover: Text to Warm Yellow (#FFBB00), underline
  - Animation: 0.2s color transition

- **Icon Button**: 
  - Normal: Rich Black (#121212) icon
  - Hover: Vibrant Yellow (#FFD43A) icon
  - Sizes: 24px, 32px, 40px
  - Animation: 0.2s color transition

#### Card Styles
- **Standard Card**: 
  - Background: White (#FFFFFF)
  - Border: 1px solid Light Gray (#E0E0E0)
  - Shadow: 0px 4px 8px rgba(0, 0, 0, 0.1)
  - Border Radius: 12px

- **Feature Card**: 
  - Background: White (#FFFFFF)
  - Border-left: 4px solid Vibrant Yellow (#FFD43A)
  - Shadow: 0px 6px 12px rgba(0, 0, 0, 0.15)
  - Border Radius: 12px

- **Interactive Card**: 
  - Background: White (#FFFFFF)
  - Border: 1px solid Light Gray (#E0E0E0)
  - Hover: Shadow increase to 0px 8px 16px rgba(0, 0, 0, 0.15)
  - Animation: 0.3s shadow and transform transition, translateY(-4px)
  - Border Radius: 12px

- **Status Card**: 
  - Background: White (#FFFFFF)
  - Left Border Colors:
    - Pending: Light Yellow (#FFE380)
    - In Progress: Warm Yellow (#FFBB00)
    - Completed: Success Green (#4CAF50)
    - Cancelled: Error Red (#F44336)
  - Border Radius: 12px

#### Form Elements
- **Text Input**: 
  - Background: White (#FFFFFF)
  - Border: 1px solid Light Gray (#E0E0E0)
  - Focus: Border 2px solid Vibrant Yellow (#FFD43A)
  - Border Radius: 8px
  - Label: Floating, Medium Gray (#949494) to Rich Black (#121212) on focus

- **Dropdown**: 
  - Closed: Same as Text Input
  - Open: 
    - Border: 1px solid Vibrant Yellow (#FFD43A)
    - Shadow: 0px 8px 16px rgba(0, 0, 0, 0.1)
    - Selected Item: Light Yellow (#FFE380) background
  - Animation: 0.2s expand/collapse

- **Checkbox/Radio**: 
  - Unchecked: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Checked: Vibrant Yellow (#FFD43A) fill with Rich Black (#121212) checkmark
  - Animation: 0.2s fill transition

- **Toggle Switch**: 
  - Off: Light Gray (#E0E0E0) track, White (#FFFFFF) thumb
  - On: Vibrant Yellow (#FFD43A) track, Rich Black (#121212) thumb
  - Animation: 0.2s slide transition

#### Navigation Elements
- **Tabs**: 
  - Inactive: Medium Gray (#949494) text, no underline
  - Active: Rich Black (#121212) text, 2px Vibrant Yellow (#FFD43A) underline
  - Hover: Dark Gray (#3D3D3D) text
  - Animation: 0.2s underline and color transition

- **Sidebar**: 
  - Background: Rich Black (#121212)
  - Text: Light Gray (#E0E0E0)
  - Active Item: Vibrant Yellow (#FFD43A) background, Rich Black (#121212) text
  - Hover: Dark Gray (#3D3D3D) background
  - Collapsed State: Icons only
  - Animation: 0.3s width transition

- **Breadcrumbs**: 
  - Text: Medium Gray (#949494)
  - Separator: Light Gray (#E0E0E0)
  - Current Page: Rich Black (#121212)

- **Pagination**: 
  - Inactive: White (#FFFFFF) background, Medium Gray (#949494) text
  - Active: Vibrant Yellow (#FFD43A) background, Rich Black (#121212) text
  - Hover: Light Yellow (#FFE380) background
  - Border Radius: 4px

### 1.4 Iconography

- **Style**: Outlined style using Lucide Icons
- **Primary Color**: Rich Black (#121212)
- **Accent Color**: Vibrant Yellow (#FFD43A)
- **Status Colors**: Same as functional colors
- **Sizes**: 16px, 20px, 24px (standard UI), 32px, 48px (feature areas)
- **States**: 
  - Normal: Rich Black (#121212)
  - Hover: Vibrant Yellow (#FFD43A)
  - Active: Warm Yellow (#FFBB00)
  - Disabled: Light Gray (#E0E0E0)

### 1.5 Animation & Interaction

- **Transitions**: Smooth 0.2-0.3s transitions for state changes
- **Hover Effects**: Subtle scale (1.02-1.05) or elevation changes
- **Page Transitions**: Fade (0.3s) or slide transitions (0.4s)
- **Loading States**: 
  - Spinner: Vibrant Yellow (#FFD43A) to Warm Yellow (#FFBB00) gradient
  - Progress Bar: Vibrant Yellow (#FFD43A) fill animation
- **Micro-interactions**: 
  - Button Press: Subtle scale down (0.98)
  - Success Actions: Quick pulse animation in Success Green
  - Error Actions: Subtle shake animation with Error Red

## 2. Customer App Mockups

### 2.1 Home & Discovery

#### Homepage
- **Header**: 
  - Background: Rich Black (#121212)
  - Logo: Vibrant Yellow (#FFD43A)
  - Search Bar: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - User Profile: White circular icon
  - Cart Icon: Vibrant Yellow (#FFD43A) with item count in Rich Black (#121212)

- **Hero Section**: 
  - Background Gradient: Light Yellow (#FFE380) to Pale Yellow (#FFF4CC)
  - Featured Text: Rich Black (#121212)
  - CTA Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Category Navigation**: 
  - Inactive: White (#FFFFFF) background, Rich Black (#121212) text
  - Active: Vibrant Yellow (#FFD43A) background, Rich Black (#121212) text
  - Icons: Rich Black (#121212)

- **Nearby Section**: 
  - Section Title: Rich Black (#121212)
  - Restaurant Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Ratings: Golden Yellow (#F5A623) stars

- **Special Offers**: 
  - Card Background: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Border Radius: 12px

- **Recently Ordered**: 
  - Background: White (#FFFFFF)
  - Border: Light Gray (#E0E0E0)
  - Restaurant Logo: Circular with White (#FFFFFF) background

- **Footer Navigation**: 
  - Background: Rich Black (#121212)
  - Inactive Icons: Light Gray (#E0E0E0)
  - Active Icon: Vibrant Yellow (#FFD43A)

#### Search & Filtering
- **Search Header**: 
  - Background: Rich Black (#121212)
  - Back Button: Vibrant Yellow (#FFD43A)
  - Search Input: White (#FFFFFF)
  - Voice Search: Vibrant Yellow (#FFD43A) icon

- **Filter Bar**: 
  - Inactive: Light Gray (#E0E0E0) background, Medium Gray (#949494) text
  - Active: Vibrant Yellow (#FFD43A) background, Rich Black (#121212) text
  - Border Radius: 20px (pill shape)

- **Sort Dropdown**: 
  - Background: White (#FFFFFF)
  - Border: Light Gray (#E0E0E0)
  - Selected Option: Light Yellow (#FFE380) background

- **Search Results**: 
  - Background: Smoke Gray (#F8F9FA)
  - Restaurant Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Rating: Golden Yellow (#F5A623) stars

- **Map Toggle**: 
  - Button: Vibrant Yellow (#FFD43A) floating button
  - Icon: Rich Black (#121212)

- **Map View**: 
  - Map: Desaturated style
  - Restaurant Pins: Vibrant Yellow (#FFD43A) with Rich Black (#121212) icon
  - Selected Pin: Warm Yellow (#FFBB00), enlarged

#### Restaurant Profile
- **Header Image**: Large restaurant cover photo with gradient overlay
- **Restaurant Info**: 
  - Logo: White (#FFFFFF) circular background
  - Name: Rich Black (#121212)
  - Rating: Golden Yellow (#F5A623) stars
  - Delivery Time: Vibrant Yellow (#FFD43A) pill with Rich Black (#121212) text

- **Action Bar**: 
  - Save: Outline heart icon, fills with Vibrant Yellow (#FFD43A) when saved
  - Share: Rich Black (#121212) icon
  - Info: Rich Black (#121212) icon

- **Tabs**: 
  - Inactive: Medium Gray (#949494)
  - Active: Rich Black (#121212) with Vibrant Yellow (#FFD43A) underline

- **Menu Categories**: 
  - Heading: Rich Black (#121212)
  - Icon: Medium Gray (#949494)
  - Expanded State: Light Yellow (#FFE380) background

- **Menu Item**: 
  - Name: Rich Black (#121212)
  - Description: Medium Gray (#949494)
  - Price: Vibrant Yellow (#FFD43A)
  - Add Button: Vibrant Yellow (#FFD43A) circular button with Rich Black (#121212) plus icon

- **Item Detail Modal**: 
  - Background: White (#FFFFFF)
  - Close Button: Rich Black (#121212)
  - Add to Cart Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Reviews Section**: 
  - Rating Breakdown: Bar charts with Vibrant Yellow (#FFD43A) fill
  - User Avatar: Circular
  - Review Date: Medium Gray (#949494)

- **Info Section**: 
  - Icons: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Hours: Success Green (#4CAF50) for open, Error Red (#F44336) for closed

### 2.2 Ordering Flow

#### Cart Page
- **Header**: 
  - Title: "Your Cart" in Rich Black (#121212)
  - Restaurant Name: Medium Gray (#949494)

- **Item List**: 
  - Background: White (#FFFFFF)
  - Item Name: Rich Black (#121212)
  - Quantity: Vibrant Yellow (#FFD43A) pill with Rich Black (#121212) text
  - Price: Medium Gray (#949494)

- **Item Controls**: 
  - Edit Button: Medium Gray (#949494) text
  - Remove Button: Error Red (#F44336) text
  - Quantity Adjuster: Rich Black (#121212) +/- buttons, Vibrant Yellow (#FFD43A) count

- **Subtotal Section**: 
  - Background: Smoke Gray (#F8F9FA)
  - Subtotal Text: Medium Gray (#949494)
  - Total: Rich Black (#121212), larger font
  - Divider: Light Gray (#E0E0E0)

- **Promo Code**: 
  - Input: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Apply Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Special Instructions**: 
  - Textarea: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Placeholder: Medium Gray (#949494)

- **Checkout Button**: 
  - Background: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Shadow: 0px 4px 8px rgba(255, 212, 58, 0.3)

#### Checkout Flow
- **Delivery Address**: 
  - Saved Address Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Selected Address: Vibrant Yellow (#FFD43A) border
  - Add New Button: Medium Gray (#949494) border, Vibrant Yellow (#FFD43A) plus icon

- **Delivery Time**: 
  - ASAP Option: Vibrant Yellow (#FFD43A) background when selected
  - Time Picker: White (#FFFFFF) dropdown with Light Gray (#E0E0E0) border
  - Selected Time: Light Yellow (#FFE380) background

- **Payment Method**: 
  - Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Selected Method: Vibrant Yellow (#FFD43A) border
  - Card Icons: Original colors (Visa, Mastercard, etc.)

- **Order Summary**: 
  - Background: Smoke Gray (#F8F9FA)
  - Expandable Header: Medium Gray (#949494)
  - Total: Rich Black (#121212), bold

- **Place Order Button**: 
  - Background: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Loading State: Vibrant Yellow (#FFD43A) with Warm Yellow (#FFBB00) pulse animation

- **Confirmation Screen**: 
  - Success Animation: Checkmark using Vibrant Yellow (#FFD43A) to Success Green (#4CAF50) transition
  - Order Number: Rich Black (#121212), emphasized
  - ETA: Vibrant Yellow (#FFD43A) badge

#### Order Tracking
- **Header**: 
  - Order ID: Medium Gray (#949494)
  - Restaurant Name: Rich Black (#121212)
  - Back Home Button: Vibrant Yellow (#FFD43A) text

- **Status Timeline**: 
  - Completed Steps: Vibrant Yellow (#FFD43A) circles with Rich Black (#121212) icons
  - Current Step: Warm Yellow (#FFBB00) pulsing circle
  - Future Steps: Light Gray (#E0E0E0) circles
  - Line Connector: Vibrant Yellow (#FFD43A) for completed, Light Gray (#E0E0E0) for upcoming

- **Current Status**: 
  - Background: Light Yellow (#FFE380)
  - Text: Rich Black (#121212)
  - Icon: Rich Black (#121212)

- **ETA Section**: 
  - Time: Rich Black (#121212), larger font
  - Countdown: Vibrant Yellow (#FFD43A) numbers

- **Map View**: 
  - Restaurant Pin: Warm Yellow (#FFBB00)
  - Courier Icon: Vibrant Yellow (#FFD43A) moving indicator
  - Destination Pin: Rich Black (#121212)
  - Route Line: Vibrant Yellow (#FFD43A) dashed line

- **Courier Info**: 
  - Photo: Circular frame
  - Name: Rich Black (#121212)
  - Rating: Golden Yellow (#F5A623) stars

- **Contact Options**: 
  - Call Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) phone icon
  - Chat Button: Rich Black (#121212) with White (#FFFFFF) chat icon

- **Order Details**: 
  - Collapsible Section: Smoke Gray (#F8F9FA) background
  - Items: Medium Gray (#949494) text
  - Total: Rich Black (#121212), bold

### 2.3 User Account

#### Profile Page
- **Header**: 
  - Background: Rich Black (#121212)
  - Profile Photo: Circular with Vibrant Yellow (#FFD43A) border
  - Name: White (#FFFFFF)
  - Edit Button: Vibrant Yellow (#FFD43A) text

- **Account Info**: 
  - Section Background: White (#FFFFFF)
  - Labels: Medium Gray (#949494)
  - Values: Rich Black (#121212)
  - Dividers: Light Gray (#E0E0E0)

- **Addresses Section**: 
  - Address Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Default Indicator: Vibrant Yellow (#FFD43A) badge
  - Edit/Delete: Medium Gray (#949494) icons
  - Add New: Vibrant Yellow (#FFD43A) button

- **Payment Methods**: 
  - Card Icons: Original brands
  - Last 4 digits: Rich Black (#121212)
  - Expiry Date: Medium Gray (#949494)
  - Default Indicator: Vibrant Yellow (#FFD43A) badge

- **Preferences**: 
  - Dietary Tags: Light Yellow (#FFE380) with Rich Black (#121212) text
  - Cuisine Preferences: Light Yellow (#FFE380) with Rich Black (#121212) text
  - Toggle Switches: Vibrant Yellow (#FFD43A) when active

- **Order History**: 
  - Section Title: Rich Black (#121212)
  - Order Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Reorder Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Settings**: 
  - Icons: Medium Gray (#949494)
  - Text: Rich Black (#121212)
  - Chevron Indicator: Light Gray (#E0E0E0)

- **Help & Support**: 
  - Icons: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Background: Smoke Gray (#F8F9FA)

#### Order History
- **Header**: 
  - Title: Rich Black (#121212)
  - Filter Button: Medium Gray (#949494) icon

- **Order List**: 
  - Background: Smoke Gray (#F8F9FA)
  - Order Cards: White (#FFFFFF)
  - Separator: Light Gray (#E0E0E0)

- **Order Card**: 
  - Restaurant Logo: Circular
  - Date: Medium Gray (#949494)
  - Total: Rich Black (#121212)
  - Status: 
    - Completed: Success Green (#4CAF50)
    - Cancelled: Error Red (#F44336)
    - Processing: Warm Yellow (#FFBB00)

- **Order Details**: 
  - Expandable Panel: White (#FFFFFF)
  - Items: Medium Gray (#949494)
  - Special Instructions: Medium Gray (#949494), italicized

- **Reorder Button**: 
  - Background: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212)
  - Icon: Refresh icon in Rich Black (#121212)

- **Filter Options**: 
  - Dropdown: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Selected Filter: Light Yellow (#FFE380) background

## 3. Restaurant Management App Mockups

### 3.1 Staff View (Voorkant)

#### Login Screen
- **Logo**: Restaurant branding on Rich Black (#121212) background
- **PIN Pad**: 
  - Background: White (#FFFFFF)
  - Numbers: Rich Black (#121212)
  - Pressed State: Light Yellow (#FFE380)
  - Border Radius: 8px

- **Error Handling**: 
  - Error Message: Error Red (#F44336) text on Light Gray (#E0E0E0) background
  - Shake Animation: Subtle horizontal shake

- **Forgot PIN**: 
  - Text: Vibrant Yellow (#FFD43A)
  - Hover: Warm Yellow (#FFBB00), underline

- **Switch to Admin**: 
  - Text: Medium Gray (#949494)
  - Hover: Rich Black (#121212)

#### Orders Dashboard
- **Header**: 
  - Background: Rich Black (#121212)
  - Logo: Vibrant Yellow (#FFD43A)
  - Staff Name: White (#FFFFFF)
  - Online Status: 
    - Online: Success Green (#4CAF50) dot
    - Offline: Light Gray (#E0E0E0) dot

- **Order Categories**: 
  - Tabs: 
    - Inactive: Medium Gray (#949494)
    - Active: White (#FFFFFF) with Vibrant Yellow (#FFD43A) underline
  - Badge Counter: Vibrant Yellow (#FFD43A) circle with Rich Black (#121212) number

- **Order List**: 
  - Background: Smoke Gray (#F8F9FA)
  - Order Cards: White (#FFFFFF) with status-colored left border
  - Status Colors:
    - New: Vibrant Yellow (#FFD43A)
    - Preparing: Warm Yellow (#FFBB00)
    - Ready: Success Green (#4CAF50)
    - Delivered: Medium Gray (#949494)

- **Order Card**: 
  - Order Number: Rich Black (#121212), bold
  - Table/Delivery: Medium Gray (#949494)
  - Items Count: Rich Black (#121212)
  - Time Elapsed: Medium Gray (#949494) for normal, Warning Amber (#FF9800) if delayed

- **Action Buttons**: 
  - Accept: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Mark Ready: Warm Yellow (#FFBB00) with Rich Black (#121212) text
  - Complete: Success Green (#4CAF50) with White (#FFFFFF) text
  - Reject: Error Red (#F44336) with White (#FFFFFF) text

- **Quick View**: 
  - Expandable Section: Light Yellow (#FFE380) background
  - Item Details: Rich Black (#121212)
  - Special Instructions: Medium Gray (#949494), italicized

- **Alert Indicators**: 
  - New Order: Vibrant Yellow (#FFD43A) pulse animation
  - Audio: Subtle "ding" for new orders

#### Kitchen Display
- **Header**: 
  - Background: Rich Black (#121212)
  - Title: White (#FFFFFF)
  - View Selector: Light Gray (#E0E0E0) tabs
  - Station Filter: Dropdown with Vibrant Yellow (#FFD43A) border when active

- **Preparation Queue**: 
  - Background: Smoke Gray (#F8F9FA)
  - Columns: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Column Headers: Rich Black (#121212) with Vibrant Yellow (#FFD43A) underline

- **Order Details**: 
  - Background: White (#FFFFFF)
  - Item Name: Rich Black (#121212), bold
  - Quantity: Vibrant Yellow (#FFD43A) circle with Rich Black (#121212) number
  - Special Instructions: Pale Yellow (#FFF4CC) background with Rich Black (#121212) text

- **Timing Information**: 
  - Normal: Medium Gray (#949494)
  - Warning (approaching limit): Warning Amber (#FF9800)
  - Overdue: Error Red (#F44336)
  - Timer: Circular progress in appropriate color

- **Action Buttons**: 
  - Start Preparing: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Mark Ready: Success Green (#4CAF50) with White (#FFFFFF) text
  - Item Complete: Rich Black (#121212) with White (#FFFFFF) text

- **Item Cards**: 
  - Border-left: Status colored
  - Drag Handle: Light Gray (#E0E0E0) dots
  - Dragging State: Light Yellow (#FFE380) background, elevation increase

- **Color Coding**: 
  - Priority High: Error Red (#F44336) indicator
  - Priority Normal: No special indicator
  - Status Indicators: Same as Order Cards

#### Table Management
- **Header**: 
  - Background: Rich Black (#121212)
  - Title: White (#FFFFFF)
  - View Selector: Segmented control with Vibrant Yellow (#FFD43A) active state
  - Section Filter: Dropdown with White (#FFFFFF) text

- **Floor Plan View**: 
  - Background: Smoke Gray (#F8F9FA)
  - Grid Lines: Light Gray (#E0E0E0), dotted
  - Wall Elements: Dark Gray (#3D3D3D)
  - Decorative Elements: Medium Gray (#949494)

- **Table Status**: 
  - Available: Success Green (#4CAF50) fill
  - Occupied: Vibrant Yellow (#FFD43A) fill
  - Reserved: Light Yellow (#FFE380) fill
  - Dirty: Medium Gray (#949494) fill with pattern

- **Table Card**: 
  - Background: White (#FFFFFF)
  - Table Number: Rich Black (#121212), bold
  - Guests: Medium Gray (#949494)
  - Time Seated: Medium Gray (#949494), with Warning Amber (#FF9800) when exceeding average time
  - Order Status: Color-coded indicators matching order status colors

- **Action Buttons**: 
  - Seat Guests: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Take Order: Warm Yellow (#FFBB00) with Rich Black (#121212) text
  - Clear Table: Medium Gray (#949494) with White (#FFFFFF) text
  - Mark for Cleaning: Medium Gray (#949494) with broom icon

- **Reservation Overlay**: 
  - Indicator: Translucent Golden Yellow (#F5A623) with time information
  - Countdown: < 15 min to arrival shows pulsing effect

- **Quick Actions**: 
  - Drag and Drop: Light Yellow (#FFE380) ghost image while dragging
  - Menu: Radial menu with Vibrant Yellow (#FFD43A) icons on Rich Black (#121212) background

### 3.2 Admin View (Achterkant)

#### Dashboard
- **Header**: 
  - Background: Rich Black (#121212)
  - Restaurant Name: White (#FFFFFF)
  - User Menu: Circular avatar with Vibrant Yellow (#FFD43A) dropdown indicator
  - Switch to Staff: Vibrant Yellow (#FFD43A) button with Rich Black (#121212) text

- **Key Metrics**: 
  - Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Metric Value: Rich Black (#121212), large
  - Metric Label: Medium Gray (#949494)
  - Trend Indicator: 
    - Positive: Success Green (#4CAF50) arrow up
    - Negative: Error Red (#F44336) arrow down

- **Time Period Selector**: 
  - Background: White (#FFFFFF)
  - Border: Light Gray (#E0E0E0)
  - Active Period: Vibrant Yellow (#FFD43A) background with Rich Black (#121212) text
  - Border Radius: 20px (pill shape)

- **Charts**: 
  - Background: White (#FFFFFF)
  - Grid Lines: Light Gray (#E0E0E0)
  - Data Lines: Vibrant Yellow (#FFD43A) with gradient to transparent
  - Data Points: Rich Black (#121212)
  - Axes: Medium Gray (#949494)

- **Recent Activity**: 
  - Background: Smoke Gray (#F8F9FA)
  - Items: White (#FFFFFF) cards
  - Timestamp: Medium Gray (#949494)
  - Action Text: Rich Black (#121212)
  - Icons: Activity-specific colors

- **Quick Actions**: 
  - Buttons: White (#FFFFFF) with Vibrant Yellow (#FFD43A) icons
  - Text: Rich Black (#121212)
  - Hover: Light Yellow (#FFE380) background

- **Alert Center**: 
  - Background: Light Yellow (#FFE380)
  - Critical Alerts: Error Red (#F44336) left border
  - Warning Alerts: Warning Amber (#FF9800) left border
  - Info Alerts: Info Blue (#2196F3) left border

#### Menu Management
- **Header**: 
  - Background: Rich Black (#121212)
  - Title: White (#FFFFFF)
  - Save Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Publish Button: Warm Yellow (#FFBB00) with Rich Black (#121212) text

- **Category Management**: 
  - Background: Smoke Gray (#F8F9FA)
  - Category Cards: White (#FFFFFF)
  - Active Category: Vibrant Yellow (#FFD43A) left border
  - Add Category: Light Gray (#E0E0E0) dashed border with Vibrant Yellow (#FFD43A) plus icon
  - Drag Handle: Medium Gray (#949494) dots

- **Item Grid**: 
  - Background: White (#FFFFFF)
  - Grid Lines: Light Gray (#E0E0E0)
  - Item Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Item Image: Rounded corners with overlay gradient

- **Item Card**: 
  - Name: Rich Black (#121212)
  - Price: Vibrant Yellow (#FFD43A)
  - Availability Toggle: 
    - On: Vibrant Yellow (#FFD43A) track with Rich Black (#121212) thumb
    - Off: Light Gray (#E0E0E0) track with White (#FFFFFF) thumb
  - Edit Icon: Medium Gray (#949494), becomes Vibrant Yellow (#FFD43A) on hover

- **Item Editor**: 
  - Form Background: White (#FFFFFF)
  - Input Fields: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Labels: Medium Gray (#949494)
  - Section Dividers: Light Gray (#E0E0E0)
  - Save Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Bulk Actions**: 
  - Background: Rich Black (#121212)
  - Text: White (#FFFFFF)
  - Action Buttons: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Preview Mode**: 
  - Toggle: Vibrant Yellow (#FFD43A) switch
  - Frame: Light Gray (#E0E0E0) device outline
  - View Selector: Tabs with Vibrant Yellow (#FFD43A) active state

#### Floor Plan Editor
- **Header**: 
  - Background: Rich Black (#121212)
  - Floor plan name: White (#FFFFFF)
  - Save Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Apply Button: Warm Yellow (#FFBB00) with Rich Black (#121212) text

- **Canvas**: 
  - Background: White (#FFFFFF)
  - Grid: Light Gray (#E0E0E0) dots
  - Selection: Vibrant Yellow (#FFD43A) dashed outline
  - Active Element: Light Yellow (#FFE380) fill

- **Tools Panel**: 
  - Background: Rich Black (#121212)
  - Tool Icons: White (#FFFFFF)
  - Active Tool: Vibrant Yellow (#FFD43A)
  - Separator: Dark Gray (#3D3D3D)

- **Properties Panel**: 
  - Background: White (#FFFFFF)
  - Labels: Medium Gray (#949494)
  - Input Fields: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Apply Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Layers**: 
  - Background: White (#FFFFFF)
  - Layer Items: Rich Black (#121212)
  - Active Layer: Vibrant Yellow (#FFD43A) left border
  - Visibility Toggle: Eye icon, Gray/Yellow
  - Lock Icon: Lock icon, Gray/Yellow

- **Templates**: 
  - Template Thumbnails: Light Gray (#E0E0E0) with Dark Gray (#3D3D3D) elements
  - Selected Template: Vibrant Yellow (#FFD43A) border
  - Apply Template: Vibrant Yellow (#FFD43A) button with Rich Black (#121212) text

- **Preview**: 
  - Toggle Button: Rich Black (#121212) with White (#FFFFFF) text
  - View Modes: Icon tabs with Vibrant Yellow (#FFD43A) active state

#### Staff Management
- **Header**: 
  - Background: Rich Black (#121212)
  - Title: White (#FFFFFF)
  - Add Staff Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Staff List**: 
  - Background: Smoke Gray (#F8F9FA)
  - Staff Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Status Indicator: 
    - Active: Success Green (#4CAF50) dot
    - On Break: Warning Amber (#FF9800) dot
    - Off Duty: Light Gray (#E0E0E0) dot

- **Staff Card**: 
  - Photo: Circular with Light Gray (#E0E0E0) border
  - Name: Rich Black (#121212)
  - Role: Medium Gray (#949494)
  - Quick Actions: Medium Gray (#949494) icons, become Vibrant Yellow (#FFD43A) on hover

- **Staff Editor**: 
  - Form Background: White (#FFFFFF)
  - Input Fields: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Labels: Medium Gray (#949494)
  - Section Headers: Rich Black (#121212) with Vibrant Yellow (#FFD43A) left border
  - Save Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Schedule View**: 
  - Calendar Background: White (#FFFFFF)
  - Time Grid: Light Gray (#E0E0E0)
  - Shift Blocks: Light Yellow (#FFE380) with Rich Black (#121212) text
  - Current Time Indicator: Vibrant Yellow (#FFD43A) line
  - Add Shift: Vibrant Yellow (#FFD43A) plus icon

- **Performance Metrics**: 
  - Chart Background: White (#FFFFFF)
  - Data Bars: Vibrant Yellow (#FFD43A) to Light Yellow (#FFE380) gradient
  - Benchmark Line: Medium Gray (#949494) dashed
  - Labels: Rich Black (#121212)

- **Access Logs**: 
  - Background: White (#FFFFFF)
  - Log Entries: Rich Black (#121212)
  - Timestamp: Medium Gray (#949494)
  - Suspicious Activity: Error Red (#F44336) highlight

#### Settings
- **Header**: 
  - Background: Rich Black (#121212)
  - Categories: White (#FFFFFF) text
  - Active Category: Vibrant Yellow (#FFD43A) underline
  - Save Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **General Settings**: 
  - Background: White (#FFFFFF)
  - Section Titles: Rich Black (#121212) with Vibrant Yellow (#FFD43A) left border
  - Input Fields: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Labels: Medium Gray (#949494)
  - Help Text: Medium Gray (#949494), italicized

- **Order Settings**: 
  - Toggle Switches: Vibrant Yellow (#FFD43A) when active
  - Time Inputs: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Numeric Inputs: Stepper controls with Rich Black (#121212) +/- buttons

- **Payment Settings**: 
  - Payment Method Icons: Original brand colors
  - Active Methods: Vibrant Yellow (#FFD43A) checkbox
  - Security Info: Light Yellow (#FFE380) background with Rich Black (#121212) text

- **Notification Settings**: 
  - Alert Types: Rich Black (#121212)
  - Channel Toggles: Vibrant Yellow (#FFD43A) when active
  - Test Button: Medium Gray (#949494) with bell icon

- **Integration Settings**: 
  - Connected Services: Success Green (#4CAF50) indicator
  - Disconnected Services: Medium Gray (#949494) indicator
  - Connect Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - API Keys: Password field with "show" option

- **Appearance Settings**: 
  - Color Selector: Current palette with Vibrant Yellow (#FFD43A) border around selected
  - Logo Upload: Dashed Light Gray (#E0E0E0) border with upload icon
  - Preview: Phone frame with rendered appearance

## 4. Courier App Mockups

### 4.1 Delivery Management

#### Home Screen
- **Header**: 
  - Background: Rich Black (#121212)
  - Online Status: 
    - Online: Vibrant Yellow (#FFD43A) toggle
    - Offline: Light Gray (#E0E0E0) toggle
  - Earnings Summary: White (#FFFFFF) text

- **Available Orders**: 
  - Background: Smoke Gray (#F8F9FA)
  - Order Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Distance Indicator: Vibrant Yellow (#FFD43A) badge with Rich Black (#121212) text
  - Payout Amount: Rich Black (#121212), bold

- **Order Card**: 
  - Restaurant Logo: Circular
  - Restaurant Name: Rich Black (#121212)
  - Delivery Address: Medium Gray (#949494), truncated
  - Distance: Vibrant Yellow (#FFD43A) badge
  - Estimated Payout: Rich Black (#121212), bold
  - Timer: Light Yellow (#FFE380) background with countdown

- **Map View**: 
  - Map Style: Desaturated
  - Current Location: Pulsing Vibrant Yellow (#FFD43A) dot
  - Heat Map: Gradient from Light Yellow (#FFE380) to Warm Yellow (#FFBB00) to Vibrant Yellow (#FFD43A)
  - Switch to List: Floating button with Rich Black (#121212) icon

- **Quick Filters**: 
  - Background: White (#FFFFFF)
  - Active Filter: Vibrant Yellow (#FFD43A) background with Rich Black (#121212) text
  - Inactive Filter: Light Gray (#E0E0E0) background with Medium Gray (#949494) text

- **Earnings Snapshot**: 
  - Background: Rich Black (#121212)
  - Today's Amount: Vibrant Yellow (#FFD43A), large
  - Active Hours: White (#FFFFFF)
  - Week Progress: Vibrant Yellow (#FFD43A) progress bar

- **Scheduled Shifts**: 
  - Background: White (#FFFFFF)
  - Border: Light Gray (#E0E0E0)
  - Upcoming Shift: Light Yellow (#FFE380) background
  - Time: Rich Black (#121212)
  - Location Zone: Medium Gray (#949494)

#### Order Details
- **Header**: 
  - Accept Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Decline Button: Light Gray (#E0E0E0) with Medium Gray (#949494) text
  - Timer: Countdown in Vibrant Yellow (#FFD43A) with pulse animation at < 10 seconds

- **Restaurant Info**: 
  - Background: White (#FFFFFF)
  - Name: Rich Black (#121212), bold
  - Address: Medium Gray (#949494)
  - Pickup Instructions: Light Yellow (#FFE380) background with Rich Black (#121212) text
  - Call Button: Vibrant Yellow (#FFD43A) phone icon

- **Customer Info**: 
  - Background: White (#FFFFFF)
  - Address: Rich Black (#121212)
  - Distance: Medium Gray (#949494) with map pin icon
  - Delivery Notes: Light Yellow (#FFE380) background with Rich Black (#121212) text

- **Order Summary**: 
  - Background: Smoke Gray (#F8F9FA)
  - Number of Items: Rich Black (#121212)
  - Order Size: Medium Gray (#949494)
  - View Items: Collapsible section with Vibrant Yellow (#FFD43A) indicator when special instructions present

- **Earnings Preview**: 
  - Background: White (#FFFFFF)
  - Base Pay: Medium Gray (#949494)
  - Estimated Tip: Medium Gray (#949494) with "(est.)" label
  - Total: Rich Black (#121212), bold
  - Breakdown: Collapsible section with formula explanation

- **Route Preview**: 
  - Map: Route shown with Vibrant Yellow (#FFD43A) line
  - Restaurant Pin: Warm Yellow (#FFBB00)
  - Customer Pin: Rich Black (#121212)
  - Alternative Routes: Light Gray (#E0E0E0) lines

- **Time Estimates**: 
  - Background: Rich Black (#121212)
  - Pickup Time: White (#FFFFFF)
  - Delivery Time: White (#FFFFFF)
  - Total Time: Vibrant Yellow (#FFD43A)
  - Traffic Indicator: Warning Amber (#FF9800) if heavy traffic

#### Navigation & Delivery
- **Header**: 
  - Background: Rich Black (#121212)
  - Step Indicator: Vibrant Yellow (#FFD43A) text
  - Contact Buttons: White (#FFFFFF) icons

- **Map View**: 
  - Map Size: Large, taking up most of screen
  - Current Location: Pulsing Vibrant Yellow (#FFD43A) dot
  - Route: Vibrant Yellow (#FFD43A) line
  - Destination Marker: Rich Black (#121212) with bounce animation on approach

- **Step Instructions**: 
  - Background: White (#FFFFFF)
  - Current Direction: Rich Black (#121212), bold
  - Distance: Vibrant Yellow (#FFD43A)
  - Next Step Preview: Medium Gray (#949494)
  - Maneuver Icon: Rich Black (#121212)

- **Progress Bar**: 
  - Background: Light Gray (#E0E0E0)
  - Progress: Vibrant Yellow (#FFD43A) fill
  - Stages: Rich Black (#121212) icons for Accepted, Picked Up, Delivered
  - Current Stage: Pulsing indicator

- **Action Button**: 
  - Background: Vibrant Yellow (#FFD43A)
  - Text: Rich Black (#121212), bold
  - Icon: Rich Black (#121212)
  - Loading State: Spinning animation
  - States: "Navigate", "Arrived", "Picked Up", "Delivered"

- **Order Details**: 
  - Expandable Panel: Swipe up from bottom
  - Background: White (#FFFFFF)
  - Order ID: Medium Gray (#949494)
  - Items: Rich Black (#121212)
  - Special Instructions: Light Yellow (#FFE380) background

- **Customer Notes**: 
  - Background: Light Yellow (#FFE380)
  - Text: Rich Black (#121212)
  - Icon: Warning Amber (#FF9800) for important notes

- **Communication Tools**: 
  - Call Button: Green circle with phone icon
  - Message Button: Vibrant Yellow (#FFD43A) circle with chat icon
  - Quick Messages: Pre-set messages in Light Gray (#E0E0E0) chips

#### Earnings
- **Header**: 
  - Background: Rich Black (#121212)
  - Period Selector: Segmented control with Vibrant Yellow (#FFD43A) active state
  - Title: White (#FFFFFF)

- **Earnings Summary**: 
  - Background: Vibrant Yellow (#FFD43A)
  - Total Amount: Rich Black (#121212), large
  - Breakdown Pie Chart: Rich Black (#121212), White (#FFFFFF), Light Yellow (#FFE380) sections
  - Labels: Rich Black (#121212)

- **Earnings Chart**: 
  - Background: White (#FFFFFF)
  - Grid Lines: Light Gray (#E0E0E0)
  - Data Bars: Vibrant Yellow (#FFD43A) to Light Yellow (#FFE380) gradient
  - Average Line: Medium Gray (#949494) dashed
  - Day Labels: Rich Black (#121212)

- **Delivery History**: 
  - Background: Smoke Gray (#F8F9FA)
  - Delivery Cards: White (#FFFFFF)
  - Restaurant Name: Rich Black (#121212)
  - Time: Medium Gray (#949494)
  - Amount: Vibrant Yellow (#FFD43A)

- **Delivery Card**: 
  - Background: White (#FFFFFF)
  - Border: Light Gray (#E0E0E0)
  - Time: Medium Gray (#949494)
  - Restaurant Logo: Circular
  - Earnings Breakdown: Collapsible section with Light Yellow (#FFE380) background

- **Payout Information**: 
  - Background: Rich Black (#121212)
  - Next Date: White (#FFFFFF)
  - Amount: Vibrant Yellow (#FFD43A), large
  - Method: White (#FFFFFF)
  - Change Method: Vibrant Yellow (#FFD43A) text

- **Performance Metrics**: 
  - Background: White (#FFFFFF)
  - Metric Labels: Medium Gray (#949494)
  - Metric Values: Rich Black (#121212)
  - Rating: Golden Yellow (#F5A623) stars
  - Progress Bars: Vibrant Yellow (#FFD43A) fill

## 5. Admin Platform Mockups

### 5.1 Platform Management

#### Admin Dashboard
- **Header**: 
  - Background: Rich Black (#121212)
  - Platform Name: Vibrant Yellow (#FFD43A)
  - Admin Name: White (#FFFFFF)
  - Notification Bell: White (#FFFFFF) with Vibrant Yellow (#FFD43A) counter

- **Key Metrics**: 
  - Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Metric Value: Rich Black (#121212), large
  - Metric Label: Medium Gray (#949494)
  - Trend Indicator: 
    - Positive: Success Green (#4CAF50) arrow up
    - Negative: Error Red (#F44336) arrow down
  - Chart: Small sparkline in Vibrant Yellow (#FFD43A)

- **Platform Health**: 
  - Background: White (#FFFFFF)
  - Status Indicators: 
    - Healthy: Success Green (#4CAF50)
    - Warning: Warning Amber (#FF9800)
    - Critical: Error Red (#F44336)
  - Error Rate Chart: Line chart with threshold markers
  - Performance Graph: Area chart with Vibrant Yellow (#FFD43A) fill

- **User Activity**: 
  - Background: White (#FFFFFF)
  - Chart: Area chart with Light Yellow (#FFE380) to Vibrant Yellow (#FFD43A) gradient
  - Time Scale: Medium Gray (#949494)
  - Data Points: Rich Black (#121212) dots
  - Annotation: Vertical dashed lines for significant events

- **Financial Overview**: 
  - Background: White (#FFFFFF)
  - Revenue Chart: Bar chart with Vibrant Yellow (#FFD43A) bars
  - Processing Status: Color-coded indicators
  - Pending Amount: Warning Amber (#FF9800)
  - Settled Amount: Success Green (#4CAF50)

- **Support Overview**: 
  - Background: White (#FFFFFF)
  - Ticket Volume: Line chart with Medium Gray (#949494) line
  - Response Time: Rich Black (#121212), emphasized
  - Open vs. Closed: Pie chart with Vibrant Yellow (#FFD43A) and Light Gray (#E0E0E0)

- **Quick Access**: 
  - Background: Rich Black (#121212)
  - Icons: Vibrant Yellow (#FFD43A)
  - Labels: White (#FFFFFF)
  - Hover: Light Yellow (#FFE380) icon with White (#FFFFFF) text

#### Restaurant Management
- **Header**: 
  - Background: Rich Black (#121212)
  - Search Bar: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Filter Button: White (#FFFFFF) with filter icon
  - Add Restaurant: Vibrant Yellow (#FFD43A) button with Rich Black (#121212) text

- **Restaurant List**: 
  - Background: Smoke Gray (#F8F9FA)
  - Restaurant Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Status Indicator: 
    - Active: Success Green (#4CAF50) dot
    - Paused: Warning Amber (#FF9800) dot
    - Inactive: Light Gray (#E0E0E0) dot

- **Restaurant Card**: 
  - Logo: Circular with White (#FFFFFF) background
  - Name: Rich Black (#121212), bold
  - Status: Color-coded as above
  - Performance Indicators: Small sparklines in Vibrant Yellow (#FFD43A)
  - Quick Actions: Medium Gray (#949494) icons becoming Vibrant Yellow (#FFD43A) on hover

- **Quick Actions**: 
  - Approve: Success Green (#4CAF50) check icon
  - Pause: Warning Amber (#FF9800) pause icon
  - Contact: Vibrant Yellow (#FFD43A) chat icon
  - View Details: Rich Black (#121212) eye icon

- **Detail View**: 
  - Background: White (#FFFFFF)
  - Section Headers: Rich Black (#121212) with Vibrant Yellow (#FFD43A) left border
  - Data Labels: Medium Gray (#949494)
  - Data Values: Rich Black (#121212)
  - Edit Buttons: Vibrant Yellow (#FFD43A) pencil icons

- **Performance Metrics**: 
  - Background: White (#FFFFFF)
  - Charts: Vibrant Yellow (#FFD43A) data visualization
  - Benchmarks: Medium Gray (#949494) reference lines
  - Tooltips: Rich Black (#121212) on White (#FFFFFF) with Light Gray (#E0E0E0) border

- **Compliance Status**: 
  - Background: White (#FFFFFF)
  - Verified: Success Green (#4CAF50) check icon
  - Pending: Warning Amber (#FF9800) clock icon
  - Missing: Error Red (#F44336) exclamation icon
  - Document Preview: Thumbnail with Light Gray (#E0E0E0) border

#### User Management
- **Header**: 
  - Background: Rich Black (#121212)
  - Search Bar: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - User Type Selector: Segmented control with Vibrant Yellow (#FFD43A) active state
  - Filter Button: White (#FFFFFF) with filter icon

- **User List**: 
  - Background: Smoke Gray (#F8F9FA)
  - User Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Status Badge: 
    - Active: Success Green (#4CAF50) badge
    - Suspended: Error Red (#F44336) badge
    - New: Vibrant Yellow (#FFD43A) badge

- **User Card**: 
  - Avatar: Circular
  - Name: Rich Black (#121212), bold
  - Email: Medium Gray (#949494)
  - User Type: Light Yellow (#FFE380) badge with Rich Black (#121212) text
  - Last Active: Medium Gray (#949494) timestamp

- **Detail View**: 
  - Background: White (#FFFFFF)
  - Tabs: Medium Gray (#949494) with Vibrant Yellow (#FFD43A) active indicator
  - Section Headers: Rich Black (#121212)
  - Data Fields: Medium Gray (#949494) labels with Rich Black (#121212) values

- **Administrative Actions**: 
  - Reset Password: Warning Amber (#FF9800) button
  - Suspend Account: Error Red (#F44336) button
  - Edit Details: Vibrant Yellow (#FFD43A) button with Rich Black (#121212) text
  - Action Confirmation: Modal with Rich Black (#121212) border

- **Activity Log**: 
  - Background: White (#FFFFFF)
  - Timeline: Vertical line in Light Gray (#E0E0E0)
  - Events: Rich Black (#121212) connected to timeline
  - Timestamps: Medium Gray (#949494)
  - Event Types: Color-coded icons based on activity type

- **Support History**: 
  - Background: White (#FFFFFF)
  - Ticket Cards: Light Gray (#E0E0E0) background
  - Status: Color-coded badges
  - Resolution: Rich Black (#121212) text
  - Expand/Collapse: Vibrant Yellow (#FFD43A) chevron icon

#### Content Management
- **Header**: 
  - Background: Rich Black (#121212)
  - Content Type Selector: Tabs with Vibrant Yellow (#FFD43A) active indicator
  - Moderation Queue Counter: Vibrant Yellow (#FFD43A) badge with Rich Black (#121212) number

- **Review Moderation**: 
  - Background: Smoke Gray (#F8F9FA)
  - Review Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Flagged Content: Light Yellow (#FFE380) highlight
  - Rating: Golden Yellow (#F5A623) stars
  - User Info: Medium Gray (#949494)

- **Restaurant Content**: 
  - Background: White (#FFFFFF)
  - Content Preview: Thumbnail with Light Gray (#E0E0E0) border
  - Restaurant Name: Rich Black (#121212)
  - Content Type: Medium Gray (#949494)
  - Status Badge: Color-coded as before

- **Promotional Content**: 
  - Background: White (#FFFFFF)
  - Promo Preview: Large image preview
  - Date Range: Medium Gray (#949494)
  - Target Audience: Light Yellow (#FFE380) badges
  - Status Toggle: Vibrant Yellow (#FFD43A) when active

- **Reported Content**: 
  - Background: White (#FFFFFF)
  - Severity Indicator: 
    - High: Error Red (#F44336) vertical bar
    - Medium: Warning Amber (#FF9800) vertical bar
    - Low: Medium Gray (#949494) vertical bar
  - Reporter Info: Medium Gray (#949494)
  - Content Preview: Truncated with "show more" option

- **Batch Actions**: 
  - Background: Rich Black (#121212)
  - Approve Button: Success Green (#4CAF50) with White (#FFFFFF) text
  - Reject Button: Error Red (#F44336) with White (#FFFFFF) text
  - Flag Button: Warning Amber (#FF9800) with White (#FFFFFF) text
  - Selected Count: Vibrant Yellow (#FFD43A) badge

- **Publishing Tools**: 
  - Background: White (#FFFFFF)
  - Message Composer: Rich text editor with toolbar
  - Audience Selector: Multi-select dropdown
  - Schedule Options: Date/time picker
  - Send Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

### 5.2 System Configuration

#### System Settings
- **Header**: 
  - Background: Rich Black (#121212)
  - Settings Categories: White (#FFFFFF) with Vibrant Yellow (#FFD43A) active indicator
  - Environment Indicator: 
    - Production: Error Red (#F44336) badge
    - Staging: Warning Amber (#FF9800) badge
    - Development: Success Green (#4CAF50) badge

- **Feature Flags**: 
  - Background: White (#FFFFFF)
  - Feature Name: Rich Black (#121212)
  - Description: Medium Gray (#949494)
  - Toggle: Vibrant Yellow (#FFD43A) when active
  - Environment Selector: Tabs with color-coded indicators

- **Service Configuration**: 
  - Background: White (#FFFFFF)
  - Service Icons: Original service logos
  - Status Indicator: Success Green (#4CAF50) when connected
  - Credential Fields: Password input with "show" option
  - Test Connection: Vibrant Yellow (#FFD43A) button with Rich Black (#121212) text

- **Notification Templates**: 
  - Background: White (#FFFFFF)
  - Template Selector: Dropdown with Light Gray (#E0E0E0) border
  - Editor: Rich text editor with variables in Light Yellow (#FFE380) background
  - Preview Button: Medium Gray (#949494) button with eye icon
  - Save Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

- **Global Parameters**: 
  - Background: White (#FFFFFF)
  - Parameter Name: Rich Black (#121212)
  - Value Input: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Description: Medium Gray (#949494), italicized
  - History: Small clock icon showing revision history

- **Rate Limiting**: 
  - Background: White (#FFFFFF)
  - Endpoint Path: Rich Black (#121212), monospace font
  - Limit Inputs: Numeric inputs with stepper controls
  - Time Window: Dropdown selector
  - Override Toggle: Vibrant Yellow (#FFD43A) when active

- **Maintenance Mode**: 
  - Background: Light Yellow (#FFE380)
  - Toggle: Large switch, Error Red (#F44336) when active
  - Message Editor: Text area for maintenance message
  - Scheduled Maintenance: Date/time picker
  - Excluded IPs: Tag input with Light Gray (#E0E0E0) tags

#### Analytics Dashboard
- **Header**: 
  - Background: Rich Black (#121212)
  - Date Range Selector: White (#FFFFFF) dropdown with calendar icon
  - Export Options: White (#FFFFFF) button with download icon

- **User Analytics**: 
  - Background: White (#FFFFFF)
  - Charts: Line charts with Vibrant Yellow (#FFD43A) data lines
  - Growth Metrics: Rich Black (#121212) with trend indicators
  - Segmented Data: Multi-series charts with distinct colors
  - Tooltips: Rich information on hover

- **Order Analytics**: 
  - Background: White (#FFFFFF)
  - Volume Chart: Bar chart with Vibrant Yellow (#FFD43A) bars
  - Value Chart: Line chart with area fill
  - Completion Rate: Circular progress in Success Green (#4CAF50)
  - Breakdown: Pie chart with varied colors

- **Restaurant Analytics**: 
  - Background: White (#FFFFFF)
  - Onboarding Funnel: Funnel chart with gradual color shift
  - Activity Heatmap: Calendar heatmap from Light Yellow (#FFE380) to Vibrant Yellow (#FFD43A)
  - Performance Ranking: Horizontal bar chart with restaurant logos
  - Filters: Multi-select dropdowns for cuisine, area, etc.

- **Financial Analytics**: 
  - Background: White (#FFFFFF)
  - Revenue Chart: Area chart with Vibrant Yellow (#FFD43A) fill
  - Payment Types: Donut chart with segment labels
  - Refund Rate: Small gauge chart with acceptable range indicated
  - Fee Breakdown: Stacked bar chart with categorized colors

- **Geographic Analytics**: 
  - Background: White (#FFFFFF)
  - Heat Map: Gradient overlay from Light Yellow (#FFE380) to Vibrant Yellow (#FFD43A)
  - Regional Performance: Choropleth map with color intensity
  - Top Areas Table: Data table with Rich Black (#121212) text
  - Area Comparison: Radar chart with multiple areas

- **Custom Reports**: 
  - Background: White (#FFFFFF)
  - Metric Selector: Multi-select with checkboxes
  - Dimension Selector: Dropdown with common dimensions
  - Preview: Sample data table with first 10 rows
  - Generate Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text

#### Support Center
- **Header**: 
  - Background: Rich Black (#121212)
  - Ticket Status Filter: Segmented control with Vibrant Yellow (#FFD43A) active state
  - Search: White (#FFFFFF) input with search icon
  - Create Ticket: Vibrant Yellow (#FFD43A) button with Rich Black (#121212) text

- **Ticket Queue**: 
  - Background: Smoke Gray (#F8F9FA)
  - Ticket Cards: White (#FFFFFF) with Light Gray (#E0E0E0) border
  - Priority Indicator: 
    - High: Error Red (#F44336) tag
    - Medium: Warning Amber (#FF9800) tag
    - Low: Info Blue (#2196F3) tag

- **Ticket Card**: 
  - User: Rich Black (#121212) with avatar
  - Issue Type: Light Yellow (#FFE380) badge
  - Priority: Color-coded as above
  - Time Open: Medium Gray (#949494) with warning highlight if overdue
  - Preview: Truncated issue description

- **Ticket Detail**: 
  - Background: White (#FFFFFF)
  - Conversation: Chat-like interface with alternating message alignment
  - User Messages: Light Gray (#E0E0E0) background
  - Staff Messages: Light Yellow (#FFE380) background
  - System Messages: Medium Gray (#949494), italicized

- **Assignment Tools**: 
  - Background: White (#FFFFFF)
  - Assign Dropdown: Team member selector with avatars
  - Priority Selector: Color-coded as above
  - Escalate Button: Warning Amber (#FF9800) with up arrow icon
  - Status Dropdown: Color-coded status options

- **Knowledge Base**: 
  - Background: White (#FFFFFF)
  - Search: Light Gray (#E0E0E0) input with search icon
  - Categories: Rich Black (#121212) with icon
  - Articles: Medium Gray (#949494) with relevance indicator
  - Insert Button: Vibrant Yellow (#FFD43A) with plus icon

- **Macro Responses**: 
  - Background: White (#FFFFFF)
  - Macro List: Rich Black (#121212) with preview on hover
  - Categories: Tabs with Vibrant Yellow (#FFD43A) active indicator
  - Insert Button: Vibrant Yellow (#FFD43A) with Rich Black (#121212) text
  - Edit Button: Medium Gray (#949494) pencil icon

## 6. Responsive Considerations

### 6.1 Mobile Optimization
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Font Scaling**: Typography that adjusts appropriately for screen size
- **Simplified Navigation**: Collapsible menus, bottom navigation bars
- **Content Prioritization**: Critical content displayed first in mobile view
- **Reduced Animation**: Simplified motion for performance and battery life
- **Color Consistency**: Maintain Vibrant Yellow (#FFD43A) and Rich Black (#121212) as primary identifiers

### 6.2 Tablet Adaptations
- **Split Views**: Two-panel layouts for appropriate screens
- **Enhanced Controls**: More detailed controls than mobile
- **Touch + Keyboard**: Support for both input methods
- **Orientation Support**: Optimized for both portrait and landscape
- **Color Application**: More subtle use of Light Yellow (#FFE380) backgrounds for content areas

### 6.3 Desktop Enhancements
- **Multi-column Layouts**: Efficient use of additional screen real estate
- **Keyboard Shortcuts**: Productivity enhancements for power users
- **Detailed Data Views**: More comprehensive information displays
- **Tool Tips & Context Help**: Additional guidance available on hover
- **Multi-window Support**: For restaurant staff managing multiple tasks
- **Advanced Color Usage**: Full palette implementation with gradient effects and subtle shadows

## 7. Accessibility Considerations

### 7.1 Visual Accessibility
- **Color Contrast**: 
  - Rich Black (#121212) on Vibrant Yellow (#FFD43A): 11.3:1 ratio (exceeds WCAG AAA)
  - Vibrant Yellow (#FFD43A) on Rich Black (#121212): 11.3:1 ratio (exceeds WCAG AAA)
  - Medium Gray (#949494) text only used on White (#FFFFFF) or very light backgrounds
- **Text Sizing**: Support for browser text size adjustments
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Indicators**: Clear visual focus states using Vibrant Yellow (#FFD43A) outlines
- **Icon Labels**: Text accompaniment for icons to ensure understanding

### 7.2 Interactive Accessibility
- **Keyboard Navigation**: Complete keyboard accessibility for all functions
- **Touch Alternatives**: Multiple input method support
- **Error Prevention**: Confirmation for destructive actions using Error Red (#F44336) alerts
- **Form Validation**: Clear error messages with Error Red (#F44336) highlighting
- **Time Insensitivity**: Options to extend time limits where applicable

### 7.3 Cognitive Accessibility
- **Consistent Patterns**: Familiar UI patterns across the platform
- **Progressive Disclosure**: Information presented in manageable chunks
- **Clear Instructions**: Straightforward guidance for complex tasks
- **Forgiving Design**: Easy error recovery and undo capabilities
- **Reduced Distractions**: Minimal animations and non-essential elements
- **Color Signaling**: Consistent use of Vibrant Yellow (#FFD43A) for primary actions

## 8. Implementation Notes

### 8.1 Component Library
- Implementation using Shadcn/UI as the foundation
- Custom theme extension for brand-specific styling using Vibrant Yellow (#FFD43A) and Rich Black (#121212)
- Shared component library in @repo/ui package
- Storybook documentation for all components

### 8.2 Design-to-Development Handoff
- Figma design system with component properties
- Component prop documentation for developers
- Interaction specifications for animations and state changes
- Responsive breakpoint definitions and behavior
- Color tokens defined as CSS variables and Tailwind theme extension

### 8.3 Prototype Testing
- Interactive prototypes for key user flows
- Usability testing protocol for each user type
- Accessibility audit checklist
- Performance benchmark targets
- Color contrast verification for all text combinations

This design system and mockup overview provides a comprehensive foundation for implementing the All-in-One Food Platform's user interfaces with the new black and yellow color palette. The system prioritizes consistency, usability, and brand identity while ensuring accessibility and responsiveness across all devices and user contexts.
