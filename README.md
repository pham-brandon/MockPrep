# MockPrep
https://mockprep-app.web.app/

MockPrep is a web application designed to help users prepare for job interviews through practice mock interviews sessions. Built with React, TypeScript, and Firebase.

## Features

- **Mock Interviews**: Experience realistic interview scenarios with an AI interviewer
- **Flexible Response Input**: Respond using speech-to-text or type your answers
- **Comprehensive Feedback**: Receive detailed analysis of your interview performance and areas for improvement
- **Focused Practice**: Targeted questions to help you improve specific interview skills
- **Modern Interface**: Clean, intuitive design that works across all devices

## Screenshots
### Homepage
<img width="1701" height="905" alt="Image" src="https://github.com/user-attachments/assets/3fa0a9c1-1fad-4e10-b4ca-f007382a92a3" />

### Practice Dashboard
<img width="1343" height="833" alt="Image" src="https://github.com/user-attachments/assets/41fdd6ee-f673-4516-9fe0-8e4ec809e3f1" />

### Create Interview
<img width="1815" height="1014" alt="Image" src="https://github.com/user-attachments/assets/be4a6205-d0a7-4f60-9948-b812f7911983" />

### Pre-interview Setup
<img width="1270" height="1080" alt="Image" src="https://github.com/user-attachments/assets/d57aa1ba-302d-4f6c-90b5-765e2292e24e" />

### Live Interview
<img width="1331" height="1060" alt="Image" src="https://github.com/user-attachments/assets/ce2ea442-1044-42d7-b3c9-948b696486d7" />

### Performance Evaluation
<img width="1542" height="928" alt="Image" src="https://github.com/user-attachments/assets/470c0a7e-3925-4d79-8ec1-91d27c12f047" />


## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom animations
- **Authentication**: Clerk
- **Backend**: Firebase (Firestore, Storage, Hosting)
- **AI**: Google Generative AI
- **State Management**: React Hook Form, Zod
- **UI Components**: Radix UI, Lucide Icons, Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm
- Firebase CLI (if deploying)
- Clerk account for authentication
- Google AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mockprep.git
   cd mockprep
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
├── config/          # Application configuration
├── handlers/        # Custom event handlers
├── layouts/         # Page layouts
├── lib/             # Utility functions
├── provider/        # Context providers
├── routes/          # Application routes
├── scripts/         # Build and utility scripts
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build locally
- `pnpm lint` - Run ESLint for code quality checks

## Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase login
   firebase init
   firebase deploy
   ```
