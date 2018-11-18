---
title: Regex And Automated Test Fuzzing
categories: [Regular Expressions, Javascript, Testing]
date: 2017-12-06
---

I posted my article [Build Your Own Regex Engine](https://nickdrane.com/build-your-own-regex/) on Reddit the other day, and one of the commenters claimed that the implementation should be trivial to break. Since I had already tested my program against a customized suite of tests, the remark got me thinking about how I could further increase my confidence in the correctness of my program. One extremely low cost however effective strategy for identifying faults in software is known as fuzzing.

<!-- more -->

## What is Fuzzing?

Fuzzing is a automated testing technique where a program is provided a series of invalid or randomly generated inputs. If we were testing an HTTP API, we might send randomized combinations of query parameters and ensure that our server always returns a 2xx status code. Since Javascript comes with a regular expression engine, my fuzzer asserts that given the same random input, both engine's return the same output.

## Specifying the Grammar

The first step is to specify the grammar that our regex engine supports.

```js
const lowercase = 'abcdefghijklmnopqrstuvwxyz'.split('');
const uppercase = lowercase.map(letter => letter.toUpperCase());
const special = ['?', '*', '.'];
const regexGrammar = special.concat(lowercase, uppercase);
```

You might notice we skipped the `^` and `$` characters. More on these in a little bit.

## Generated Valid Regular Expressions

We want to write a function `generateRegex` that will select `n` random characters from the `regexGrammar` and concatenate them together into a string. This string will be used to create a test regex.

Here are three possible returns values of `generateRegex`:

1. `.AnrQ?QNLQX.syBsOcJlbJZd`
2. `.LkuZ?Ynj`
3. `.UN?eiyddhXvyNj`

```js
function generateRegex(n) {
  let regexString = new Array(n)
    .fill(0)
    .map(chooseOne)
    .join('');

  return regexString;
}

// Pick one element randomly from the grammar and return it
function chooseOne() {
  return regexGrammar[Math.floor(Math.random() * regexGrammar.length)];
}
```

## Removing Invalid Regex Strings

My regex engine only deals with a very small subset of available regex syntax, and furthermore, it does not contain any error handling. What happens if `generateRegex` returns the pattern `**` or `^*`? My regex engine was never designed to handle these inputs, though they are possible outputs of `generateRegex`. We need to make a choice about how to handle these expressions. Since the primary goal of my regex engine is accessibility and simplicity of implementation, I'm not about to begin supporting these edge cases. That means my fuzzer should not generate them either.

One solution to determine if a given regex string is valid is to specify my regex engine's allowable grammar in [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form). BNF is a formal notation for specifying the syntax of a language. Given this BNF notation, I could ask another program if the randomly generated regex string can be created using my BNF specification. This sounds like a little more work than I want, however, since the invalid cases can simply be manually enumerated and filtered.

```js
function validRegex(regexString) {
  return (
    // None of the following sequences are properly
    // defined by my regex engine
    regexString.indexOf('**') === -1 &&
    regexString.indexOf('??') === -1 &&
    regexString.indexOf('*?') === -1 &&
    regexString.indexOf('?*') === -1 &&
    regexString.indexOf('^?') === -1 &&
    regexString.indexOf('^*') === -1 &&
    !regexString.startsWith('*') &&
    !regexString.startsWith('?')
  );
}

function generateRegex(n) {
  let regexString = new Array(n)
    .fill(0)
    .map(chooseOne)
    .join('');

  // If the generated string is valid, return it
  if (validRegex(regexString)) {
    return regexString;
    // Otherwise generate a new string and return that
  } else {
    return generateRegexString(n);
  }
}
```

One more modification to `generateRegex` is necessary to support `^` and `$`, and then we are basically done.

```js
function generateRegex(n) {
  ...
  // We need to ensure that '^' and '$' only go at the beginning
  // and the end of the string, respectively.
  // Give each a 10% probability of appearing in a string
  if (Math.random() < 0.1) regexString = "^" + regexString;
  if (Math.random() < 0.1) regexString = regexString + "$";
  ...
}
```

## Comparing Regex Implementations

All that is required now is to repeatedly invoke `generateRegex` a fixed number of times and then compare the output of the native JS implementation with the output of my implementation.

```js
// The corpus is the string of text we are matching the pattern against.
// I used a segment of Gulliver's Travels from Project Gutenberg.
function fuzzer(totalTests, corpus) {
  const maxRegexLength = 50; // max will actually be 50 - 1
  let testsRun = 0;
  while (testsRun < totalTests) {
    const regexLength = getRandomInt(1, maxRegexLength);
    const regexString = generateRegexString(regexLength);
    const testRegex = new RegExp(regexString);
    try {
      assert.equal(testRegex.test(corpus), myRegexEngine(regexString, corpus));
    } catch (err) {
      console.log(testRegex);
    }
    testsRun++;
  }
}

// Thank you Mozzila :)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
```

## Results

I ran my fuzzer for a couple million randomly generated cases and ended up learning two things about my regex engine.

1. My implementation fails extraordinarily with longer texts. I knew recursion would be a problem for any practical regex implementation (at least without [tail calls](https://en.wikipedia.org/wiki/Tail_call)) and would cause stack overflows, but I didn't expect it to fail with texts that were only a couple thousand words. I think this is because I make liberal use of backtracking algorithms in `matchQuestion` and `matchStar`. Since I was forced to test with a relatively short input text, it makes sense to use multiple text inputs to increase the probability of discovering an error.

2. My implementation treats the `.` character differently than the native implementation. In the RegExp implementation, `.` will not match various line terminators (`\n`, `\r`, `\u2028` or `\u2029`). My implementation does.

## Conclusion

The biggest takeaway is that fuzzing is an simple and inexpensive way to enumerate enormous sets of inputs and identify bugs in your software. This fuzzer took less than an hour to write.

But remember, this fuzzer's blessing of a couple million input combinations **does not** verify the correctness of my program. Not even close. A fuzzer is a tool to identify potential errors. Unless you enumerate all possible inputs (completely impossible in this case where they are infinite), you are not guaranteed your program is error free.
