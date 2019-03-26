'use strict';

const e = React.createElement;

const renderInput = (onChange, onClick, input) => {
    const submit = e('input', {
        id: 'submit', value: 'Try it out!', type: 'submit', onClick,
    }, null);
    const textarea = e('textarea', { id: 'input', value: input, onChange }, null);

    return e('div', { id: 'inputContainer' }, 'INPUT', e('br'), textarea, e('br'), submit);
};

const renderOutput = (isErrorFound, content) => {
    const output = e('div', { id: 'output', style: { color: isErrorFound ? 'red' : 'white' } }, content);

    return e('div', { id: 'outputContainer' }, 'OUTPUT', e('br'), output);
};

const InputOutput = () => {
    const [inputState, setInputState] = React.useState('const foo = 123;');
    const [outputState, setOutputState] = React.useState('123');
    const [isErrorFoundState, setIsErrorFoundState] = React.useState(false);

    const onChange = (event) => {
        setInputState(event.target.value);
    };

    const onClick = async () => {
        const reqBody = { input: inputState };

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

    return e('div', { id: 'inoutContainer' }, renderInput(onChange, onClick, inputState), renderOutput(isErrorFoundState, outputState));
};

const MainContainer = () => {
    const navbar = e('div', { id: 'navbar' },
        e('h1', {}, 'Monkey interpreter'));

    return e('div', { id: 'outerContainer' }, navbar, e(InputOutput, {}, null));
};

const domContainer = document.querySelector('#app');
ReactDOM.render(e(MainContainer), domContainer);
