# Activity Feed Frontend

A Vue 3 infinite scroll activity feed built with Vite and Tailwind CSS.

## Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ActivityCard.vue      # Individual activity card
│   │   ├── ActivityFeed.vue      # Main feed with infinite scroll
│   │   └── LoadingSkeleton.vue   # Loading placeholder
│   ├── services/
│   │   └── api.js                # Axios API service
│   ├── App.vue                   # Root component
│   ├── main.js                   # Entry point
│   └── style.css                 # Tailwind imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Installation

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend first (in another terminal):
```bash
cd backend
npm install
npm run dev
```

### Start the frontend:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Backend API Connection

The frontend connects to the backend API at `http://localhost:5000/api/feed`

### API Endpoint:
```
GET /api/feed?lastId=<cursor>&limit=10
```

### Example Response:
```json
[
  {
    "_id": "66521a",
    "title": "User uploaded photo",
    "description": "Nice sunset",
    "imageUrl": "https://picsum.photos/400/300",
    "createdAt": "2026-03-16"
  }
]
```

## Features

- **Infinite Scroll** - Uses IntersectionObserver for efficient scroll detection
- **Loading States** - Skeleton loading UI while fetching
- **Error Handling** - Displays error message with retry option
- **Responsive Design** - Works on mobile and desktop
- **Cursor-based Pagination** - Uses `lastId` for efficient pagination

## Key Implementation Details

### Infinite Scroll Logic (ActivityFeed.vue)
- Uses `IntersectionObserver` to detect when sentinel element is visible
- Triggers `loadActivities()` when user scrolls near bottom
- Appends new activities to existing array
- Stops fetching when no more data available

### State Management
```javascript
const activities = ref([])      // Array of activity items
const loading = ref(false)      // Loading state
const lastId = ref(null)        // Cursor for pagination
const hasMore = ref(true)       // Whether more data exists
const error = ref(null)         // Error message
```

### API Service (api.js)
```javascript
fetchFeed(lastId, limit)
// If lastId is null: GET /api/feed?limit=10
// Otherwise: GET /api/feed?lastId=XYZ&limit=10
```

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.
