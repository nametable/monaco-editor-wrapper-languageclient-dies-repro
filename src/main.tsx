import './style.css'
import { createRoot } from 'react-dom/client'

import App from './app.tsx';
import { StrictMode } from 'react';

const rootElement = document.getElementById('react-root')!;
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);