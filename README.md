# TrapCard

A Next.js application for creating, voting on, and tokenizing trap cards using Phantom wallet authentication.

## Features

- **Phantom Wallet Authentication**: Connect with your Phantom wallet to access the platform
- **Create Trap Cards**: Design your own custom trap cards (coming soon)
- **Vote on Cards**: Browse and vote on community-created cards (coming soon)
- **Tokenization**: The most popular cards get tokenized on the blockchain (coming soon)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Authentication**: JWT with Phantom wallet signatures
- **Database**: MongoDB
- **Blockchain**: Solana (for wallet authentication)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Phantom wallet browser extension

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: React components
- `/src/context`: React context providers
- `/src/lib`: Utility functions and libraries
- `/src/models`: MongoDB models
- `/src/app/api`: API routes

## Authentication Flow

1. User clicks "Connect Wallet" button
2. Backend generates a nonce and stores it with the user's wallet address
3. User signs the nonce message with their Phantom wallet
4. Backend verifies the signature and issues a JWT token
5. Frontend stores the JWT token in localStorage for subsequent authenticated requests

## API Routes

- `GET /api/auth/nonce`: Get a nonce for wallet signature
- `POST /api/auth/login`: Authenticate with a signed message
- Protected routes (coming soon): `/api/protected/*`

## License

This project is licensed under the MIT License.
