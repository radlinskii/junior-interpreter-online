'use strict';

const e = React.createElement;

class InputOutput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputState: 'const foo = 123;',
            outputState: '123',
            outputColor: 'white'
        };
    }

    setOutputState(newOutput) {
        let color = 'white';
        if (newOutput.substring(0,5) === 'ERROR'){
            color = 'red';
        }
        this.setState({
            outputState: newOutput,
            outputColor: color
        })
    }

    setInputState(newInput) {
        this.setState({
            inputState: newInput
        })
    }

    render() {
        
        const onClick = async () => {
            const reqBody = { 'input': this.state.inputState };
    
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
    
            this.setOutputState(json);
        }
        
        const submit = e('input', { type: 'submit', onClick }, null);
        
        const onChange = (e) => {
            this.setInputState(e.target.value);
        }

        const input = e('textarea', { id: 'input', value: this.state.inputState, onChange }, null);

        const inputContainer = e(
            'div',
            { id: 'inputContainer' },
            'INPUT', e('br'), input, e('br'), submit
        );

        const output = e('div', {id: 'output', style: {color: this.state.outputColor} }, this.state.outputState);

        const outputContainer = e(
            'div',
            { id: 'outputContainer' },
            'OUTPUT', e('br'), output
        );

        return e('div', {id: 'inoutContainer'}, inputContainer, outputContainer);
    }
}

const MainContainer = () => {


    const navbar = e('div', { id: 'navbar'}, 
        e('h1', {}, 'Monkey interpreter')
    );

    return e('div', { id: 'outerContainer' }, navbar, 
    e(InputOutput, {}, null));
}

const domContainer = document.querySelector('#app');
ReactDOM.render(e(MainContainer), domContainer);
