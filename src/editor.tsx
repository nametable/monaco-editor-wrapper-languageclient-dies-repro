import * as monaco from 'monaco-editor';
import { useCallback, useEffect, useRef, useState } from 'react';

function Editor() {

    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isMonacoMounting, setIsMonacoMounting] = useState(true);

    // useMount(() => {
    //     // const cancelable = loader.init();

    //     // cancelable
    //     //     .then((monaco) => (monacoRef.current = monaco) && setIsMonacoMounting(false))
    //     //     .catch(
    //     //         (error) =>
    //     //             error?.type !== 'cancelation' && console.error('Monaco initialization: error:', error),
    //     //     );

    //     // return () => (editorRef.current ? disposeEditor() : cancelable.cancel());

    //     // setIsMonacoMounting(false);

    //     // return (() => { })
    // });

    useEffect(() => {
        setIsMonacoMounting(false);
    }, [])

    const editorRoot = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>(null);

    const createEditor = useCallback(() => {
        if (!editorRoot.current) {
            return;
        }

        const actionsExist = true;

        const value = `function hello() {
    alert('Hello world!');
}`;

        const myEditor = monaco.editor.create(editorRoot.current, {
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

        // setTimeout(() => {
        //     actionsExist = false;
        // }, 5000);

        editor.current = myEditor;

        setIsEditorReady(true);
    }, []);

    useEffect(() => {
        !isMonacoMounting && !isEditorReady && createEditor();
    }, [isMonacoMounting, isEditorReady, createEditor]);

    return (
        <div>
            <div className="buttons-container">
                <button onClick={() => {
                    console.log("test2");
                    // editorRoot.current!.focus();
                    editor.current!.focus();
                    editor.current!.setPosition({
                        lineNumber: 2,
                        column: 8
                    })
                }}>test</button>
                <button>test</button>
            </div>
            <div ref={editorRoot} className="monaco-container"></div>
        </div>
    );

}

export default Editor;


function useMount(arg0: () => void) {
    throw new Error('Function not implemented.');
}
/*
export class CodeEditor extends LitElement {
    public monacoroot: HTMLElement;

    constructor() {
        super();

        this.monacoroot = document.createElement("div");
        this.monacoroot.classList.add("monaco-container");
        this.monacoroot.id = "container"
    }

    static get styles() {
        return [css`
            .monaco-container {
                display: grid;
                height: 100%;
                width: 400px;
                flex: 1;
                position: relative !important;
                height:500px;
                width:500px;
            }
        `];
    }

    render() {
        return html`
            <!-- <button @click="${() => { console.log("clicked!"); this.initMonaco(); }}">Start</button> -->
            <!-- <div id="container" class="monaco-container" style="background-color: orange; "></div> -->
        `;
    }

    updated() {
        this.initMonaco()
    }

    private initMonaco() {
        // const container = this.renderRoot.querySelector("#container"); //document.getElementById("container");
        const container = this.monacoroot;

        console.log(container)

        let actionsExist = true;

        if (container) {

            console.log("found container");

            const value = `function hello() {
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

            // setTimeout(() => {
            //     actionsExist = false;
            // }, 5000);

        }

    }
}

*/