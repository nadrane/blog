---
title: Using Reduce
date: 2017-09-28 10:36:30
categories: Functional Programming
---

My first introduction to functional programming was a couple years ago when I read through the famous [SICP](https://mitpress.mit.edu/sicp/full-text/book/book.html). As someone who had up to this point worked with mostly in object oriented and imperative languages, I had rarely seen `map`, `fitler`, and `reduce` before that time. The purpose of the former two felt obvious; the latter one not so much. This blog post is geared for someone who knows how `reduce` works but feels like they struggle to use it practically. It's dedicated to teaching you how to write almost anything (not an understatement) using the `reduce` statement.

I think one of the reasons `map` and `filter` are easier than `reduce` is because they always return an array. That's not the case for `reduce`. `reduce` is ultimately designed to transform one type into another.

## Know Your Return Type

When you begin writing a `reduce` statement, your first question to yourself should be "What type am I returning?". Here's a hint, it's probably one of the following: `string`, `number`, `object`, `array`. Once you know what type you will return you can begin writing your reduce statement. I say this because the second argument to `reduce` (in Javascript) is the starting accumulator, and what you pass in here can easily be determined by what type you're returning. Here is a table to guide your decision.

| return type | starting accumulator |
|:-----------:|:--------------------:|
| string |  "" |
| number | 0 |
| object | {} |
| array | [] |

_You probably won't want return an array from a reduce function very often because chances are you could have more simply used a combination of `map`, `filter`, and/or some other function instead._

## Summing Odd Numbers

So let's say we want to reduce over a set of numbers and return the sum of all the odd numbers. Since we are returning a `number`, we can use the above table to determine that the starting accumulator should be 0. That gives us a pretty decent starting point!

```js
const arrToSum = [1, 2, 3, 4, 5];
arrToSum.reduce(function() { // The first argument to reduce is a higher order function.
                             // It takes different arguments than reduce

}, 0)  // This is the second argument to reduce!
```
The next step is to determine what the arguments to our function are. The first argument is always the accumulator that was returned from the previous iteration, and the second is the next element in the array. Let's fill that in. In our case, the accumulator is the `currentSum` and the next element is the `nextNumber` in the array.

```js
const arrToSum = [1, 2, 3, 4, 5];
arrToSum.reduce(function(currentSum, nextNumber) {

}, 0)
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

One interesting thing to note about the above code is that EVERY code path returns something. This is a very common theme throughout the functional programming paradigm and holds true when writing reduce's higher order function (the function passed to reduce). In general it's a decent litmus test to establish if you've made a bug somewhere. More specifically, if every code path does not return something, and if that something is not the same type that your accumulator, you have a bug.

Let's do another example. This time, let's write a function that concatenates all of the characters in a array and returns the resultant string. According to our table above, the starting accumulator should be an empty string.

## Concatenating Characters into a String

```js
const arrToSum = ['a', 'b', 'c', 'd', 'e'];
arrToSum.reduce(function(resultantString, nextCharacter) {

}, "")
```

So, just like the previous example, we want to build up the result step by step. Instead of building the result through summation, this time we build it through concatenation. Every call to the higher order function will return a string with one additional character added to the previous accumulator.

```js
const arrToConcat = ['a', 'b', 'c', 'd', 'e'];
arrToConcat.reduce(function(resultantString, nextCharacter) {
  return resultantString + nextCharacter;
}, "")
```

If we cleverly use closure, we could easily generalize this solution into our own version of `Array.prototype.join`.

```js
const arrToConcat = ['a', 'b', 'c', 'd', 'e'];
function join(arrToConcat, joinCharacter) {
  return arrToConcat.reduce(function(resultantString, nextCharacter) {
    return resultantString + joinCharacter + nextCharacter;
  }, "");
}
```

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
    resultantObject[nextWord] = 1 //Set it to 1 since we have now seen the word 1 time.
    return resultantObject
  } else {
    // Otherwise increment the counter for that word inside the resulting object
    resultantObject[nextWord]++
    return resultantObject
  }
}, {})
```

Just like the first example, every code path returns the type that we ultimately expect (which is also the type of the initial accumulator).

## Merging Objects
Let's end with something a little more complicated.

Suppose we want to implement a merge function to combines several objects into a single object. We're going to implement `Object.assign`. Here are some examples.

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
3. Furthermore, unless you want a horrible experience, every code path MUST return a value whose type is the same as type of your accumulator.


## Conclusion
At the end of the day, just about everything you can do with reduce can be done with some combination of `map` and `fitler` and perhaps another [functional method](https://lodash.com/docs/4.17.4]). And the alternative solution is almost always simpler and more readable. So, in practice, you probably don't want to use `reduce` that often. With that said, `reduce` is a building block on which every other functional method can be built, and we will explore this unique trait in my next blog post.