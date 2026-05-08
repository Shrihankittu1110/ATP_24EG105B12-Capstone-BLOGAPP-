# Blog App

A full-stack blog application with a Node.js/Express backend and a React/Vite frontend.

## Structure

- [Backend](Backend) - Express API, MongoDB models, auth, uploads, and role-based routes
- [Frontend](Frontend) - React UI, routing, state management, and user flows

## Quick Start

1. Install dependencies in both apps:
   - `cd Backend && npm install`
   - `cd Frontend && npm install`
2. Create local environment files from the templates:
   - `Backend/.env` from `Backend/.env.example`
   - `Frontend/.env` from `Frontend/.env.example`
3. Start the apps:
   - Backend: `npm start`
   - Frontend: `npm run dev`

## Notes

- Keep `.env` files local and untracked.
- Use the `.env.example` files as templates for required variables.
- Sample API requests are stored in `Backend/Request-http/`.
