---
title: 'Build Your Own Nested Query String Encoder/Decoder'
categories: [Javascript, Build Your Own]
date: 2018-04-13 15:17:00
---

The other day at work, one of my colleagues was frustrated that he was unable to encode nested objects in a query string and still maintain a readable URL. I went home that night and coded up a simple solution to this problem, and I thought I'd share it here today. This [Github repo](https://github.com/nadrane/querystring-encoder) contains specs and the solution code.

<!-- more -->

## Motivation

Today, in the Node.js ecosystem, numerous modules exist to encode query strings, but they generally have one of two flaws:

1.  They do not permit the encoding of nested objects.

2.  They can encode nested objects, but they delimit nesting using unsafe URL characters, yielding an operation and a result that look like this <sup>[1](#footnote1)</sup>:

```js
encode({
  a: { b: 'c' }
});
>>>`a%5Bb%5D=c`
```

## The Problem in Detail

Node.js provides a [`querystring`](https://nodejs.org/api/querystring.html) module to encode objects to query strings. The only problem is that conforms to an official specification that doesn't allow nested objects. Unfortunately, this specification does not allow for enough flexibility when creating a RESTful API.

For example, suppose the client wants to filter a collection of cars by make and model. The route might look like this:

`/api/cars?make=honda&model=civic`

This URI makes it reasonably clear that we want to filter cars by their make and model.

What if we wanted to do something more complicated. What if we wanted to filter cars and order them by price?

`/api/cars?order=price&make=honda&model=civic`

It's no longer clear which query parameters describe the ordering and which describe the filter. Ideally, we want the url to look like this:

`/api/cars?order=price&filter.make=honda&filter.model=civic`

If we were to represent the query string of the above URI as a Javascript object, it would probably look like this:

```js
{
    order: "price",
    filter: {
        make: "honda",
        model: "civic"
    }
}
```

And then we quickly run into our problem. We need to encode the object above into

`order=price&filter.make=honda&filter.model=civic`

but Node.js's [`querystring`](https://nodejs.org/api/querystring.html) can't encode nested objects.

## Existing Modules Supporting Nested Querystrings

By default, the [qs](https://www.npmjs.com/package/qs) module creates ugly urls when it encodes nested query strings. If we encode our object above, we get

`order=price&filter[make]=honda&filter[model]=civic`

The `[` and `]` characters are both considered unsafe in a URL and are required to be escaped. The URL becomes unreadable after this percent encoding operation.

`order=price&filter%5Bmake%5D=honda&filter%5Bmodel%5D=civic`

Fortunately, the `.` is not considered unsafe and does not need to be escaped, making it the perfect character to express object nesting.

## The Solution

The solution is broken down into two parts. The first is _encoding_ a nested object into a query string. The second part is _decoding_ a query string back into a nested object.

### Encoding<sup>[2](#footnote2)</sup>

#### Just Nested Objects

Let's write some code to encode

```js
{
  filter: {
    make: 'honda';
    model: 'civic';
  }
}
```

into the query string `filter.make=honda&filter.model=civic`

```js
const { escape } = require('querystring');

function encode(queryObj, nesting = '') {
  let queryString = '';

  const pairs = Object.entries(queryObj).map(([key, val]) => {
    // Handle the nested, recursive case, where the value to encode is an object itself
    if (typeof val === 'object') {
      return encode(val, nesting + `${key}.`);
    } else {
      // Handle base case, where the value to encode is simply a string.
      return [nesting + key, val].map(escape).join('=');
    }
  });
  return pairs.join('&');
}
```

Notice that we use the [escape](https://nodejs.org/api/querystring.html#querystring_querystring_escape_str) function provided in Node.js core to percent encode specific characters.

#### Encoding Arrays as Values

If we want to add support to encode an object with array values, like the following:

```js
{
    name: "nick",
    hobbies: ["cooking", "coding"]
}
```

then we only need to add another base case to our function

```js
function encode(queryObj, nesting = '') {
  let queryString = '';

  const pairs = Object.entries(queryObj).map(([key, val]) => {
    // Handle a second base case where the value to encode is an array
    if (Array.isArray(val)) {
      return val.map(subVal => [nesting + key, subVal].map(escape).join('=')).join('&');
    } else if (typeof val === 'object') {
      return encode(val, nesting + `${key}.`);
    } else {
      return [nesting + key, val].map(escape).join('=');
    }
  });
  return pairs.join('&');
}
```

### Decoding

An encoding function is not very useful unless you can decode the encoded string back to it's original form.

#### Just Nested Objects

We want to write a function that will decode `filter.make=honda&filter.model=civic` back into a nested object

```js
{
  filter: {
    make: 'honda';
    model: 'civic';
  }
}
```

The code to do this is fairly straightforward if we use a [Lodash](https://lodash.com/docs) utility called [set](https://lodash.com/docs/4.17.5#set) that allows us to set an arbitrarily nested key in an object.

```js
const set = require('lodash.set');

function decode(queryString) {
  const queryStringPieces = queryString.split('&');
  const decodedQueryString = {};

  for (const piece of queryStringPieces) {
    let [key, value] = piece.split('=');
    value = value || ''; // If a value is not defined, it should be decoded as an empty string
    set(decodedQueryString, key, value);
  }
  return decodedQueryString;
}
```

#### Decoding Arrays as Values

If we want to add support to decode arrays like we did above, then we need to do a little additional work. Fortunately, two additional [Lodash](https://lodash.com/docs) utilities, [has](https://lodash.com/docs/4.17.5#has) and [get](https://lodash.com/docs/4.17.5#get), allow us to check for the existence of a nested key and to get the value associated with a nested key, respectively, greatly simplifying our problem.

```js
const set = require('lodash.set');
const has = require('lodash.has');
const get = require('lodash.get');

function decode(queryString) {
  const queryStringPieces = queryString.split('&');
  const decodedQueryString = {};

  for (const piece of queryStringPieces) {
    let [key, value] = piece.split('=');
    value = value || '';
    if (has(decodedQueryString, key)) {
      const currentValueForKey = get(decodedQueryString, key);
      if (!Array.isArray(currentValueForKey)) {
        set(decodedQueryString, key, [currentValueForKey, value]);
      } else {
        currentValueForKey.push(value);
      }
    } else {
      set(decodedQueryString, key, value);
    }
  }
  return decodedQueryString;
}
```

## Conclusion

And that's it! The whole thing, encoding and decoding, only takes ~40 lines of code. Perhaps next time you encounter something that feels a little too fundamental to code yourself, you won't hesitate to write some code if you can't find a sufficient open source package.

#### Footnotes

<a name="footnote1">1</a>: This example is straight from the [qs](https://www.npmjs.com/package/qs) documentation. Incidentally, qs provides an option to encode using a url safe character, which would result in readable urls, but this is not the default.

<a name="footnote2">2</a>: It's worth noting that you might not want to use this code in production. I've written the code in a functional style for clarity and conciseness. If you have a high read volume, given that this code might potentially run on a significant portion of GET requests, it should probably be written in an imperative style that doesn't disregard performance. Even more importantly, this code does not protect against potential attackers who might try to create an arbitrarily deeply nested object or might include an unwieldy number of query parameters.
