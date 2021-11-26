'use strict';

const e = React.createElement;

const renderInput = (onClick) => {
    const submit = e('input', {
        id: 'submit', value: 'Run', type: 'submit', onClick: onClick,
    }, null);
    const editor = e('div', {id: 'input'}, null);
    const inputUpperWrapper = e('div', {id: 'inputUpperWrapper'}, 'INPUT', submit);

    return e('div', {id: 'inputContainer'}, inputUpperWrapper, editor);
};

const renderOutput = (isErrorFound, content) => {
    const output = e('div', {id: 'output', style: {color: isErrorFound ? 'red' : 'white'}}, `${isErrorFound ? 'ERROR: ' : ''}${content}`);
    const outputUpperWrapper = e('div', {id: 'outputUpperWrapper'}, 'OUTPUT');

    return e('div', {id: 'outputContainer'}, outputUpperWrapper, output);
};

const InputOutput = () => {
    const [outputState, setOutputState] = React.useState('');
    const [isErrorFoundState, setIsErrorFoundState] = React.useState(false);

    const onClick = async () => {
        const reqBody = {input: window.editor.getValue()};

        const res = await fetch('/interpreter', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.status === 200) {
            try {
                const json = await res.json();

                setOutputState(json);
                setIsErrorFoundState(json.startsWith('ERROR'));
            } catch (err) {
                console.error(err);

                setOutputState(err);
                setIsErrorFoundState(true);
            }
        } else {
            try {
                const text = await res.text();

                setOutputState(text);
                setIsErrorFoundState(true);
            } catch (err) {
                console.error(err);

                setOutputState(err);
                setIsErrorFoundState(true);
            }
        }
    };

    return e('div', {id: 'inoutContainer'}, renderInput(onClick), renderOutput(isErrorFoundState, outputState));
};

const navbar = () => {
    const docsHeader = e('h1', {}, 'Documentation');
    const docsLink = e('a', {
        id: 'docsLink',
        href: 'https://github.com/radlinskii/junior-interpreter#junior-language-specification',
        target: '_blank',
        rel: 'nofollow noreferrer'
    }, docsHeader);

    const version = e('span', {id: 'version'}, 'v1.0.5');
    const title = e('h1', { id: 'title'}, 'Junior interpreter online ', version);

    return e('div', {id: 'navbar'}, title, docsLink);
};

const footer = () => {
    const githubImg = e('img', { id: 'githubLogo', alt: 'github repository link', src: './assets/github.png' }, null);
    const githubLink = e('a', {
        id: 'githubLink',
        href: 'https://github.com/radlinskii/junior-interpreter-online',
        target: '_blank',
        rel: 'nofollow noreferrer'
    }, githubImg);

    return e('div', { id: 'footer' }, githubLink);
};

const MainContainer = () => e('div', {id: 'outerContainer'}, navbar(), e(InputOutput, {}, null), footer());

const domContainer = document.querySelector('#app');
ReactDOM.render(e(MainContainer), domContainer);
