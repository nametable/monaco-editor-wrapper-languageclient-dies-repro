import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { CodeEditor } from './editor.ts';
import { createRoot } from 'react-dom/client'

import * as monaco from 'monaco-editor';
import App from './app.tsx';
import { StrictMode } from 'react';

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
//   <div class="editors-container">
//     <div id="container" class="monaco-container"></div>
//     <div id="container2" class="monaco-container"></div>
//     <div id="container3" class="monaco-container"></div>
//     <div id="container4" class="monaco-container"></div>
//   </div>
// `

const rootElement = document.getElementById('react-root')!;
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// customElements.define('code-editor', CodeEditor);

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const container = document.getElementById("container");
// document.getElementsByTagName('div')

// if (!(container instanceof HTMLElement)) {
//   return;
// }

console.log(container)

let actionsExist = true;

if (container) {

  console.log("found container");

  const value = /* set from `myEditor.getModel()`: */ `function hello() {
alert('Hello world!');
}`;

  const myEditor = monaco.editor.create(container, {
    value,
    language: "javascript",
    automaticLayout: true,
  });

  myEditor.addAction({
    id: 'yo',
    label: 'something',
    run: function (editor: monaco.editor.ICodeEditor, ...args: any[]): void | Promise<void> {
      return
    }
  });

  // https://stackoverflow.com/questions/57994101/show-quick-fix-for-an-error-in-monaco-editor
  monaco.languages.registerCodeActionProvider("javascript", {
    provideCodeActions: function (model: monaco.editor.ITextModel, range: monaco.Range, context: monaco.languages.CodeActionContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CodeActionList> {

      const action: monaco.languages.CodeAction = {
        title: `Example quick fix`,
        diagnostics: undefined,
        kind: "quickfix",
        edit: {
          edits: [
            {
              resource: model.uri,
              textEdit: {
                range: range,
                text: "This text replaces the text with the error",
              },
              versionId: undefined,
            }
          ]
        }
      };

      const codeActionList: monaco.languages.CodeActionList = {
        actions: actionsExist ? [action] : [],
        dispose: function (): void {
          // throw new Error('Function not implemented.');
        }
      };

      return codeActionList;
    }
  });

  setTimeout(() => {
    actionsExist = false;
  }, 5000);

}