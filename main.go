package main

import (
	"fmt"
	"net/http"

	"github.com/radlinskii/interpreter/evaluator"
	"github.com/radlinskii/interpreter/lexer"
	"github.com/radlinskii/interpreter/object"
	"github.com/radlinskii/interpreter/parser"
)

func main() {

	http.HandleFunc("/interpret", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.NotFoundHandler()
			return
		}

		r.ParseForm()

		data := r.FormValue("monkey-code")

		input := string(data)
		l := lexer.New(input)
		p := parser.New(l)
		program := p.ParseProgram()

		if len(p.Errors()) != 0 {
			for _, msg := range p.Errors() {
				fmt.Println("ERROR: " + msg + "\n")
			}
		}

		env := object.NewEnvironment()
		evaluated := evaluator.Eval(program, env)
		if evaluated != nil {
			fmt.Println(evaluated.Inspect())
		}

		w.Write([]byte("hello world"))
	})

	http.ListenAndServe(":8080", nil)
}
