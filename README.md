# Stripe Module

This is a NestJS module that provides a simple and easy-to-use integration with Stripe for processing payments.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- A Stripe account with a valid secret key

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/stripe-module.git
```
2. Navigate to the server directory:
```bash
cd stripe-module
```
3. Install the dependencies:
```bash
npm install
```
4. Set the Stripe secret key in your environment variables or create a .env file in the root of the project with the following content:
```bash
STRIPE_SECRET_KEY=your_stripe_secret_key
```
5.Start the development server:
```bash
npm run start:dev
```
This will start the NestJS server on http://localhost:8000

## Client Application
There is also a client application that demonstrates the usage of the Stripe Integration Module. To run the client, follow these steps:

1. Navigate to the client directory:
```bash
cd client
```
2. Install the dependencies:
```bash
npm install
```
3. Set the Stripe API key in your environment variables or create a .env file in the root of the project with the following content:
```bash
VITE_STRIPE_API_KEY=your_key
VITE_BACKEND_BASE_URL=http://localhost:8000
```
This will start the client application on http://localhost:5173.

### Features
1. Integrates with Stripe for payment processing
2. Provides a simple and easy-to-use API for creating payment intents
3. Stores payment events in an in-memory database for easy access



   






