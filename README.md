# JobTracker

A modern job application tracking dashboard built with Next.js, TypeScript, Supabase, Tailwind CSS, dnd-kit, and Recharts.

JobTracker helps users organize job applications, move them through different stages, track sources and work types, search and filter applications, and view useful application statistics and analytics.

## Features

- Email/password authentication with Supabase Auth
- Protected dashboard routes
- Add, edit, and delete job applications
- Kanban board with five application stages:
  - Saved
  - Applied
  - Interview
  - Offer
  - Rejected
- Drag-and-drop application movement
- Persistent status and position updates in Supabase
- Mobile and tablet drag-and-drop support
- Search applications by:
  - Company
  - Role
  - Location
  - Notes
  - Application source
  - Work type
- Filter applications by:
  - Application source
  - Work type
- Track application sources such as:
  - Job Portal
  - Career Page
  - Cold Email
  - Recruiter Outreach
  - Referral
  - Other
- Track work types:
  - Remote
  - Hybrid
  - On-site
- Dashboard statistics:
  - Total applications
  - Interviews
  - Offers
  - Response rate
- Analytics charts for:
  - Applications by status
  - Applications by source
- Loading, error, and empty states
- Responsive desktop, tablet, and mobile layout
- Accessible forms, buttons, navigation, and keyboard interactions
- Dark SaaS-style interface
## Screenshots

### Dashboard

![JobTracker Dashboard](./public/screenshots/job-1.png)

### Add Application

![Add Application](./public/screenshots/job-2.png)

### Application Board

![JobTracker Application Board](./public/screenshots/job-3.png)

### Login

![JobTracker Login](./public/screenshots/job-4.png)

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- dnd-kit
- Recharts
- Lucide React
- Git and GitHub
- Vercel

## Database

JobTracker uses a PostgreSQL database through Supabase.

Each application stores information such as:

- Company
- Role
- Status
- Application source
- Location
- Work type
- Job URL
- Salary
- Applied date
- Follow-up date
- Notes
- Position
- Created date
- Updated date

## Authentication and Security

Authentication is handled with Supabase Auth.

The `applications` table uses Row Level Security policies so authenticated users can only access and modify their own application records.

Policies are applied for:

- SELECT
- INSERT
- UPDATE
- DELETE

Each application is associated with the authenticated user through the `user_id` field.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/jaskritkaur-dev/job-application-tracker.git