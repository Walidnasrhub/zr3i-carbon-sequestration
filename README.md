# Zr3i Carbon Sequestration Platform

## Project Overview

Zr3i is a cutting-edge agritech platform that measures, verifies, and monetizes carbon sequestration from date palm cultivation. The platform empowers smallholder farmers to earn sustainable income while combating climate change through innovative carbon credit mechanisms.

**Live Website:** https://zr3i.com

**Repository:** https://github.com/Walidnasrhub/zr3i-carbon-sequestration

**Contact:** info@zr3i.com | +201006055320

---

## Key Features

### 1. Bilingual Interface (Arabic/English)
- Complete language toggle in the header
- Full translation support across all pages and components
- RTL layout support for Arabic content
- Language preference persists in browser storage

### 2. Functional Contact Form
- React Hook Form with Zod validation
- Email field, phone number, and message validation
- tRPC backend integration for secure submission
- Owner notifications on form submission
- Success/error toast notifications
- Mobile-responsive design

### 3. Interactive Carbon Calculator
- Real-time CO₂ sequestration calculations
- Farm size and tree age input fields
- Income projections based on $15/ton CO₂ pricing
- Recharts visualization with bar charts
- Report download functionality (PDF export)
- Responsive design for all devices

### 4. Data-Driven Futurism Design
- Modern aesthetic with navy, cyan, and lime green colors
- Syne font for bold headings, Inter for body text
- Gradient overlays and smooth animations
- Hover effects and interactive elements
- Custom-generated hero images
- Responsive grid layouts

---

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend Framework** | React | 19.0.0 |
| **Routing** | Wouter | 3.3.5 |
| **Styling** | Tailwind CSS | 4.1.14 |
| **UI Components** | shadcn/ui | Latest |
| **Form Handling** | React Hook Form | 7.64.0 |
| **Validation** | Zod | 4.1.12 |
| **API Client** | tRPC | Latest |
| **Charts** | Recharts | 2.15.2 |
| **Build Tool** | Vite | 7.1.7 |
| **Backend** | Express.js | 4.21.2 |
| **Database** | Drizzle ORM | Latest |
| **Package Manager** | pnpm | 10.4.1 |
| **Deployment** | Vercel | - |

---

## Project Structure

```
zr3i-carbon-sequestration/
├── client/                          # Frontend application
│   ├── public/                      # Static assets
│   │   ├── hero-carbon-flow.png
│   │   ├── date-palm-impact.png
│   │   ├── carbon-metrics-abstract.png
│   │   └── farmers-technology.png
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Main landing page
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/
│   │   │   ├── LanguageToggle.tsx  # Language switcher
│   │   │   ├── ContactForm.tsx     # Contact form component
│   │   │   ├── CarbonCalculator.tsx # Calculator component
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── ErrorBoundary.tsx   # Error handling
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx # Language state management
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utility functions
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   └── index.html                  # HTML template
├── server/                          # Backend application
│   ├── index.ts                    # Express server entry point
│   ├── routers.ts                  # tRPC router definitions
│   └── db.ts                       # Database configuration
├── shared/                          # Shared types and constants
│   └── const.ts                    # Shared constants
├── vercel.json                     # Vercel deployment config
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind CSS config
└── README.md                       # This file
```

---

## Installation & Development

### Prerequisites
- Node.js 18+ (recommend 20.x)
- pnpm 10.4.1+
- Git

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Walidnasrhub/zr3i-carbon-sequestration.git
cd zr3i-carbon-sequestration
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start development server:**
```bash
pnpm dev
```

The website will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

This creates optimized production builds in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

---

## Deployment

### Vercel Deployment (Current Setup)

The project is configured for seamless deployment to Vercel with the following configuration:

**vercel.json:**
```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "cleanUrls": true
}
```

**Deployment Steps:**

1. **Automatic Deployment:** Any push to the `main` branch on GitHub automatically triggers a Vercel deployment.

2. **Manual Deployment:** Create a new deployment using the Vercel API:
```bash
COMMIT_SHA=$(git rev-parse HEAD)
curl -X POST "https://api.vercel.com/v13/deployments?teamId=YOUR_TEAM_ID" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"zr3i-carbon-sequestration\",
    \"gitSource\": {
      \"ref\": \"$COMMIT_SHA\",
      \"type\": \"github\",
      \"repo\": \"Walidnasrhub/zr3i-carbon-sequestration\",
      \"repoId\": \"1105787464\"
    }
  }"
```

3. **Assign to Domain:**
```bash
curl -X POST "https://api.vercel.com/v13/deployments/DEPLOYMENT_ID/aliases?teamId=YOUR_TEAM_ID" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alias": "zr3i.com"}'
```

**Environment Variables:**

The following environment variables are automatically injected by Manus:
- `VITE_APP_ID` - Application identifier
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo URL
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL
- `JWT_SECRET` - JWT signing secret
- `OAUTH_SERVER_URL` - OAuth server URL

---

## Features Documentation

### Language Toggle

The language toggle is located in the top-right corner of the navigation header. Users can switch between English and العربية (Arabic) with a single click.

**Implementation:**
- `client/src/contexts/LanguageContext.tsx` - Manages language state
- `client/src/components/LanguageToggle.tsx` - Toggle UI component
- All text strings are defined in translation dictionaries

**Adding New Translations:**

1. Open `client/src/contexts/LanguageContext.tsx`
2. Add new key-value pairs to both English and Arabic translation objects
3. Use `useLanguage()` hook in components to access translations

### Contact Form

The contact form collects inquiries from potential farmers and partners.

**Form Fields:**
- Name (required, min 2 characters)
- Email (required, valid email format)
- Phone (required, 10+ digits)
- Message (required, min 10 characters)

**Backend Integration:**
- tRPC procedure: `contact.submit`
- Validation: React Hook Form + Zod
- Notifications: Sent to owner via built-in notification system
- Response: Success/error toast to user

**Customization:**
Edit `client/src/components/ContactForm.tsx` to modify form fields or validation rules.

### Carbon Calculator

The calculator helps farmers estimate their potential carbon sequestration and income.

**Inputs:**
- Farm Size (in hectares)
- Average Tree Age (in years)

**Calculations:**
- CO₂ Sequestration: Based on tree age and farm size
- Annual Income: $15 per ton of CO₂
- Growth Projections: 5-year forecast with visualization

**Implementation:**
- Component: `client/src/components/CarbonCalculator.tsx`
- Visualization: Recharts BarChart
- Export: PDF report generation

---

## Configuration Files

### tailwind.config.ts
Defines the color palette and design tokens:
- Primary colors: Navy (#001F3F), Cyan (#00BCD4), Lime (#32CD32)
- Typography: Syne for headings, Inter for body
- Spacing and border radius tokens

### vite.config.ts
Vite build configuration with:
- React plugin for JSX support
- Tailwind CSS plugin
- Environment variable handling
- Build optimization settings

### tsconfig.json
TypeScript configuration with:
- Strict mode enabled
- Path aliases for imports
- ES2020 target
- Module resolution

---

## Maintenance & Troubleshooting

### Common Issues

**1. Language toggle not working:**
- Clear browser cache and localStorage
- Verify `LanguageContext.tsx` is properly imported in `App.tsx`
- Check browser console for errors

**2. Contact form not submitting:**
- Verify tRPC backend is running
- Check network tab in browser DevTools
- Ensure all required fields are filled
- Check server logs for validation errors

**3. Carbon calculator showing incorrect values:**
- Verify calculation formulas in `CarbonCalculator.tsx`
- Check input validation for numeric values
- Clear browser cache if using cached data

**4. Images not loading:**
- Verify image files exist in `client/public/`
- Check image paths in components (should be absolute paths like `/image-name.png`)
- Ensure image filenames match exactly

### Performance Optimization

**Current Optimizations:**
- Code splitting with dynamic imports
- Image optimization and lazy loading
- CSS minification via Tailwind
- JavaScript minification via Vite
- Gzip compression on Vercel

**Recommended Improvements:**
- Implement image CDN for faster delivery
- Add service worker for offline support
- Optimize bundle size (currently 1.17MB, consider code splitting)
- Implement caching strategies for static assets

### Monitoring

**Analytics:**
- Umami analytics integrated (see `client/index.html`)
- Track page views, user interactions, and conversions
- Dashboard: https://analytics.example.com (configure in environment)

**Error Tracking:**
- Error Boundary component catches React errors
- Server-side errors logged to console
- Consider integrating Sentry for production monitoring

---

## Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally: `pnpm dev`
3. Build and verify: `pnpm build && pnpm preview`
4. Commit with descriptive messages: `git commit -m "feat: add new feature"`
5. Push and create a Pull Request: `git push origin feature/your-feature`

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules (configured in project)
- Format code with Prettier: `pnpm format`
- Keep components small and focused
- Use meaningful variable and function names

### Testing

Current setup includes Vitest for unit testing. Run tests with:
```bash
pnpm test
```

---

## Security Considerations

1. **Environment Variables:** Never commit `.env` files. Use Vercel's environment variable management.
2. **API Keys:** Store sensitive keys in environment variables, not in code.
3. **CORS:** Configure CORS headers appropriately for API endpoints.
4. **Input Validation:** All user inputs are validated on both client and server.
5. **Authentication:** Implement OAuth for user authentication (configured in template).

---

## Future Enhancements

1. **Farmer Dashboard:** Add user accounts and personalized dashboards
2. **Real-time Notifications:** Implement WebSocket for live updates
3. **Mobile App:** Develop React Native mobile application
4. **Payment Integration:** Add Stripe for carbon credit purchases
5. **Advanced Analytics:** Implement data visualization for impact metrics
6. **Multi-language Support:** Expand beyond Arabic/English
7. **API Documentation:** Create comprehensive API docs with Swagger

---

## Support & Contact

For questions, issues, or feature requests:

- **Email:** info@zr3i.com
- **Phone:** +201006055320
- **GitHub Issues:** https://github.com/Walidnasrhub/zr3i-carbon-sequestration/issues

---

## License

This project is proprietary software owned by Zr3i. All rights reserved.

---

## Changelog

### Version 1.0.0 (November 28, 2025)
- ✅ Initial launch with bilingual support
- ✅ Contact form with validation
- ✅ Interactive carbon calculator
- ✅ Data-Driven Futurism design
- ✅ Vercel deployment configuration
- ✅ Comprehensive documentation

---

**Last Updated:** November 28, 2025
**Maintained By:** Manus AI
**Repository:** https://github.com/Walidnasrhub/zr3i-carbon-sequestration
