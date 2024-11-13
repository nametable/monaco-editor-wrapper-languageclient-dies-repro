import * as monaco from 'monaco-editor';
import { CodePlusUri, ConnectionConfig, EditorAppConfigClassic, LanguageClientConfig, MonacoEditorLanguageClientWrapper, WorkerConfigDirect, WorkerConfigOptions } from 'monaco-editor-wrapper';
import { ConnetionConfigOptions } from 'monaco-languageclient';
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

function Editor({ initialFileUri, initialLanguageId }: { initialFileUri: string, initialLanguageId: string }) {
    const wrapper = useRef<MonacoEditorLanguageClientWrapper | undefined>(undefined);

    const [fileUri, setFileUri] = useState(initialFileUri)
    const [languageId, setLanguageId] = useState(initialLanguageId)

    const editorRoot = useRef<HTMLDivElement>(null);

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

                    console.log("Language Client State:", wrapper.current!.getLanguageClient(languageId)?.state);
                    console.log("Wrapper:", wrapper.current);
                }}>test</button>
                <button onClick={async () => {
                    if (wrapper.current) {
                        return;
                    }
                    wrapper.current = new MonacoEditorLanguageClientWrapper();


                    const code: CodePlusUri = {
                        text: defaultText.get(fileUri) ?? 'console.log("some default text....");',
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
                        htmlContainer: editorRoot.current!
                    };

                    // const worker = new Worker(new URL('./worker.ts', import.meta.url), {
                    //     type: 'module',
                    //     name: "Logan's LSP worker"
                    // })

                    // const workerConfigDirect: WorkerConfigDirect = {
                    //     $type: 'WorkerDirect',
                    //     worker: worker
                    // }

                    const connectionConfigOptions: ConnetionConfigOptions = {
                        $type: 'WorkerConfig',
                        type: 'module',
                        url: new URL('./worker.ts', import.meta.url),
                        workerName: "Logan LSP Worker",
                    }

                    const connectionConfig: ConnectionConfig = {
                        options: connectionConfigOptions
                    }

                    const languageClientConfig: LanguageClientConfig = {
                        // languageId: languageId,
                        // options: workerConfigOptions, // workerConfigDirect
                        clientOptions: {
                            documentSelector: [languageId],
                        },
                        connection: connectionConfig
                    }

                    let configs: Record<string, LanguageClientConfig> = {};
                    configs[languageId] = languageClientConfig;

                    await wrapper.current.init({
                        // id: languageId,
                        // wrapperConfig: {
                        //     serviceConfig: undefined,
                        //     editorAppConfig: editorAppConfigClassic
                        // },
                        editorAppConfig: editorAppConfigClassic,
                        languageClientConfigs: configs,
                    });

                    await wrapper.current.start();
                    console.log("Language Client State:", wrapper.current.getLanguageClient(languageId)?.state);

                }}>load</button>
                <button onClick={async () => {
                    await wrapper.current!.dispose(true) // somewhere in here the other wrapper gets broken....?
                    // wrapper.current!.getWorker()?.terminate();
                    wrapper.current = undefined;
                    // editor.current?.dispose(); // not the problem
                    // editor.current = undefined;
                    console.log("Killed monaco editor with uri:", fileUri)
                }}>kill</button>
            </div>
            <div ref={editorRoot} className="monaco-container"></div>
        </div>
    );

}

export default Editor;