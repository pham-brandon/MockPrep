# MockPrep

A web app for practicing interviews with AI assistance. Built to help developers prepare for real-world interviews in a low-pressure environment.

## What's Inside

- AI-powered mock interviews with realistic questions
- Practice with common interview problems
- Have your answers evaluated by AI
- Works on all devices
- Secure login with Clerk

## Built With

- Frontend: React 18, TypeScript, Vite
- Styling: Shadcn UI, Tailwind CSS
- State: React Query
- Auth: Clerk
- Backend: Firebase (Firestore, Storage, Functions)
- Hosting: Firebase

## Getting Started

### What You'll Need

- Node.js (v18+)
- pnpm (or npm)
- Firebase CLI (for deploying)
- A Firebase project with Firestore and Storage set up

### Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/pham-brandon/MockPrep.git
   cd MockPrep
   ```

2. Install packages:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up your `.env` file with these variables:
   ```
   VITE_FIREBASE_API_KEY=your_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

## Running Locally

Start the dev server:
```bash
pnpm dev
# or
npm run dev
```
Then open http://localhost:5173 in your browser.

## Building for Production

```bash
pnpm build
# or
npm run build
```

## Deploying

1. Build the app:
   ```bash
   pnpm build
   ```

2. Deploy to Firebase:
   ```bash
   firebase login
   firebase deploy --only hosting
   ```

## Project Structure

```
src/
├── components/  # Reusable UI bits
├── config/     # App config
├── handlers/   # API stuff
├── hooks/      # Custom hooks
├── layouts/    # Page layouts
├── lib/        # Helper functions
├── routes/     # Page components
├── types/      # TypeScript types
└── App.tsx     # Main app file
```