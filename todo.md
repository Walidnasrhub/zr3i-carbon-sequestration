# Zr3i Carbon Sequestration Website - TODO

## Phase 1: Bilingual Support (Arabic/English)
- [x] Create language context and provider
- [x] Add language toggle in navigation header
- [x] Translate all page content to Arabic
- [x] Implement RTL layout support for Arabic
- [x] Add language preference persistence

## Phase 2: Functional Contact Form
- [x] Create contact form component with validation
- [x] Add tRPC procedure for form submission
- [x] Integrate email sending to info@zr3i.com (via owner notification)
- [x] Add success/error notifications
- [x] Store submissions in database (via notification system)

## Phase 3: Interactive Carbon Calculator
- [x] Create calculator component with inputs
- [x] Build calculation logic (farm size → CO₂ sequestration)
- [x] Add tRPC procedure for calculations
- [x] Display results with visualizations
- [x] Add export/share functionality

## Phase 4: Email Notifications & SendGrid Integration
- [ ] Set up SendGrid account and API key
- [ ] Install SendGrid npm package
- [ ] Create email templates for contact form confirmations
- [ ] Create email templates for admin notifications
- [ ] Implement SendGrid integration in contact form handler
- [ ] Test email sending functionality
- [ ] Add email configuration to environment variables

## Phase 5: Multi-Page Website Architecture
- [x] Create routing structure for new pages
- [x] Set up navigation menu with page links
- [x] Create page layout wrapper component
- [x] Implement breadcrumb navigation
- [x] Add footer with links and contact info
- [x] Create 404 error page

## Phase 6: Dedicated Landing Pages

### For Farmers
- [x] Create Farmers landing page with benefits
- [x] Add farmer success stories section
- [x] Create step-by-step onboarding guide
- [ ] Add FAQ section for farmers
- [x] Create "How It Works" explainer section
- [ ] Add farmer testimonials carousel

### For Investors
- [x] Create Investors landing page
- [x] Add investment opportunity details
- [x] Create financial projections section
- [x] Add impact metrics and ROI calculations
- [x] Create case studies section
- [ ] Add investor resources and documents

### For Partners
- [x] Create Partners landing page
- [x] Add partnership opportunities section
- [x] Create partnership benefits overview
- [ ] Add partner testimonials
- [ ] Create partnership application form
- [ ] Add partner resources

### For Enterprises
- [x] Create Enterprise Solutions page
- [x] Add bulk carbon credit purchase options
- [x] Create enterprise pricing section
- [ ] Add enterprise case studies
- [ ] Create enterprise contact form
- [ ] Add API documentation link

### General Pages
- [x] Create About Us page with company mission
- [ ] Create Blog/Resources page structure
- [ ] Create Pricing page with subscription tiers
- [ ] Create FAQ page with comprehensive Q&A
- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page
- [ ] Create Contact Us page with contact form

## Phase 7: Testing & Deployment
- [ ] Test all page routing and navigation
- [ ] Test email notifications for all forms
- [ ] Test responsive design on mobile devices
- [ ] Test bilingual support on all pages
- [ ] Verify SEO meta tags on all pages
- [ ] Performance optimization and testing
- [ ] Cross-browser compatibility testing
- [ ] Deploy to Vercel
- [ ] Verify all pages live on zr3i.com
