# Backend

Express + MongoDB backend for the Blog App.

## Main Folders

- `APIs/` - Route handlers for common, user, author, and admin flows
- `config/` - Cloudinary and upload configuration
- `middleware/` - Auth and token verification middleware
- `models/` - Mongoose models
- `Request-http/` - Sample HTTP requests for testing endpoints

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example`
3. Update `.env` with your local values
4. Start the server:
   ```bash
   npm start
   ```

## Environment

The backend expects values such as:
- `PORT`
- `DB_URL`
- `SECRET_KEY`
- `FRONTEND_URL`
- `ADMIN_REGISTRATION_KEY`
