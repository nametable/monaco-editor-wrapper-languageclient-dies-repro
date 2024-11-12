import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { CodeEditor } from './editor.ts';
import { createRoot } from 'react-dom/client'

import * as monaco from 'monaco-editor';
import App from './app.tsx';
import { StrictMode } from 'react';

const rootElement = document.getElementById('react-root')!;
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);