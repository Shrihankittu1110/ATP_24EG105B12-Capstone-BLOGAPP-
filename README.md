# BLOGAPP

Comprehensive blog platform with a Node.js/Express backend and a Vite + React frontend.

## Table of Contents
- Project Overview
- Repository Structure
- Backend
	- Setup & Run
	- APIs Overview
	- Configuration
	- Models
	- Middleware
- Frontend
	- Setup & Run
	- App Structure
	- Key Components
- Development
	- Environment Variables
	- Scripts
	- Testing
- Deployment
- Contributing
- License

## Project Overview

This repository implements a blogging platform with separate `Backend` and `Frontend` folders.
The backend provides RESTful APIs for admin, author, and user functionality. The frontend is a
React single-page application (SPA) built with Vite.

Goals:
- Simple CRUD for articles
- User authentication and role-based access
- Article recommendations and analytics
- Clean component-driven UI

## Repository Structure

- `Backend/` — Node.js (Express) API server
	- `server.js` — app entrypoint
	- `APIs/` — grouped route handlers
		- `AdminApi.js`, `AuthorApi.js`, `CommonApi.js`, `UserApi.js`
	- `config/` — provider and middleware configs
		- `cloudinary.js`, `cloudinaryUpload.js`, `multer.js`
	- `middleware/` — Express middleware
		- `VerifyToken.js`
	- `models/` — Mongoose models
		- `ArticleModel.js`, `RecommendationModel.js`, `UserModel.js`
	- `Request-http/` — example HTTP requests (workbench / REST client)

- `Frontend/` — Vite + React application
	- `index.html`, `vite.config.js`
	- `src/` — application source
		- `App.jsx`, `main.jsx`, `index.css`
		- `api/axios.js` — configured Axios instance
		- `Components/` — React components and pages
		- `Store/` — simple auth store (`authStore.js`)
		- `styles/` — theme and shared styles
		- `utils/markdown.js` — helpers for markdown rendering

## Backend

Tech: Node.js, Express, (MongoDB via Mongoose expected)

Key files:
- `server.js` — sets up Express, connects to DB, mounts routes from `APIs/`.
- `APIs/*.js` — each file groups endpoints by role or common functionality.

### Setup & Run (Backend)

Prerequisites: Node.js, npm, MongoDB connection string, Cloudinary account (optional)

Install and start:

```bash
cd Backend
npm install
npm run dev   # or `node server.js` for production
```

Environment variables (typical):
- `PORT` — server port (e.g., 5000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing tokens
- `CLOUDINARY_URL` or Cloudinary specific vars used in `config/cloudinary.js`

### APIs Overview

The API routes are grouped in `Backend/APIs/`:
- `AdminApi.js` — admin-only routes (user management, analytics)
- `AuthorApi.js` — author routes (create/edit/delete own articles)
- `CommonApi.js` — shared endpoints (fetch articles, recommendations)
- `UserApi.js` — user profile, authentication endpoints

Example endpoints (conventions):
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/articles` — list articles (pagination, filters)
- `GET /api/articles/:id` — fetch single article
- `POST /api/articles` — create (author)
- `PUT /api/articles/:id` — update (author)
- `DELETE /api/articles/:id` — delete (author/admin)

### Configuration

- `config/multer.js` — file upload configuration for images
- `config/cloudinary.js` & `cloudinaryUpload.js` — Cloudinary integration helpers

### Models

- `UserModel.js` — fields: name, email, passwordHash, role (user|author|admin), profile
- `ArticleModel.js` — fields: title, body, authorRef, tags, publishedAt, image, stats
- `RecommendationModel.js` — stores or computes recommended article links

### Middleware

- `middleware/VerifyToken.js` — verifies JWT and attaches user info to requests

## Frontend

Tech: React, Vite, Axios

### Setup & Run (Frontend)

```bash
cd Frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

### App Structure (src)

- `api/axios.js` — Axios instance with base URL and interceptors for auth
- `Components/` — main UI components and pages:
	- `Home.jsx` — landing and article list
	- `Articles.jsx` — listing and filters
	- `ArticleByID.jsx` — article detail view
	- `WriteArticles.jsx` / `EditArticle.jsx` — author writing UI
	- `Profile` components — `UserProfile.jsx`, `AuthorProfile.jsx`, `AdminProfile.jsx`
	- `Auth` components — `Login.jsx`, `Register.jsx`, `ProtectedRoute.jsx`
	- `Admin` components — `AdminUsers.jsx`, `AdminArticles.jsx`, `AdminAnalytics.jsx`
	- Shared UI — `Header.jsx`, `Footer.jsx`, `ModalShell.jsx`, `PasswordField.jsx`

### State & Utils

- `Store/authStore.js` — lightweight auth state (token, user)
- `utils/markdown.js` — converts markdown to HTML for article rendering

## Development

### Environment Variables

- Backend: set `MONGO_URI`, `JWT_SECRET`, `PORT`, Cloudinary keys
- Frontend: set `VITE_API_BASE_URL` if needed (Vite prefixes env vars with `VITE_`)

### npm Scripts (typical)

- Backend `package.json`:
	- `start` — run production server
	- `dev` — run with nodemon / development
- Frontend `package.json`:
	- `dev` — start Vite dev server
	- `build` — create production bundle
	- `preview` — preview production build

### Testing

No tests included by default. Recommended:
- Backend: Jest + Supertest for API tests
- Frontend: React Testing Library + Jest for components

## Deployment

General steps:
- Provision a MongoDB database (Atlas or self-hosted)
- Configure environment variables on host
- Deploy backend on Node-capable host (Heroku, Render, DigitalOcean, Azure App Service)
- Build frontend and serve static files (Netlify, Vercel, or serve from backend)

CI/CD tips:
- Run linting and tests on push
- Build frontend and store artifacts or publish to static host

## Contributing

1. Fork the repo and create a feature branch.
2. Open a pull request with a clear description.
3. Ensure coding style matches existing patterns.

## License

Specify your project license here (e.g., MIT). Replace this text with the license file or link.

## Contact

For questions or help, open an issue in this repository.

