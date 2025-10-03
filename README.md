# Nasagram

An Instagram-like interface for browsing NASA Mars rover photos. Built with Next.js and the NASA Mars Photos API.

## Tech Stack

- **Framework**: Next.js 15.5 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: NextAuth.js v5 (Google OAuth)
- **Database**: PostgreSQL with Prisma ORM
- **NASA API Client**: mars-photo-sdk

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database
- NASA API key (get from https://api.nasa.gov)
- Google OAuth credentials (for authentication)

### Environment Variables

Create `.env.local`:

```bash
# NASA API
NASA_API_KEY=your_nasa_api_key
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000

## Architecture

### Data Flow

```
User Request
    ↓
Next.js API Route (/app/api/photos/route.ts)
    ↓
Action Layer (/lib/actions/mars-photos.ts)
    ↓
mars-photo-sdk
    ↓
NASA Mars Photos API
```

### Key Design Decisions

**Three-Layer Architecture:**

- **Data**: Immutable structures (Photo, Manifest types)
- **Calculations**: Pure functions for transformations, filtering, sorting
- **Actions**: Side effects (API calls, database operations)

**Infinite Scroll Implementation:**

- Home feed: Fetches 2 sols per page from both active rovers (Curiosity, Perseverance)
- Rover pages: Fetches 2 sols per page from specific rover
- Goes backwards in time with each page
- Sorts by earth_date descending for chronological order

**Camera Filtering:**

- Uses manifest API to find sols with specific camera
- Fetches all photos from those sols
- Filters client-side by camera name prefix
- See "Camera Name Gotchas" below for why this approach is necessary

**Photo Caching:**

- Stores viewed photo metadata in database for deep linking
- Enables shareable photo URLs that work without prior context
- Lightweight cache (photoId, roverId, sol, date, camera)

## Features

- **Feed View**: Instagram-style single-column photo cards
- **Grid View**: 3-column photo grid
- **Infinite Scroll**: Load more photos as you scroll
- **Camera Filtering**: Filter by rover camera type
- **Date Navigation**: Browse by specific Martian sol or Earth date
- **Favorites**: Save photos (requires authentication)
- **Sharing**: Share individual photo URLs
- **Rover Profiles**: Browse photos by specific rover

## Important Technical Details

### Camera Name Gotchas

The NASA API has inconsistent camera naming between endpoints:

**Manifest API** returns both generic and specific camera names:

- `CHEMCAM` AND `CHEMCAM_RMI`
- `FHAZ` AND `FHAZ_LEFT_B`, `FHAZ_RIGHT_B`
- `NAVCAM` AND `NAV_LEFT_B`, `NAV_RIGHT_B`
- `MAST` AND `MAST_LEFT`, `MAST_RIGHT`

**Camera naming changed over time** (Curiosity example):

- Before Feb 2024: Used generic `NAVCAM`
- After Feb 2024: Uses specific `NAV_LEFT_B`, `NAV_RIGHT_B`
- Filtering by "NAVCAM" requires checking prefix "NAV" to match both

**Photos API** only accepts specific camera names:

- `camera=CHEMCAM` returns 0 photos
- `camera=CHEMCAM_RMI` returns photos

**Solution implemented:**

1. Filter manifest by camera prefix (CHEMCAM matches CHEMCAM_RMI)
2. Map NAVCAM -> NAV prefix (handles naming change over time)
3. Fetch all photos from matching sols (no camera param to API)
4. Filter photos client-side by camera prefix

This handles all camera variants and historical naming changes.

### Pagination Behavior

When filtering by camera:

- Uses manifest to find sols with that camera
- Paginates through those specific sols only
- Each page fetches 2 sols
- Some sols may have zero photos (filtered client-side)

Without camera filter:

- Fetches most recent sols sequentially
- Most sols have photos, consistent page sizes

### Photo URLs

Photo image URLs from NASA are:

- Direct JPG URLs from NASA's servers
- No authentication required
- Can be hotlinked
- Stable (don't expire)

## Database Schema

**User/Auth Tables** (NextAuth standard):

- `User`, `Account`, `Session`, `VerificationToken`

**Application Tables**:

- `Favorite`: User's favorited photos
  - Stores photoId, roverId, sol, date, camera
  - Unique constraint on (userId, photoId)

- `PhotoCache`: Metadata for deep-linkable photos
  - Populated when user views photo
  - Enables sharing URLs like /photo/123456
  - Lightweight (no image storage)

## Development

### Code Structure

```
app/
  api/              # API routes
  [rover]/          # Rover profile pages
  photo/[id]/       # Individual photo pages
  favorites/        # User favorites page

lib/
  actions/          # Server actions (side effects)
  calculations/     # Pure functions
  constants/        # Static data (rovers, cameras)
  hooks/            # React hooks
  providers/        # React context providers

components/
  feed/             # Photo display components
  rover/            # Rover-specific components
  common/           # Shared UI components
```

### Running Tests

```bash
npm run build  # Type checking and build
npm run lint   # ESLint
```

### Formatting

```bash
npx prettier . --write
```

## Known Limitations

1. **Manifest API**: Returns ~4000 sols for Curiosity (4676 total sols exist). Missing some recent sols, but this doesn't affect photo access.

2. **Camera Names**: User sees generic names (CHEMCAM) in UI but API uses specific variants (CHEMCAM_RMI). Handled via prefix matching.

3. **Sol Gaps**: Rovers don't take photos every sol. Infinite scroll may fetch empty sols when going back in time.

4. **Rate Limiting**: NASA API has rate limits. API key recommended (free, higher limits than DEMO_KEY).

## API Reference

NASA Mars Photos API: https://github.com/corincerami/mars-photo-api

Key endpoints used:

- `GET /rovers/{rover}/photos` - Get photos by sol/date
- `GET /manifests/{rover}` - Get mission manifest with sol inventory

## Deployment

Deployed on Vercel. Ensure environment variables are set in Vercel dashboard.

Database should be PostgreSQL-compatible (tested with Vercel Postgres).

## License

MIT License - Copyright (c) 2025 James Langridge

This project uses the NASA API which provides public domain data.
