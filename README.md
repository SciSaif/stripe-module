# Stripe Module

This is a NestJS module that provides a simple and easy-to-use integration with Stripe or Paypal for processing payments.

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
STRIPE_SECRET_KEY=sk_test_51Kx6IaSH2pwWq5CIXubtAeod5wA3M9aprS7E1tbyayAozKJdyJDW0tcfwk2UZYN2rAOJwjfiCvlpRzInl8CH5ahM00nOlPhiQt
PAYPAL_CLIENT_ID=AbhtqL5rPnpIv1CZmmWE6_DNQ0AW8c_hO7OSxV2LTICX7wB3UHthHEgSYOlj7xjE7cqIwZbbi-kwehep
PAYPAL_CLIENT_SECRET=EAM7d2lUPKtIZldwlPEvDvS1D7Jzptj_hAa6JwjMigVAXLu1gPHilPZk88zaXDqt-4htxSHti6KoYifH
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
VITE_STRIPE_API_KEY=pk_test_51Kx6IaSH2pwWq5CIF167qhnxysBecpjrZsiauu0AsmRBlS3Ly8xPf5ayczN2qI9Br6fvBZWtFe97qt1afEgLIM9b00rE42YiKy
VITE_BACKEND_BASE_URL=http://localhost:8000
```
4. Run the development server:
```bash
npm run dev
```
This will start the client application on http://localhost:5173.

### Features
1. Integrates with Stripe for payment processing
2. Provides a simple and easy-to-use API for creating payment intents
3. Stores payment events in an in-memory database for easy access



   






