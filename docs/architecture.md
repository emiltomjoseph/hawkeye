# System Architecture

## High-Level Architecture

```
                 User
                   │
                   ▼
        Next.js Frontend
                   │
         REST API (HTTPS)
                   │
                   ▼
          FastAPI Backend
        ┌──────────┴──────────┐
        │                     │
 Authentication        Scanner Engine
        │                     │
        └──────────┬──────────┘
                   │
             PostgreSQL Database
```

## Components

### Frontend
- User Interface
- Authentication
- Dashboard
- Scan Submission
- Report Viewer

### Backend
- Authentication API
- Scanner API
- Report Generation
- User Management

### Scanner Engine
- HTTPS Check
- SSL Analysis
- Header Analysis
- Cookie Analysis
- robots.txt Analysis
- sitemap.xml Analysis
- Technology Detection

### Database
- Users
- Scan History
- Reports
