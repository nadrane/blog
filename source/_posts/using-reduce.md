---
title: Using Reduce
date: 2017-09-28 10:36:30
categories: Functional Programming
---

My first introduction to functional programming was a couple years ago when I read through the famous [SICP](https://mitpress.mit.edu/sicp/full-text/book/book.html). As someone who had up to this point worked with mostly in object oriented and imperative languages, I had rarely seen `map`, `fitler`, and `reduce` before that time. The purpose of the former two felt obvious; the latter one not so much. This blog post is geared for someone who knows how `reduce` works but feels like they struggle to use it practically.

## Reduce Basics
_Feel free to skip this section if you understand the basics of reduce_

[Reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=a) is known as a higher order function (HOF). A HOF is defined as a function that either takes in or returns another function.

Reduce takes two parameters: the first is a function, and the second is known as the initial accumulator. We will invoke this function over every element of an array. The ultimate goal is to transform the array into something new.

Suppose we want to take an array of characters and concatenate them into a single string. In this example, the first argument we pass reduce is a HOF that will operate over every character. The HOF takes two arguments: the first is the accumulator and is the value that we ultimately want to assemble, and the second is a particular element of the array.

Let's simulate what happens when we run a solution to the problem of concatenating strings.

```js
const arrToConcat = ['a', 'b', 'c', 'd'];
arrToConcat.reduce(function(resultantString, nextCharacter) {
  return resultantString + nextCharacter;
}, "")  // initial accumulator. This is the second argument to reduce!
```

You can use the below table to help guide yourself along

| invocation # | resultantString | nextCharacter | return value
|:------------:|:---------------:|:-------------:|:-----------:|
| 1 |  "" | 'a' | 'a'
| 2 |  "a" | 'b' | 'ab'
| 3 |  "ab" | 'c' | 'abc'
| 4 |  "abc" | 'd' | 'abcd'

We will ultimately call our HOF 4 times, passing in each of the 4 elements in the initial array.

The first time we invoke the HOF, the first argument is always the initial accumulator. Notice the `""` passed into reduce above. The second argument is `'a'` because that's the first element in our array. We return 'a', and this return value is the `resultantString` that is passed as an argument to the second invocation of our HOF, along with the next element of the array, `'b'`. The process continues. `'ab'` is returned from the HOF's second invocation, and `'ab'` and `'c'` are passed into the third invocation of the HOF. Ultimately, `reduce` returns `'abcd'`.

We built up the result step by step through a series of concatenation steps. Every call to the HOF will return a string with one additional character added to the previous accumulator.

## Know Your Return Type
I think one of the reasons `map` and `filter` are easier than `reduce` is because they always return an array. That's not the case for `reduce`. `reduce` is ultimately designed to transform one type into another.

When you begin writing a `reduce` statement, your first question to yourself should be "What type am I returning?". Here's a hint, it's probably one of the following: `String`, `Number`, `Object`, `Array`. Once you know what type you will return you can begin writing your reduce statement. I say this because the initial accumulator (reduce's second argument) can easily be determined by what type you expect `reduce` to return. Here is a table to guide your decision.

| return type | initial accumulator |
|:-----------:|:--------------------:|
| string |  "" |
| number | 0 |
| object | {} |
| array | [] |

**Notice that the initial accumulator and the return type are always the same!**

_You probably won't want return an array from a reduce function very often because chances are you could have more simply used a combination of `map`, `filter`, and/or some other function instead._

## Summing Odd Numbers

So let's say we want to reduce over a set of numbers and return the sum of all the odd numbers. Since we are returning a `number`, we can use the above table to determine that the starting accumulator should be 0. That gives us a pretty decent starting point!

```js
const arrToSum = [1, 2, 3, 4, 5];
arrToSum.reduce(function(currentSum, nextNumber) {

}, 0)  // This is the second argument to reduce!
```

Now we just need to complete the guts of the function such that it increments the sum when the `nextNumber` is odd. If `nextNumber` is even, it should return `currentSum` unchanged.

```js
const arrToSum = [1, 2, 3, 4, 5];
arrToSum.reduce(function(currentSum, nextNumber) {
  // nextNumber is odd
  if (nextNumber % 2 === 1) {
    return currentSum + nextNumber
  // nextNumber is even
  } else {
    return currentSum
  }
}, 0)
```

One interesting thing to note about the above code is that EVERY code path (every if-else block) returns something. This is a very common theme throughout the functional programming paradigm and holds true when writing reduce's higher order function. In general it's a decent litmus test to establish if you've made a bug somewhere. **More specifically, if every code path does not return something, and if that something is not the same type as your accumulator, you probably have a bug.**

## Frequency Counter

Let's do something a little different. Suppose I have an array of words, and I want to count how many times each word appears in the array. We can represent this information using an object that maps words in the array to a number indicating their frequency of occurrence.

```js
// We will input something like this
['luke', 'anakin', 'chewy', 'luke', 'chewy', 'princess', 'leia', 'chewy'] ->

// And output something like this
{
  luke: 2,
  anakin: 1,
  princess: 1,
  chewy: 3,
  leia: 1
}
```

Consulting the table above, we know that the starting accumulator needs to be an empty object. This means that each iteration over the array returns an object as well.

```js
const frequencyArray = ['luke', 'anakin', 'chewy', 'luke', 'chewy', 'princess', 'leia', 'chewy'];
frequencyArray.reduce(function(resultantObject, nextWord) {

}, {})
```

Every step of the higher order function needs to examine the next word and determine if it has been seen before. If it has not, then we need to add an entry to the accumulator and return it. If it has, then we need to increment the existing entry inside the accumulator object and return it.

```js
frequencyArray.reduce(function(resultantObject, nextWord) {
  // If the word is not in the object
  if (!resultantObject.hasOwnProperty(nextWord)) {
    resultantObject[nextWord] = 1 //Set it to 1 since we have seen the word before
    return resultantObject
  } else {
    // Otherwise increment the counter for that word inside the resulting object
    resultantObject[nextWord]++
    return resultantObject
  }
}, {})
```

Just like the first example, every code path returns the type of the accumulator.

## Merging Objects
Let's end with something a little more complicated.

Suppose we want to implement a merge function to combines several objects into a single object. We're going to implement something really similar to [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). Here are some examples.

```js
merge([ { a: 4, b: 3 }, { c:10 } ]) --> { a: 4, b: 3, c: 10 }

merge([ { a: 4, b: 3 }, { c:4 }, {f: 7} ]) --> { a: 4, b: 3, c: 4, f: 7}

// Duplicate keys take the value of the latter object
merge([ { a: 4, b: 3 }, { c:4 }, {a: 7} ]) --> { a: 7, b: 3, c: 4}
```

We know that the return value from this operation is an object, so that will be our starting accumulator. Every iteration of the array will produce a new object that contains the merging of the previous accumulator and the next object.

```js
// This merge function will take in two objects and output a new object
// containing both the keys and values from the two input objects.
function mergeTwo(obj1, obj2) {
  const newObj = {}
  for (let key in obj1) {
    newObj[key] = obj1[key]
  }
  for (let key in obj2) {
    newObj[key] = obj2[key]
  }
  return newObj
}

function merge(arr) {
  return arr.reduce(function(resultantObj, nextObj) {
    return mergeTwo(resultantObj, nextObj)
  }, {})
}
```

## Summary

To summarize

1. Always start by asking what the type of your output is. The type of your accumulator will follow by using the mapping table.
3. The logic inside your higher order function should assemble your resulting accumulator piecemeal. Since the return value of the previous iteration is the input to the next iteration, every code path must return a value
3. Furthermore, unless you want a horrible experience, every code path MUST return a value whose type is the same as that of your initial accumulator.


## Conclusion
At the end of the day, just about everything you can do with reduce can be done with some combination of `map` and `fitler` and perhaps another [functional method](https://lodash.com/docs/4.17.4]). And the alternative solution is almost always simpler and more readable. So, in practice, you probably don't want to use `reduce` that often. With that said, `reduce` is a building block on which every other functional method can be built, and we will explore this unique trait in my next blog post.