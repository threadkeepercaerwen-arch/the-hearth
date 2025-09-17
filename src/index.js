import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // <-- Changed to App
import { HearthProvider } from './hearth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HearthProvider>
      <App />
    </HearthProvider>
  </React.StrictMode>
);
