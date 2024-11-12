import { BrowserMessageReader, BrowserMessageWriter, CodeAction, createConnection, InitializeResult, ProtocolRequestType0 } from 'vscode-languageserver/browser.js';

const something: string = "hey"

console.log("hey, I'm a worker!", something)

declare const self: DedicatedWorkerGlobalScope;

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

let counter = 0;

messageReader.listen((message) => {
    console.log("message:", message)
})

connection.onCodeAction((params) => {

    counter++;
    if (counter > 10) {
        counter = 0;
    }

    const uri = params.textDocument.uri;
    const range = params.range;

    const action: CodeAction = {
        title: `Example quick fix ${counter}`,
        diagnostics: undefined,
        kind: "quickfix",
        edit: {
            changes:
            {

            }
        }
    };

    // if (counter > 5) {
    //     return [];
    // }

    if (action && action.edit && action.edit.changes) {

        action.edit.changes[uri] = [{
            range: range,
            newText: "This text replaces the text with the error",
        }];

        console.info("Code Action", params);
        return [action];
    }

    return [];

})

connection.onInitialize(params => {
    console.log("onInitialize params:", params);

    const initializeResult: InitializeResult = {
        capabilities: {
            codeActionProvider: true
        }
    }
    return initializeResult;
});
// connection.onInitialized(params => {
//     services.lsp.LanguageServer.initialized(params);
// });

connection.onShutdown(() => {
    console.info("Shutdown request received!");
})

connection.listen();

console.info("created a connection!")