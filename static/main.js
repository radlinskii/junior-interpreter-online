'use strict';

const e = React.createElement;

const LikeButton = () => {
    const [inputState, setInputState] = React.useState('const foo = 123;');
    const [outputState, setOutputState] = React.useState('123');

    const onChange = (e) => {
        setInputState(e.target.value);
    }

    const onClick = async () => {
        const reqBody = { 'input': inputState };

        var res = await fetch('/interpret', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        try {
            var json = await res.json();
        } catch (e) {
            console.error(e);
        }

        setOutputState(json);
    }

    const navbar = e('div', { id: 'navbar'}, 
        e('h1', {}, 'Monkey interpreter')
    );
    const input = e('textarea', { id: 'input', value: inputState, onChange }, null);
    const submit = e('input', { type: 'submit', onClick }, null);
    const inputContainer = e(
        'div',
        { id: 'inputContainer' },
        'INPUT', e('br'), input, e('br'), submit
    );

    const output = e('div', { id: 'output' }, outputState);
    const outputContainer = e(
        'div',
        { id: 'outputContainer' },
        'OUTPUT', e('br'), output
    );


    return e('div', { id: 'outerContainer' }, navbar, 
    e('div', {id: 'inoutContainer'}, inputContainer, outputContainer));
}


const domContainer = document.querySelector('#app');
ReactDOM.render(e(LikeButton), domContainer);
