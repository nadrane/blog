---
title: Build a Regex Engine in Less than 40 Lines of Code
date: 2017-11-28 11:36:04
categories:
  - [Regular Expressions]
  - [Javascript]
  - [Recursion]
---

I stumbled upon an [article](https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html) the other day where Rob Pike implements a rudimentary regular expression engine in c. I converted his code to Javascript and added test specs so that someone can self-guide themselves through the creation of the regex engine. The specs and solution can be found in this [GitHub repository](https://github.com/nadrane/build-your-own-regex). This blog post walks through my solution.

## The Problem

Our regex engine will support the following syntax:

| Syntax | Meaning | Example | matches |
|--------|---------|---------|---------|
| a | Matches the specified character literal | q | q |
| * | Matches 0 or more of the previous character | a* | "", a, aa, aaa  |
| ? | Matches 0 or 1 of the previous character | a? | "", a |
| . | Matches any character literal | . | a, b, c, d, e ... |
| ^ | Matches the start of a string | ^c | c, ca, caa, cbb ... |
| $ | Matches the end of a string | a$ | ba, baaa, qwerta ... |

The goal is to provide a syntax robust enough to match a large portion of regex use cases with minimal code.

## Matching One Character

The first step is to write a function that takes in a one character pattern and a one character text string and returns a boolean indicating if they match. A pattern of `.` is considered a wildcard and matches against any character literal.

Here are some examples

`matchOne('a', 'a')` -> `true`
`matchOne('.', 'z')` -> `true`
`matchOne('', 'h')`  -> `true`
`matchOne('a', 'b')` -> `false`
`matchOne('p', '')`  -> `false`


```js
function matchOne(pattern, text) {
  if (!pattern) return true // Any text matches an empty pattern
  if (!text) return false   // If the pattern is defined but the text is empty, there cannot be a match
  if (pattern === ".") return true // Any inputted text matches the wildcard
  return pattern === text
}
```

## Matching Same Length Strings

Now we want to add support for patterns and text strings of greater length. For now, let's only consider a pattern/text pair of the same length. I happen to know that the solution lends itself very naturally to recursion, so we will use it here. We are going to want to repeatedly invoke `matchOne` on successive pairs of characters from the pattern/text combination.

```js
function match(pattern, text) {
  if (pattern === "") return true  // Our base case - if the pattern is empty, any inputted text is a match
  else return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1))
}
```

The above code advances character by character across the the pattern/text pair. It first compares `pattern[0]` to `text[0]` and then `pattern[1]` to `text[1]` and continues comparing `pattern[i]` to `text[i]` until `i === pattern.length - 1`. If they ever don't match, then we know that the pattern cannot match the text.

Let's take an example. Suppose we invoke `match('a.c', 'abc')`, which returns `matchOne('a', 'a') && match('.c', 'bc')`.

If we continue evaluating these functions, we get `matchOne('a', 'a') && matchOne('.', 'b') && matchOne('c', 'c') && match("", "")`, which is just equal to `true && true && true && true`, So we have a match!

## The $ Character

Let's add support for the special pattern character `$` that allows us to match the end of a string. The solution simply requires adding an additional base case to the match function.

```js
function match(pattern, text) {
  if (pattern === "") return true
  if (pattern === "$" && text === "") return true
  else return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1))
}
```

## The ^ Character

Let's add support for the special pattern character `^` that allows us to match the beginning of a string. I'm going to introduce a new function called `search`.

```js
function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text)
  }
}
```

This function will be the new entry point to our code. Up till this point, we were only matching patterns that began at the beginning of the text. We are simply making that more clear now by forcing the user to preface the pattern with a `^`. But how do we support patterns that appear anywhere within the text?

## Matches Starting Anywhere

Currently, the following return `true`

`search("^abc", "abc")`
`search("^abcd", "abcd")`

But `search("bc", "abcd")` will just return `undefined`. We want it to return `true`

If the user does not specify that the pattern matches the beginning of the text, then we want to search for that pattern at every possible starting point within the text. We will default to this behavior if the pattern does not begin with `^`<sup>[1](#footnote1)</sup>.

```js
function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text)
  } else {
    // This code will run match(pattern, text.slice(index)) on every index of the text.
    // This means that we test the pattern against every starting point of the text.
    return text.split("").some((_, index) => {
      return match(pattern, text.slice(index))
    })
  }
}
```

## The ? Character

We want to be able to match 0 to 1 of the character before `?`.

Here are some examples

`search("ab?c", "ac")`    -> `true`
`search("ab?c", "abc")`   -> `true`
`search("a?b?c?", "abc")` -> `true`
`search("a?b?c?", "")`    -> `true`

The first step is to modify `match` to detect when a `?` character is present and then delegate to the `matchQuestion` function, which we will define shortly.

```js
function match(pattern, text) {
  if (pattern === "") {
    return true
  } else if (pattern === "$" && text === "") {
    return true
  // Notice that we are looking at pattern[1] instead of pattern[0].
  // pattern[0] is the character to match 0 or 1 of.
  } else if (pattern[1] === "?") {
    return matchQuestion(pattern, text)
  } else {
    return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1))
  }
}
```

`matchQuestion` needs to handle two cases:
1. Where the character before the `?` is not matched but the text matches the remainder of the pattern (everything after the `?`).
2. Where the character before the `?` is matched and the rest of the text (minus the 1 matched character) matches the remainder of the pattern.

If either of these cases is truthy, then `matchQuestion` can return `true`.

Let's consider the first case. How do we check if the text matches everything in the pattern except the `_?` syntax? In order words, how do we check if the character before the `?` appears 0 times? We strip 2 characters off the pattern (the first character is the one before the `?` and the second is the `?` itself) and invoke the match function.

```js
function matchQuestion(pattern, text) {
  return match(pattern.slice(2), text);
}
```

The second case is a little more challenging, but just like before, it reuses functions we've already written

```js
function matchQuestion(pattern, text) {
  if (matchOne(pattern[0], text[0]) && match(pattern.slice(2), text.slice(1))) {
    return true;
  } else {
    return match(pattern.slice(2), text);
  }
}
```

If the `text[0]` matches `pattern[0]`, and the rest of the text (minus the part that is matched by `matchOne`) matches the remainder of the pattern, then we are golden. Note that we could rewrite the code like this:

```js
function matchQuestion(pattern, text) {
  return (matchOne(pattern[0], text[0]) && match(pattern.slice(2), text.slice(1))) || match(pattern.slice(2), text);
}
```

The one thing I like about this latter approach is that the boolean OR makes it explicitly clear that there are two cases, either of which may be true.

## The * Character

We want to be able to match the character before the `*` 0 or more times.

All of these should return `true`.

`search("a*", "")`
`search("a*", "aaaaaaa")`
`search("a*b", "aaaaaaab")`

Similar to what we did when supporting `?`, we wan to delegate to a `matchStar` function within our `match` function

```js
function match(pattern, text) {
  if (pattern === "") {
    return true
  } else if (pattern === "$" && text === "") {
    return true
  } else if (pattern[1] === "?") {
    return matchQuestion(pattern, text)
  } else if (pattern[1] === "*") {
    return matchStar(pattern, text)
  } else {
    return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1))
  }
}
```

`matchStar`, like `matchQuestion`, also needs to handle two cases:
1. Where the character before the `*` is not matched but the text matches the remainder of the pattern (everything after the `*`).
2. Where the character before the `*` is matched one or more times and the rest of the text matches the remainder of the pattern.

Since there are two cases that both result in a match (0 matches OR more matches), we know that `matchStar` can be implemented with a boolean OR. Furthermore, case 1 for `matchStar` is exactly the same as it was for `matchQuestion` and can be implemented identically using `match(pattern.slice(2), text)`. That means we only need to formulate an expression that satisfies case 2.

```js
function matchStar(pattern, text) {
  return (matchOne(pattern[0], text[0]) && match(pattern, text.slice(1))) || match(pattern.slice(2), text);
}
```

## Refactoring

We can now go back and cleverly simplify `search` using a trick I learned in Peter Norvig's [class](https://www.udacity.com/course/design-of-computer-programs--cs212).

```js
function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text)
  } else {
    return match(".*" + pattern, text)
  }
}
```

We use the `*` character itself to allow for the pattern to appear anywhere in the string. The prepended `.*` says that any number of any character can appear before the pattern we wish to match.

## Conclusion

It's remarkable how simple and elegant the code for such a sophisticated and generalized program can be. The full source is available in this [GitHub repository](https://github.com/nadrane/build-your-own-regex)

A follow up where I fuzz test the regex engine can be found [here](https://nickdrane.com/regex-and-automated-test-fuzzing/)


#### Footnotes
<a name="footnote1">1</a>: There is a small bug in this code that I'm choosing to ignore. We don't account for the case that text is an empty string. Currently when `text === ''`, `text.split("")` will return `[]` and will not appropriately call `match`.