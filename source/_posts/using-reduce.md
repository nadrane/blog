---
title: using-reduce
date: 2017-09-28 10:36:30
categories: Functional Programming
---

My first introduction to functional programming was a couple years ago when I read through the famous (SICP)[https://mitpress.mit.edu/sicp/full-text/book/book.html]. As someone who had up to this point worked with mostly in object oriented and imperative languages, I had never seen `map`, `fitler`, and `reduce` before that time. The purpose of the former two felt obvious; the latter one not so much. I blame this on the fact that every example online using it just sums an array of numbers. This blog post is geared for someone who knows how `reduce` works but feels like they struggle to use it practically. It's dedicated to teaching you how to write almost anything (not an understatement) using the `reduce` statement.

I think one of the reasons `map` and `filter` are easier than `reduce` is because they always return an array. That's the case for `reduce`. `reduce` is ultimately designed to transform one type into another, but it's far more flexible than that. Ultimately, when you begin writing a `reduce` statement, your first question to yourself should be "What type am I returning". Here's a hint, it's probably one of the following: `string`, `number`, `object`, `array`.

Once you know what type you will return you can begin writing your reduce statement. I say this because the second argument to `reduce` is the starting accumulator, and what you pass in here can easily be determined by what type you're returning. Here is a table to guide your decision.

| return type | starting accumulator |
|:---------------------:|:--------------------------------------------:|
| string |  "" |
| number | 0 |
| object | {} |
| array | [] |


So let's say we want to write a reduce over a set of numbers and return the sum of all the odd numbers. Since we are returning a `number`, we can use the above table to determine that the starting accumulator should be 0. That gives us a pretty decent starting point!

```js
const arrToSum = [1, 2, 3, 4, 5];
arrToSum.reduce(function() {

}, 0)
```
The next step is to determine what the arguments to our function are. The first argument is always the accumulator, and the second is the next element in the array. Let's fill that in. In our case, the accumulator is the `currentSum` and the next element is the `nextNumber` in the array,

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
  if (nextNumber % 1 === 1) {
    return currentSum + nextNumber
  // nextNumber is even
  } else {
    return currentSum
  }
}, 0)
```

One interesting thing to note about the above code is that EVERY code path returns something. This is a very common theme throughout functional programming paradigms and is a decent litmus test to establish if you've made a bug somewhere.

