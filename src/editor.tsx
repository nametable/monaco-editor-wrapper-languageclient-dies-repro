import * as monaco from 'monaco-editor';
import { CodePlusUri, EditorAppConfigClassic, LanguageClientConfig, MonacoEditorLanguageClientWrapper, WorkerConfigDirect, WorkerConfigOptions } from 'monaco-editor-wrapper';
import { useCallback, useEffect, useRef, useState } from 'react';

const defaultText: Map<string, string> = new Map<string, string>([
    ['test.json', `{
    "hey": "how are you",
    "state": false,
    "a_number": 234
}
    `],
    ['test.js', `function hello() {
    alert('Hello world!');
}
`]
])

function Editor({ initialFileUri }: { initialFileUri: string }) {
    const wrapper = useRef<MonacoEditorLanguageClientWrapper | undefined>(undefined);

    const [fileUri, setFileUri] = useState(initialFileUri)
    const [languageId, setLanguageId] = useState("javascript")

    const editorRoot = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(undefined);

    const createEditor = useCallback(async () => {
        if (!editorRoot.current || !wrapper.current) {
            return;
        }



        // wrapper.current.getLanguageClient().

        // const myEditor = monaco.editor.create(editorRoot.current, {
        //     value,
        //     language: "javascript",
        //     automaticLayout: true,
        // });

        // myEditor.addAction({
        //     id: 'yo',
        //     label: 'something',
        //     run: function (editor: monaco.editor.ICodeEditor, ...args: any[]): void | Promise<void> {
        //         return
        //     }
        // });



        // setTimeout(() => {
        //     actionsExist = false;
        // }, 5000);

        editor.current = wrapper.current.getEditor(); //myEditor;

        // setIsEditorReady(true);
    }, []);

    // useEffect(() => {
    //     !isMonacoMounting && !isEditorReady && createEditor();
    // }, [isMonacoMounting, isEditorReady, createEditor]);

    return (
        <div>
            <div className="toolbar">
                <input value={languageId} onChange={e => setLanguageId(e.target.value)} style={{ "width": 80 }}></input>
                <input value={fileUri} onChange={e => setFileUri(e.target.value)} style={{ "width": 80 }}></input>
                <button onClick={() => {
                    const editor = wrapper.current!.getEditor()!;

                    // editorRoot.current!.focus();
                    editor.focus();
                    editor.setPosition({
                        lineNumber: 1,
                        column: 8
                    })

                    console.log("Language Client State:", wrapper.current!.getLanguageClient()?.state);
                    // console.log("Language client:", wrapper.current?.getLanguageClient().);
                }}>test</button>
                <button onClick={async () => {
                    if (wrapper.current) {
                        return;
                    }
                    wrapper.current = new MonacoEditorLanguageClientWrapper();

                    const actionsExist = true;


                    const code: CodePlusUri = {
                        text: defaultText.get(fileUri)!,
                        uri: fileUri,
                        // fileExt: 'langium',
                        enforceLanguageId: languageId
                    }

                    const editorAppConfigClassic: EditorAppConfigClassic = {
                        $type: 'classic',
                        codeResources: {
                            main: code,
                        },
                        editorOptions: {
                            glyphMargin: false,
                            // cursorStyle: 'block-outline'
                        },
                        languageDef: {
                            languageExtensionConfig: {
                                id: languageId,
                                extensions: [".js"],
                                aliases: ["Javascript", "javascript"]
                            }
                        },
                    };

                    // const worker = new Worker(new URL('./worker.ts', import.meta.url), {
                    //     type: 'module',
                    //     name: "Logan's LSP worker"
                    // })

                    // const workerConfigDirect: WorkerConfigDirect = {
                    //     $type: 'WorkerDirect',
                    //     worker: worker
                    // }

                    const workerConfigOptions: WorkerConfigOptions = {
                        $type: 'WorkerConfig',
                        type: 'module',
                        url: new URL('./worker.ts', import.meta.url),
                        workerName: "Logan LSP Worker",
                    }

                    const languageClientConfig: LanguageClientConfig = {
                        languageId: languageId,
                        options: workerConfigOptions, // workerConfigDirect
                        clientOptions: {
                            documentSelector: [languageId],
                        }
                    }

                    await wrapper.current.init({
                        id: languageId,
                        wrapperConfig: {
                            serviceConfig: undefined,
                            editorAppConfig: editorAppConfigClassic
                        },
                        languageClientConfig: languageClientConfig
                    });

                    await wrapper.current.start(editorRoot.current);
                    console.log("Language Client State:", wrapper.current.getLanguageClient()?.state);

                }}>load</button>
                <button onClick={async () => {
                    wrapper.current!.getWorker()?.terminate();
                    wrapper.current!.dispose()
                    wrapper.current = undefined;
                    editor.current?.dispose();
                    editor.current = undefined;
                }}>kill</button>
            </div>
            <div ref={editorRoot} className="monaco-container"></div>
        </div>
    );

}

export default Editor;