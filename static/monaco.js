'use strict';

// eslint-disable-next-line import/no-dynamic-require
require(['vs/editor/editor.main'], () => {
    monaco.languages.register({
        id: 'myCustomLanguage',
    });

    monaco.languages.setMonarchTokensProvider('myCustomLanguage', {
        defaultToken: 'invalid',
        tokenizer: {
            root: [
                [/(const[\s]+)([a-zA-Z]+)/, ['keyword', 'declaration']],
                [/(const|fun|return|if|else)/, 'keyword'],
                [/(print|len|rest|first|push|last)/, 'builtin'],
                [/[0-9]+/, 'integer'],
                [/".*"/, 'string'],
                [/([!*()\-+=\[\];"{},><]|([^\/]\/[^\/]))/, 'symbol'],
                [/([a-zA-Z]+\s*)(\()/, ['call', 'symbol']],

                { include: '@whitespace' },
                { include: '@bool' },
                { include: '@identifier' },
            ],

            bool: [
                [/true/, 'boolean'],
                [/false/, 'boolean'],
            ],

            identifier: [
                [/[a-zA-Z]+/, 'identifier'],
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
            { token: 'declaration', foreground: 'b080f0' },
            { token: 'symbol', foreground: 'eeeeee' },
            { token: 'call', foreground: '909dd8' },

            { token: 'invalid', foreground: 'ff0000' },
            { token: 'identifier', foreground: '3baaaa' },
            { token: 'keyword', foreground: '3584B2' },
            { token: 'builtin', foreground: '35d4fc', fontStyle: 'italic' },
            { token: 'integer', foreground: 'FFCE91' },
            { token: 'boolean', foreground: '35D23F' },
            { token: 'string', foreground: '34ff8d' },
            { token: 'comment', foreground: '999999', fontStyle: 'italic' },
        ],
    });

    const placeholder = `const chooseBigger = fun(x,y) {
    if (x > y) {
        print(x, ">", y);
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
        automaticLayout: true,
    });
});
