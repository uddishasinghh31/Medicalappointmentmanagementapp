import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/globals.css';
import App from '../App';
import { Toaster } from '../components/ui/sonner';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <Toaster richColors position="top-right" />
  </React.StrictMode>
);