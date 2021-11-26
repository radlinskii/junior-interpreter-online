package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/radlinskii/interpreter/evaluator"
	"github.com/radlinskii/interpreter/lexer"
	"github.com/radlinskii/interpreter/object"
	"github.com/radlinskii/interpreter/parser"
)

// RequestObject  that will be send to server.
type RequestObject struct {
	Val string `json:"input"`
}

func InterpreterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.NotFoundHandler()
		return
	}
	w.Header().Set("Content-Type", "application/json")

	var reqObject RequestObject

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&reqObject)
	if err != nil {
		fmt.Println(err)
	}

	input := string(reqObject.Val)
	l := lexer.New(input)
	p := parser.New(l)
	program := p.ParseProgram()

	var response string

	if len(p.Errors()) != 0 {
		for _, msg := range p.Errors() {
			if strings.HasPrefix(msg, "FATAL") {
				response += msg + "\n"
				break
			}
			response += "ERROR: " + msg + "\n"
		}
	} else {
		env := object.NewEnvironment()
		response = evaluator.EvalProgram(program, env)
	}

	if res, err := json.Marshal(response); err != nil {
		_, err = w.Write([]byte(err.Error()))
	} else {
		_, err = w.Write(res)
	}

	if err != nil {
		log.Printf("Write failed: %v", err)
	}
}
