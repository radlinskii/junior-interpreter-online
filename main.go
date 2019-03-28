package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
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

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		panic("Failed to load variable $PORT from environment")
	}

	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/interpret", handleInterpret)

	http.ListenAndServe(":"+port, nil)
}

func handleInterpret(w http.ResponseWriter, r *http.Request) {
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

	json, err := json.Marshal(response)
	if err != nil {
		w.Write([]byte(err.Error()))
	}

	w.Write(json)
}
