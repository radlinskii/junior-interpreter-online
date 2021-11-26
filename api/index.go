package handler

import (
  "fmt"
  "net/http"
)

func InterpreterHandler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "<h1>Interpret route!</h1>")
}
