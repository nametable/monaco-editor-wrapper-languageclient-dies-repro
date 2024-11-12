import React, { useState } from 'react';
import Editor from './editor';
import * as monaco from 'monaco-editor';


function App() {
    const [languageId, setLanguageId] = useState('javascript');

    const addQuickFix = () => {

        monaco.languages.register({ id: languageId, aliases: [languageId.toUpperCase()] })

        // https://stackoverflow.com/questions/57994101/show-quick-fix-for-an-error-in-monaco-editor
        monaco.languages.registerCodeActionProvider(languageId, {
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
                    actions: [action],
                    dispose: function (): void {
                        // throw new Error('Function not implemented.');
                    }
                };

                return codeActionList;
            }
        });
    }

    return (
        <div>
            <h1>monaco-editor-wrapper test</h1>
            <div>
                <h3>Global Controls</h3>
                <input value={languageId} onChange={e => setLanguageId(e.target.value)}></input>
                <button onClick={() => {
                    addQuickFix()
                }}>add a code action</button>
            </div>
            <div className="editors-container">
                <Editor initialFileUri="test.json"></Editor>
                <Editor initialFileUri="test.js"></Editor>
                <Editor initialFileUri="test.json"></Editor>
                <Editor initialFileUri="test.js"></Editor>
            </div>
        </div>
    );
}

export default App;