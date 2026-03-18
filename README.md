# Activity Feed

Infinite scroll activity feed with Vue 3 frontend and Node.js backend.

## Tech Stack

**Backend:** Node.js, Express, MongoDB  
**Frontend:** Vue 3, Vite, Tailwind CSS

## Setup

### Backend
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/activity-feed
```

Run:
```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## API

### Get Feed
```
GET /api/feed?lastId=<cursor>&limit=10
```

Response:
```json
{
  "success": true,
  "data": [{ "_id": "...", "title": "...", "description": "...", "imageUrl": "..." }],
  "pagination": { "hasMore": true, "nextCursor": "..." }
}
```

### Create Activity
```
POST /api/feed
Content-Type: application/json

{ "title": "My activity", "description": "...", "imageUrl": "..." }
```

## Features

- Infinite scroll with cursor-based pagination
- Loading skeletons
- Error handling with retry
- Responsive design
