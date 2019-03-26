'use strict';

// eslint-disable-next-line import/no-dynamic-require
require(['vs/editor/editor.main'], () => {
    monaco.languages.register({
        id: 'myCustomLanguage',
    });

    monaco.languages.setMonarchTokensProvider('myCustomLanguage', {
        tokenizer: {
            root: [
                [/const/, 'const-keyword'],
                [/\[notice.*/, 'custom-notice'],
                [/\[info.*/, 'custom-info'],
                [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
            ],
        },
    });

    monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs-dark',
        inherit: false,
        rules: [
            { token: 'const-keyword', foreground: 'ff32ff' },
            { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
            { token: 'custom-notice', foreground: 'FFA500' },
            { token: 'custom-date', foreground: '008800' },
        ],
    });

    window.editor = monaco.editor.create(document.getElementById('input'), {
        theme: 'myCoolTheme',
        value: 'const foo = 123;\n',
        language: 'myCustomLanguage',
        minimap: {
            enabled: false,
        },
    });
});
