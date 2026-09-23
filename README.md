# PetHub Frontend

React frontend for PetHub — a pet-care e-commerce app where users can browse pet products,
manage a cart, place orders, and view order history. Consumes a separate Spring Boot REST
API (backend repo: [link to your PetHub repo]).

**Status: not yet started.** This repo currently holds the initial Vite + React scaffold only.

## Why a separate repo
This frontend is intentionally kept in its own repository rather than alongside the backend
(see the backend's `rebuild` branch) — they're independent applications with separate build
tooling and deployment targets (this deploys to Vercel/Netlify, the backend to
Render/Railway), so keeping them decoupled avoids mixing two unrelated toolchains in one
place.

## Tech Stack
- React (Vite)
- React Router
- Axios
- Context API (auth state / JWT handling)

## Planned Pages
- Login / Register
- Product listing (with category filtering)
- Product detail
- Cart
- Checkout
- Order history

## Backend
This app expects the PetHub Spring Boot API running locally (or deployed) and configured
via an environment variable for the API base URL. See the backend repo for setup
instructions and available endpoints.

## Setup
1. `npm install`
2. `npm run dev`
3. Configure the API base URL (see `.env.example` once added)