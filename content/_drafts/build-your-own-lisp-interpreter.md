---
title: Build Your Own Lisp Interpreter
categories:
  - [Javascript]
  - [Build Your Own]
---

I read Peter Norvig's [blog post](http://norvig.com/lispy.html) on creating a Lisp interpreter the other day, and it reminded how mind-blowing it was the first time I saw an interpreter implemented (in [SICP](https://mitpress.mit.edu/sicp/full-text/book/book.html)). This blog post walks through an interpreter I wrote in Javascript. I've modeled it after Norvig's implementation, however I've optimized optimized for accessibility, particularly for people without Lisp experience. Furthermore, I've added test specs so that someone can self-guide themselves through the creation of their own implementation. The specs and solution can be found in this [GitHub repository](https://github.com/nadrane/build-your-own-lisp-interpreter).

## A Basic Calculator

The first step is to create a program that can take formatted text strings as input, parse them, and then perform the mathematical operations they specify. Lisp uses a notation called prefix notation. Here are some examples:

| Lisp Syntax      | Value | Comment                                                                                                              |
| ---------------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `(+ 3 4)`        | 7     | As you can see, the operator comes before the operands                                                               |
| `(+ 3 4 100 2)`  | 109   | Prefix notation allows more than 2 operands!                                                                         |
| `(* (+ 3 4) -3)` | -21   | Operations can be nested arbitrarily and are evaluated inside out                                                    |
| `(* (+ 3 4) -3)` | -36   | Spacing is required after operators and between operands. Everywhere it can be used as little or as much as you like |

Parsing these expressions will involve two steps:

1.  Tokenization - Dividing up the languages parts into it's smallest pieces, called tokens
2.  Syntax analysis - Converting a sequence of tokens into a tree (called an Abstract Syntax Tree (or AST for short)) that is conducive for program execution

## Tokenization

The first thing we want to do is identify the tokens: that is, the smallest possible strings that have meaning within our language. Looking at the above Lisp expressions, we can see that numbers and operators obviously have meaning. More subtely, the `(` and `)` also have meaning because they influence the order of operations. The whitespace, however, means far less, at least when you consider an an alternative data structure for representing the program.

Instead of a large string (yes, that's all any program is), let's turn our program into an array of tokens. Here's how the the above programs would translate:

| Lisp Syntax      | Tokenized Version                             | Comments                                                    |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------- |
| `(+ 3 4)`        | `[ '(', '+', '3', '4', ')' ]`                 |
| `(+ 3 4 100 2)`  | `[ '(', '+', '3', '4', '100', '2', ')' ]`     | Notice that 100 is a single token, not three separate ones. |
| `(* (+ 3 4) -3)` | `[ '(', '*', '(', '+', '3', '4', ')', '-3' ]` | -3 is also a single token                                   |

It's important to recognize that absolutely no meaning was lost in this translation process. We could write a simple program to complete this conversion:

```js
function tokenize(program) {
  return (
    program
      // Ensure that every '(' and ')' is surrounded by whitespace. The consequence of this is that every token will be surrounded by whitespace
      .replace(/\)/g, " ) ")
      .replace(/\(/g, " ( ")
      // Transforms the string in an array split up spaces
      .split(" ")
      // Remove empty tokens. These might appear for example when we have a string like '2)'. The replace operations translate this string into '2 ) '. Since there is a trailing space, split(" ") will yield ['2', ')', ''].
      .filter(token => token !== "")
  );
}
```

This program is far simpler than it looks, and I honestly assembled through trial and error in the REPL.

## Syntax Analysis

The next step is to transform our array of tokens into a a data structure conducive for execution. Generally, compilers and interpreters will represent the code as an in-memory tree called an Abstract Syntax Tree (AST for short).

In essence, we want to take

`(* (+ 3 4) -3)`

turn it into

`[ '(', '*', '(', '+', '3', '4', ')', '-3' ]`

and turn that into
