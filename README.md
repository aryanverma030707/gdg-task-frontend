# InkSpace — Blog Management Platform

InkSpace is a responsive editorial-style blog platform built for the GDG Technical Department Recruitment Task 2026–27. It lets readers discover stories and gives writers a simple place to publish and manage posts.

## Features

- Explore sample stories in a responsive editorial layout.
- Search by title, excerpt, author, and category; filter by category.
- Read individual articles with reading time and comments.
- Create, edit, and delete your own stories.
- Bookmark stories and like posts.
- Add comments to an article.
- Switch between light and dark themes.
- Helpful empty states, not-found handling, and form validation.
- Persist posts, likes, bookmarks, comments, and theme preferences in localStorage.
- Mobile navigation and reduced-motion support.

## Tech stack

- React and Vite
- React Router
- Lucide React
- CSS
- Browser localStorage

## Run locally

Requirements: Node.js 18 or later and npm.

```bash
git clone https://github.com/aryanverma030707/gdg-task-frontend.git
cd gdg-task-frontend
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run build
npm run preview
```

## Data and persistence

The app starts with sample editorial stories in `src/App.jsx`. Posts and user interactions are saved in the browser's localStorage. Data remains local to the browser and is not synchronized between users or devices. Clearing site storage resets the app's saved state.

## Project structure

```
src/
  App.jsx       Main pages, state, interactions, and reusable UI
  main.jsx      React entry point and router
  index.css     Responsive editorial theme and component styling
index.html      HTML shell and font setup
vite.config.js  Vite configuration
```

## Design notes

InkSpace uses warm paper tones, restrained terracotta accents, serif headlines, generous spacing, image-led cards, and a responsive layout. The goal is to make reading feel calm while keeping writing and management actions easy to find.

## Notes

- Cover photos use remote Unsplash image URLs and require an internet connection.
- This is a frontend demo. There is no authentication or shared backend; the “My stories” page lists posts authored as **Aryan Verma**.
- For a multi-user production version, add authentication and a database-backed API.
