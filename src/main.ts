import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import * as monaco from 'monaco-editor';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
  <div id="container" height=50 width=50 style="background-color: orange; height:500px; width:500px;"></div>
`



setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const container = document.getElementById("container");
// document.getElementsByTagName('div')

// if (!(container instanceof HTMLElement)) {
//   return;
// }

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
          throw new Error('Function not implemented.');
        }
      };

      return codeActionList;
    }
  });

  setTimeout(() => {
    actionsExist = false;
  }, 5000);

}
