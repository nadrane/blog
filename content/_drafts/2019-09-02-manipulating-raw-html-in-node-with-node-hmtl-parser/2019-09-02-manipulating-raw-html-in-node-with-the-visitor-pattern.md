---
title: Manipulating Raw HTML in Node with the Visitor Pattern
date: 2019-09-02
categories: [JavaScript]
url: manipulating-raw-html-in-node-with-the-visitor-pattern
tags: ["visitor pattern", "parsing", "html", "nodejs"]
---

I recently wanted to add an id to every header tag in an HTML string. This sounds like an easy task right? A little jQuery and the problem is solved: `$(":header").attr("id", "1")` is a rough solution.

The catch is that this was in Node, not the browser. In most situations I would reach for [Cheerio](https://cheerio.js.org/), which replicates the [jQuery](https://jquery.com/) API inside node, but I needed something lighter weight.

This is a story of parsing, recursing, and modifying raw HTML without comfortable, declarative APIs. It's surprisingly approachable with the help of the [Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)!

<!-- more -->

## The Problem

My problem statement was quite simple: Add an id to every single header in an HTML string. I was able to assume that each header would only have a string of text as its child, so I took the text of that element and used it to construct each header's id.

I translated

```html
<div>
  <h2>Parsing HTML isn't so bad</h2>
</div>
```

into

```html
<div>
  <h2 id="parsing-html-is-not-so-bad">Parsing HTML is not so bad</h2>
</div>
```

## Representing HTML Using Fast HTML Parser

Before we can dive into parsing, we need to understand how HTML is represented when parsed. [Fast HTML Parser](https://www.npmjs.com/package/node-html-parser) can parse our HTML into a tree data structure composed of `HTMLElement`s and `TextNode`s. `HTMLElement`s represent your typical `div`, `span`, `h1` etc., and `TextNode`s represent the text inside an `HTMLELement`. For example, the previous HTML snippet would be represented like this:

```js
HTMLElement {
  tagName: 'div',
  childNodes: [
    HTMLElement {
      childNodes: [ TextNode ],
      tagName: 'h2',
    },
  ],
}
```

There are two different ways to obtain this tree representation:

1. Construct it by hand, using the `HTMLELement` and `TextNode` constructors
2. Parse an existing HTML string using the `parse` API provided by Fast HTML Parser

We will use both approaches in our solution.

## Constructing the HTML Tree from Scratch

Let's construct the above HTML tree by hand:

```js
const { HTMLElement, TextNode } = require("node-html-parser");

// Param 1 is the element tag name
// Param 2 is an object that we will later use to
// initialize the element id. It cannot be null
const outerDiv = new HTMLElement("div", {});
const h2Element = new HTMLElement("h2", {});

// Make h2Element a child of outerDiv
outerDiv.appendChild(h2Element);

// TextNode just takes in the text it contains
const textNode = new TextNode("Parsing HTML is not so bad");
// Give the h2 element some text
h2Element.appendChild(textNode);
```

The 2 main takeaways are

1. The `HTMLElement` and `TextNode` constructors allow us to create nodes that can be combined to construct a tree.
2. `HTMLElement` has an `appendChild` function that can establish a parent-child relationship between any two nodes.

If we wanted to include an `id` attribute, we only need a slight modification

```js
const { HTMLElement, TextNode } = require("node-html-parser");

const outerDiv = new HTMLElement("div", {});
const h2Element = new HTMLElement(
  "h2",
  // Pass in an id
  { id: "parsing-html-is-not-so-bad" },
  "id=parsing-html-is-not-so-bad"
);

outerDiv.appendChild(h2Element);

const textNode = new TextNode("Parsing HTML is not so bad");
h2Element.appendChild(textNode);
```

The above code probably looks odd. The API, as far as I can tell, requires us to pass in the id attribute twice, once as an object and once in raw string form. It's not clear to me why the raw form isn't auto-generated.

## Parsing and Recursing the HTML Tree

Let's now switch gears and instead obtain our tree data structure by using Fast HTML Parser built-in `parse` function.

```js
const { parse } = require("node-html-parser");

function parseAndVisitNodes(html) {
  const htmlRoot = parse(htmlString);
}
```

`htmlRoot` will be composed of `HTMLElement`s and `TextNode`s, just like the tree we we constructed by hand.

In order to modify this tree, our first step is write a function that will _touch_ every node in the HTML tree. We will use a standard [depth-first search](https://medium.com/basecs/demystifying-depth-first-search-a7c14cccf056) to accomplish this.

```js
const { parse } = require("node-html-parser");

function parseAndVisitNodes(html) {
  visit(parse(html));
}

function visit(root) {
  // This is our base case. If a node does not have any children,
  // then there is nothing else to traverse on this path
  if (root.childNodes.length === 0) {
    return;
  }
  // Visit every child node of the root
  root.childNodes.forEach(child => {
    visit(child);
  });
}
```

Don't worry if you're unfamiliar with this depth first search; you won't need to understand it to grok the ultimate solution.

Now that we can touch every node in the tree, we only need to go one small step further to execute a function on each node:

```js
const { parse } = require("node-html-parser");

function parseAndVisitNodes(html, func) {
  const htmlRoot = parse(html);
  visit(htmlRoot, func);
  // Notice we return the HTML as a string now
  return htmlRoot.toString();
}

function visit(root, func) {
  if (root.childNodes.length === 0) {
    return;
  }
  root.childNodes.forEach(child => {
    // Execute a function of the user's choice
    // The child is an input to that function.
    // The user inputs the function and can do anything they want!
    func(child, root);
    visit(child, func);
  });
}
```

There are 3 things worth noting:

1. We pass in the parent (`root` above) as well as `child` into the user-defined function. Having the parent node of `child` is useful later.
2. We do not appear to invoke `func` on our top-level node. The way we've written the code keeps it clean and incidentally works works perfectly since Fast HTML Parser wraps our root node in an additional node; effectively, all of our nodes are children of this top-level node. This oddity ensures the user-defined function is called even on the outermost node (or, if there are multiple outermost nodes, all are touched).
3. We are now returning the resultant HTML as a string from `parseAndVisitNodes`. If our function were to modify the HTML tree, we want a way to access the results. We choose to return a string as opposed to the htmlRoot itself because it encapsulates the parsed HTML data structure; ideally, the caller of this function should not need to understand `HTMLELement`s.

Let's put `parseAndVisitNodes` to use. Suppose a user wants to print the tag name of each child in the tree:

```js
function printTagName(child) {
  console.log(child.tagName);
}
const html = `
  <div>
    <h1>My Blog</h1>
  </div>
`;

// All we need to do is invoke parseAndVisitNodes
// and pass in a function that operates on a child node
parseAndVisitNodes(html, printTagName);
```

If you run this, you'll notice that the `TextNode`'s print `undefined`. That's to be expected. You might also notice that there are 3 text nodes, not 1. There is a `TextNode` between the opening `div` and opening `h1` and between the closing `h1` and closing `div`. These `TextNodes` contain new lines. The browser works the same way

We just used a technique called the [Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern), dubbed by the way that we _visited_ and executed a function on every node of the tree. This patterns flexibility should be readily apparent: We can add arbitrary functionality to operate over our HTML tree without needing to modify any underlying class itself.

Let's showcase the raw power of this design pattern by re-addressing the original problem: Let's write a function to add an id to every header tag.

```js
const { HTMLElement, TextNode } = require("node-html-parser");

function addHeaderIds(child, parent) {
  // There are 6 types of header tags
  const headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

  // Guard statement to check if this node is a header
  // Ignore the node if it isn't
  if (!headerTags.includes(child.tagName)) {
    return;
  }

  // We are assuming the header has a single TextNode as a child
  // We will use this nodes text to construct the header id
  const text = child.childNodes[0].text;
  const id = text
    .split(" ")
    .join("-")
    .toLowerCase();

  // Fast HTML Parser doesn't provide us a way to
  // mutate a node directly.
  // Instead, we need to create new nodes and
  // swap them out with existing ones

  // Create a new header tag with an id
  const newNode = new HTMLElement(child.tagName, { id }, `id="${id}"`);

  // Append a new TextNode (which looks identical to the old one) to our new header tag
  newNode.appendChild(new TextNode(text));

  // Replace our new header with the old one
  parent.exchangeChild(child, newNode);
}
```

If we run the above function on some HTML, we can see it in action:

```js
const html = `
  <div>
    <h1>My Blog</h1>
  </div>
`;

console.log(parseAndVisitNodes(html, addHeaderIds));
```

This outputs HTML that looks like this:

```html
<div>
  <h1 id="my-blog">My Blog</h1>
</div>
```

Now that you have `parseAndVisitNodes`, all you need to do is write an input function that utilizes the HTML data structure as you see fit. One challenge you might encounter is what happens when you want to modify a node in the middle of a large tree. In `addHeaderIds`, we simply copied the one underlying `TextNode` and appended it to our new header node, but this technique is obviously impractical for large, dynamic HTML trees. Fortunately, we can reuse existing parts of the tree, referencing certain child subtrees with multiple HTML tree data structures.
