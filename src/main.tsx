import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';
import 'mac-scrollbar/dist/mac-scrollbar.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
