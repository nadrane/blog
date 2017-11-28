---
title: Build Your Own Regex Engine
date: 2017-11-28 11:36:04
categories:
  - [Regular Expressions]
  - [Javascript]
  - [Recursion]
---

I stumbled upon an [article](https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html) the other day where Rob Pike implements a rudimentary regular expression engine in c. I converted his code to Javascript and added test specs so that someone can self-guide themselves through the creation of the regex engine. The solution and specs can be found in this [GitHub repository](https://github.com/nadrane/build-your-own-regex). This blog post is a walkthrough on how my solution is implemented.

## Matching One Character

The first step is to write a function that can take in a one character pattern and a one character text string and return a boolean indicating if they match.

```js
function matchOne(pattern, text) {
  if (!pattern) return true // Any text matches an empty pattern
  if (!text) return false   // If the pattern is defined but the text is empty, there cannot be a match
  if (pattern === ".") return true // Any inputted text matches the wildcard
  return pattern === text
}
```

## Matching Same Length Strings

Now we want to add support for patterns and text strings of arbitrary length. For now, let's only consider a pattern/text of the same length. I happen to know that the solution lends itself very naturally to recursion, so we will use it here. We are going to want to repeatedly invokes `matchOne` on successive characters in the inputed strings.

```js
function match(pattern, text) {
  if (pattern === "") return true  // Our base case - If the pattern is empty, any inputted text is a match
  else return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1))
}
```

The above code advances character by character across the the pattern/text pair. It first compares pattern[0] to text[0] and then pattern[1] to text[1] and continue comparing pattern[i] to text[i] until i === pattern.length.. If they ever don't match, then we know that the pattern cannot match text.

Let's take an example. Suppose we invoke `match('a.c', 'abc')`, which returns `matchOne('a', 'a') && match('.c', 'bc')`.

If we continue evaluating these functions, we get `matchOne('a', 'a') && matchOne('.', 'b') && matchOne('c', 'c') && match("", "")`, which is just equal to `true && true && true && true`, So we have a match!

## The $ Character

Let's add support for the special pattern character `$` that allows us to match the end of a string. The solution simply requires adding an addition base case to the match function.

```js
function match(pattern, text) {
  if (pattern === "") return true  // Our base case - If the pattern is empty, any inputted text is a match
  if (pattern === "$" && text === "") return true
  else return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1))
}
```

## The ^ Character

Let's add support for the special pattern character `^` that allows us to match the beginning of a string. I'm going to introduce a new function called search.

```js
function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text)
  }
}
```

This function will be the entry point to our code. Up till this point, we were only matching patterns that began at the beginning of the text. We are simply making that more clear now by forcing the user to preface the pattern with a `^`. But how do we support patterns that appear anywhere within the text?

## Matches Starting Anywhere

Currently, the following return `true`
`search("^abc", "abc")`
`search("^abcd", "abcd")`

But `search("bc", "abcd")` will just return undefined. We want it to return `true`

If the user does not specify that the pattern matches the beginning of the text, then we want to search for that pattern at every possible starting point within the text. We will default to this behavior if the pattern does not begin with `^`.

```js
function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text)
  } else {
    // This code will run match(pattern, text.slice(index)) on every index of the text.
    // This means that we test the pattern against every starting point of the text. <sup>[1](#footnote1)</sup>
    return text.split("").some((_, index) => {
      return match(pattern, text.slice(index))
    })
  }
}
```

## The ? Character

We want to be able to match 0 to 1 of the character before `?`.

All of these should return `true`.

`search("ab?c", "ac")`
`search("ab?c", "abc")`
`search("a?b?c?", "abc")`
`search("a?b?c?", "")`

The first step is to modify `match` to detect when a `?` character is present and then delegate to the`makeQuestion` function.

```js
function match(pattern, text) {
  if (pattern === "") {
    return true
  } else if (pattern === "$" && text === "") {
    return true
  }
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
1. Where the character before the `?` is not matched but the rest of the text matches the remainder of the pattern
2. Where the character before the `?` is matched and the rest of the text matches the remainder of the pattern.

If either of these cases is truthy, then `matchQuestion` can return `true`.

Let's consider the first case. How do we see if the text matches everything in the pattern except the `_?` syntax? Simple. We strip 2 characters off the pattern and invoke the match function. The first character is the one that might be present and the second is the `?` itself.

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

If the `text[0]` matches `pattern[0]`, and the rest of the text (minus the part that is matched by `matchOne`) matches the rest of the pattern, then we are golden. Note that we could rewrite the code like this:

```js
function matchQuestion(pattern, text) {
  return (matchOne(pattern[0], text[0]) && match(pattern.slice(2), text.slice(1))) || match(pattern.slice(2), text);
}
```

The one thing I like about this approach is that the boolean OR makes it explicitly clear that there are two cases, either of which may be true.

## The * Character

We want to be able to match the character before the `*` 0 or more times.

All of these should return `true`.

`search("a*", "")`
`search("a*", "aaaaaaa")`
`search("a*b", "aaaaaaab")`

Similar to what we did when supporting `?`, we wan to add a `matchStar` function to our `match` function

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
1. Where the character before the `*` is not matched but the rest of the text matches the remainder of the pattern
2. Where the character before the `*` is matched one or more times and the rest of the text matches the remainder of the pattern.

Since there are two cases that both result in a match (0 matches OR more matches), we know that `matchStar` can be implemented with a boolean OR. Furthermore, case 1 for `matchStar` is exactly the same as it was for `matchQuestion` and can be implemented identically using `match(pattern.slice(2), text)`. That means we only need to formulate an expression that satisfies case 2.

```js
function matchStar(pattern, text) { {
  return (matchOne(pattern[0], text[0]) && match(pattern, text.slice(1))) || match(pattern.slice(2), text);
```

## Refactoring

We can now go back and very cleverly simplify `search` using a trick I learned in Norvig's class.

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


### Footnotes
<a name="footnote1">1</a>: There is a small bug in this code that I'm choosing to ignore. We don't account for the case that text is an empty string. Currently when `text = ''`, `text.split("")` will return `[]` and will note appropriately called `match`.