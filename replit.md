# Guia Immigration - Digital Immigration Assistance Platform

## Overview

Guia Immigration is a bilingual (English/Spanish) digital platform designed to help people file their own immigration forms with confidence. The website provides step-by-step guides, checklists, live USCIS data, and AI-powered assistance to simplify complex immigration processes while maintaining clear legal disclaimers.

## Project Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Custom language provider supporting English and Spanish

### Backend Architecture
- **Runtime**: Node.js with TypeScript (ESM modules)
- **Framework**: Express.js for REST API
- **Database**: In-memory storage for development
- **Development**: tsx for TypeScript execution in development

### Key Features
- **Bilingual Support**: Complete English/Spanish language toggle
- **Navigation**: Smooth scrolling header with tabbed sections
- **Immigration Guides**: Step-by-step guides for various immigration forms
- **Live USCIS Data**: Real-time fees, processing times, and office addresses
- **AI Assistant**: Immigration Q&A support (placeholder implementation)
- **Legal Compliance**: Comprehensive legal disclaimers
- **User-Friendly Design**: Clean, professional interface

## Database Schema
- **Users**: Basic user management
- **Guides**: Immigration form guides with bilingual content
- **Contact Messages**: User inquiries and feedback
- **USCIS Data**: Live immigration data (fees, processing times)

## User Preferences
- **Communication Style**: Simple, everyday language
- **Project Approach**: Step-by-step development with user confirmation at each stage
- **Business Focus**: Digital business selling immigration checklists and guides
- **Legal Compliance**: Very careful not to give legal advice - comprehensive disclaimers required

## Recent Changes
- **December 27, 2024**: Added "See More Testimonials" button under Success Stories section on main page directing to testimonials reading page
- **December 27, 2024**: Fixed testimonials footer link to show success stories first before submission form
- **December 27, 2024**: Created dedicated testimonials reading page (/testimonials) with 6 detailed success stories covering different immigration forms
- **December 27, 2024**: Added complete Spanish translations to free immigration checklists page for full bilingual functionality
- **December 27, 2024**: Updated testimonials routing: /testimonials shows stories, /testimonials/submit shows form

## Previous Changes
- **December 27, 2024**: Reorganized footer navigation with three main sections: Our Guides (direct links to purchasable forms), Resources (USCIS tools and free content), and Support (contact/help options)
- **December 27, 2024**: Added user's custom logo to website branding - positioned as watermark on hero image and in footer section, maintained original text logo in header navigation
- **December 27, 2024**: Completed comprehensive Spanish translations for all Resources sub-pages (Glossary, Filing Order, Common Mistakes, Filing Fees, FAQ)
- **December 27, 2024**: Added full bilingual functionality to Videos page, Translations page, and Resources sections with professional Spanish translations
- **December 27, 2024**: Resolved TypeScript compilation issues related to duplicate translation keys across all components
- **December 27, 2024**: Enhanced Resources sub-pages with complete Spanish terminology, immigration form descriptions, and legal content
- **December 27, 2024**: Implemented complete Stripe payment integration for both translation services and immigration forms
- **December 27, 2024**: Built immediate PDF download system for purchased immigration guides with secure tokenized links
- **December 27, 2024**: Created dedicated checkout pages for forms with Stripe Elements payment processing
- **December 27, 2024**: Added form purchase success page with automatic download generation and 24-hour expiring links
- **December 27, 2024**: Created complete translation order management system with database integration
- **December 27, 2024**: Built admin dashboard at /admin for managing translation orders with real-time status updates
- **December 27, 2024**: Implemented PostgreSQL database with translation_orders table and full CRUD operations
- **December 27, 2024**: Enhanced translation page with order submission, automatic order numbering, and success confirmation
- **December 27, 2024**: Added Spanish to English translation disclaimer and professional workflow management
- **December 27, 2024**: Built comprehensive forms purchasing system with 10+ immigration form guides (I-130, I-485, N-400, I-765, I-131, I-751, I-864, I-129F, I-90, I-601)
- **December 27, 2024**: Created dedicated /forms page displaying all available guides with detailed features, pricing, and difficulty levels
- **December 27, 2024**: Updated main page to show 3 featured forms with "View All Immigration Forms" button directing to complete forms catalog
- **December 27, 2024**: Implemented functional "Buy Now" buttons throughout site that direct to checkout page with proper form parameters
- **December 27, 2024**: Enhanced checkout system to handle form purchases via URL parameters with complete order summaries
- **December 27, 2024**: Fixed slogan text color from blue to black in header for better visual consistency
- **December 27, 2024**: Reorganized Resources page Additional Resources section - moved "Free Checklists" above "Official USCIS Links" as requested
- **December 27, 2024**: Updated Free Forms page to "Free Immigration Checklists" with dummy PDF placeholders for I-130, I-485, N-400, and I-765 checklists
- **December 27, 2024**: Completed comprehensive Spanish translation coverage across all components (Testimonials, Translations page, Resources sections)
- **December 27, 2024**: Fixed ZIP code field office locator with comprehensive USCIS office database covering major metropolitan areas with real addresses and contact information
- **December 27, 2024**: Moved four hero subsections (Bilingual Support, Step-by-Step Guides, LIVE USCIS Updates, AI Immigration Assistant) below hero and above guides for improved visual flow
- **December 27, 2024**: Implemented comprehensive Live USCIS Data section with real 2024 filing fees, processing times, and ZIP code office lookup
- **December 27, 2024**: Added Essential Immigration Resources section with direct links to I-864P Poverty Guidelines, USCIS website, and online filing portal
- **December 27, 2024**: Updated translation pricing structure: Standard ($25 first page, $15 additional), Rush ($40 first page, $25 additional)
- **December 27, 2024**: Redesigned Live USCIS Data cards to compact box format matching Essential Resources styling
- **December 26, 2024**: Fresh project restart - created new "Guia Immigration" website from scratch
- **December 26, 2024**: Implemented basic site structure with header, hero section, footer
- **December 26, 2024**: Added bilingual language provider with English/Spanish toggle
- **December 26, 2024**: Created data models for guides, USCIS data, and contact messages
- **December 26, 2024**: Built comprehensive Resources sub-pages: Glossary, Filing Order, Common Mistakes, Fees, FAQ
- **December 26, 2024**: Enhanced Translations page with automatic page counting and pricing calculation

## Current Architecture
- **Main Page (/)**: Hero section, Guides with pricing, Contact form
- **Videos Page (/videos)**: Video tutorials placeholder with notification signup
- **Translations Page (/translations)**: Document upload with automatic page detection and pricing
- **Resources Page (/resources)**: Overview with links to 6 sub-sections
- **Resources Sub-pages**: Glossary, Filing Order, Common Mistakes, Fees, Translations link, FAQ
- **Testimonials Page (/testimonials)**: Customer testimonials placeholder with story submission form

## Next Steps
1. Add Stripe payment integration for guides and translation services
2. Implement live USCIS data integration for the Fees section
3. Create AI assistant functionality
4. Add form submission handling for contact and testimonial forms
5. Test all page navigation and bilingual functionality