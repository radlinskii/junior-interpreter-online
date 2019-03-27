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
                [/if/, 'if-keyword'],
                [/else/, 'else-keyword'],
                [/return/, 'return-keyword'],
                [/fun/, 'fun-keyword'],
                [/[0-9]+/, 'integer'],
                [/".*"/, 'string'],

                { include: '@whitespace' },
                { include: '@bool' },
            ],

            bool: [
                [/true/, 'boolean'],
                [/false/, 'boolean']
            ],

            comment: [
                [/[^/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],
                ['\\*/', 'comment', '@pop'],
                [/[/*]/, 'comment'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    });

    monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'const-keyword', foreground: '35D23F' },
            { token: 'if-keyword', foreground: '3584B2' },
            { token: 'else-keyword', foreground: '3584B2' },
            { token: 'return-keyword', foreground: '3584B2' },
            { token: 'fun-keyword', foreground: '3584B2' },
            { token: 'integer', foreground: 'FFCE91' },
            { token: 'boolean', foreground: '35D23F' },
            { token: 'comment', foreground: '999999', fontStyle: 'italic' },
        ],
    });

    const placeholder = `const chooseBigger = fun(x,y) {
    if (x > y) {
        return x;
    }

    return y;
};

const max = fun(arr) {
    const findMax = fun(arr, max) {
        if (len(arr) == 0) {
            return max;
        }
        return findMax(rest(arr), chooseBigger(first(arr), max));
    };
    return findMax(arr, -99999999);
};

max([1,2,43,5,21,123]); // Try it out!
`;

    window.editor = monaco.editor.create(document.getElementById('input'), {
        theme: 'myCoolTheme',
        value: placeholder,
        language: 'myCustomLanguage',
        minimap: {
            enabled: false,
        },
        fontSize: 14,
        fontFamily: 'Fira Code',
        scrollBeyondLastLine: false,
    });
});
