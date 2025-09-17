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
<img width="1536" height="803" alt="Image" src="https://github.com/user-attachments/assets/327f1937-cc78-4310-b52d-041f2591f52e" />

### Pre-interview Setup
<img width="1149" height="1076" alt="Image" src="https://github.com/user-attachments/assets/0a46b66e-0a58-40d6-a02d-e1e990c7fc53" />

### Live Interview
<img width="1300" height="1065" alt="Image" src="https://github.com/user-attachments/assets/fc9de09f-a1cf-482c-a548-f8969e467e97" />

### Performance Evaluation
<img width="1528" height="1075" alt="Image" src="https://github.com/user-attachments/assets/088b3e35-7846-4ed7-8ca2-5d2f587bb36a" />


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
