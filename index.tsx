
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  console.error(
    'La clé Clerk est manquante. Assure-toi de définir VITE_CLERK_PUBLISHABLE_KEY dans ton fichier .env.local.'
  );
}

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);