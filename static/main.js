'use strict';

const e = React.createElement;

const renderInput = (onClick) => {
    const submit = e('input', {
        id: 'submit', value: 'Try it out!', type: 'submit', onClick,
    }, null);
    const editor = e('div', { id: 'input' }, null);

    return e('div', { id: 'inputContainer' }, 'INPUT', e('br'), editor, e('br'), submit);
};

const renderOutput = (isErrorFound, content) => {
    const output = e('div', { id: 'output', style: { color: isErrorFound ? 'red' : 'white' } }, content);

    return e('div', { id: 'outputContainer' }, 'OUTPUT', e('br'), output);
};

const InputOutput = () => {
    const [outputState, setOutputState] = React.useState('123');
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

const MainContainer = () => {
    const navbar = e('div', { id: 'navbar' },
        e('h1', {}, 'Monkey interpreter'));

    return e('div', { id: 'outerContainer' }, navbar, e(InputOutput, {}, null));
};

const domContainer = document.querySelector('#app');
ReactDOM.render(e(MainContainer), domContainer);
