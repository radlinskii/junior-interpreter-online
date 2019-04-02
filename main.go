package main

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

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

	http.Handle("/", UseGzip(UseCache(http.FileServer(http.Dir("./static")))))
	http.Handle("/interpret", http.TimeoutHandler(http.HandlerFunc(handleInterpret), 3*time.Second, "ERROR: Evaluation timeout"))

	fmt.Println(http.ListenAndServe(":"+port, nil))
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

	if res, err := json.Marshal(response); err != nil {
		_, err = w.Write([]byte(err.Error()))
	} else {
		_, err = w.Write(res)
	}

	if err != nil {
		log.Printf("Write failed: %v", err)
	}

}



// UseGZip uses middleware for compressing response using gzip algorithm.
func UseCache(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Cache-Control", "max-age=31536000")
		h.ServeHTTP(w, r)
	})
}

// UseGZip uses middleware for compressing response using gzip algorithm.
func UseGzip(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		encodings := r.Header.Get("Accept-Encoding")
		if !strings.Contains(encodings, "gzip") {
			h.ServeHTTP(w, r)
			return
		}
		w.Header().Add("Content-Encoding", "gzip")
		gw := gzip.NewWriter(w)
		defer gw.Close()
		grw := gzipResponseWriter{
			ResponseWriter: w,
			Writer:         gw,
		}
		h.ServeHTTP(&grw, r)
	})
}

type gzipResponseWriter struct {
	http.ResponseWriter
	io.Writer
	status int
}

func (grw *gzipResponseWriter) WriteHeader(statusCode int) {
	grw.status = statusCode
	grw.ResponseWriter.WriteHeader(statusCode)
}

func (grw *gzipResponseWriter) Write(data []byte) (int, error) {
	return grw.Writer.Write(data)
}
