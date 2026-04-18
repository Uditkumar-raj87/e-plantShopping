# Paradise Nursery Shopping Application

Paradise Nursery is a premium React + Redux shopping platform for an online plant shop with authentication, checkout, and order tracking.

## Features

- Landing page with company branding and a Get Started button.
- Product listing with multiple categories of houseplants.
- Add to Cart functionality with dynamic cart count in the navbar.
- Shopping cart page with quantity controls and item removal.
- Auth system with Register/Login and protected checkout routes.
- Checkout flow with shipping form, payment method selection, and order confirmation.
- Backend API for authentication, payment intent creation, and persistent order history.
- 3D animated background for premium visual experience.

## Tech Stack

- React
- Redux Toolkit
- React Router
- Vite
- Express
- JWT Auth
- Stripe PaymentIntent API (optional key)
- React Three Fiber / Drei / Three.js

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start frontend and backend together:

```bash
npm run dev:full
```

4. Frontend: `http://localhost:5173` (or next available port)

5. Backend API: `http://localhost:4000`

## Auth + Orders

- Register/Login from `/auth`
- Protected pages:
	- `/checkout`
	- `/orders`

## Payment Notes

- Card payments call `/api/payment/create-intent`.
- If `STRIPE_SECRET_KEY` is set, a real Stripe PaymentIntent is created.
- Without Stripe key, card payment uses a safe mock response for local development.

## Build Frontend

```bash
npm run build
```

## Start Backend Only

```bash
npm run start:api
```