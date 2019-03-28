'use strict';

const e = React.createElement;

const renderInput = (onClick) => {
    const submit = e('input', {
        id: 'submit', value: 'Run', type: 'submit', onClick: onClick,
    }, null);
    const editor = e('div', { id: 'input' }, null);
    const inputUpperWrapper = e('div', {id: 'inputUpperWrapper'}, 'INPUT', submit);

    return e('div', { id: 'inputContainer' }, inputUpperWrapper, editor);
};

const renderOutput = (isErrorFound, content) => {
    const output = e('div', { id: 'output', style: { color: isErrorFound ? 'red' : 'white' } }, content);
    const outputUpperWrapper = e('div', {id: 'outputUpperWrapper'}, 'OUTPUT');

    return e('div', { id: 'outputContainer' }, outputUpperWrapper, output);
};

const InputOutput = () => {
    const [outputState, setOutputState] = React.useState('');
    const [isErrorFoundState, setIsErrorFoundState] = React.useState(false);

    const onClick = async () => {
        const reqBody = { input: window.editor.getValue() };

        const res = await fetch('/interpret', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        try {
            const json = await res.json();

            setOutputState(json);
            setIsErrorFoundState(json.startsWith('ERROR'));
        } catch (err) {
            console.error(err);

            setOutputState(err);
            setIsErrorFoundState(true);
        }
    };

    return e('div', { id: 'inoutContainer' }, renderInput(onClick), renderOutput(isErrorFoundState, outputState));
};

const navbar = () => {
    const githubImg = e('img', { id: 'githubLogo', alt: 'github repository link', src: 'assets/github.png'}, null);
    const githubLink = e('a', { href: 'https://github.com/radlinskii/interpreter' }, githubImg);
    const docsLink = e('a', { id: 'docsLink', href: 'documentation.html' }, 'Docs');

    const version = e('span', { id: 'version' }, 'v1.0.1');
    const title =  e('h1', {}, 'Junior interpreter online ', version);

    return e('div', { id: 'navbar' }, title, docsLink, githubLink);
};

const MainContainer = () => {

    return e('div', { id: 'outerContainer' }, navbar(), e(InputOutput, {}, null));
};

const domContainer = document.querySelector('#app');
ReactDOM.render(e(MainContainer), domContainer);
