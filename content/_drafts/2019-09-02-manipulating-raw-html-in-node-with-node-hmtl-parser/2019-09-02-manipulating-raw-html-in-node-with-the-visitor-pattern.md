---
title: Manipulating Raw HTML in Node with the Visitor Pattern
date: 2019-09-02
categories: [JavaScript]
url: manipulating-raw-html-in-node-with-the-visitor-pattern
---

I recently wanted to read in some HTML and add an id to every header tag. This sounds like an easy task right? The catch is that this was in Node, not the browser.

Most developers are warded off by the thought of parsing, recursing, and modifying raw HTML outside the comfortable APIs provided by the web browser. I thought I'd share my code and explain how it's not as crazy as you might initially anticipate, especially with the help of the [Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern).

## The Problem

My problem statement was quite simple: Add an id to every single header tag. I was able to assume that each header tag would have a single `TextNode` as it's child, so I simply took the text of that element and used it as the id for each header.

So I wanted to translate

```html
<div>
  <h2>Parsing HTML isn't so bad</h2>
</div>
```

into the following

```html
<div>
  <h2 id="parsing-html-is-not-so-bad">Parsing HTML is not so bad</h2>
</div>
```

## Representing HTML Using Fast HTML Parser

[Fast HTML Parser](https://www.npmjs.com/package/node-html-parser) is able to parse our HTML into a tree data structure composed of `HTMLElement`s and `TextNode`s. `HTMLELement`s represent your typical `div`, `span`, `h1` etc., and `TextNode`'s represent the actual textual expressions inside an `HTMLELement`. So, for example, our previous HTML snippet would be represented like this:

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

## Constructing the HTML Tree from Scratch

We can begin to construct the above HTML as a tree like so:

```js
const { HTMLElement, TextNode } = require("node-html-parser");

// We only need to pass in the element tag name
const outerDiv = new HTMLElement("div");

// We also pass in the parent element as the 4th parameter
const h2Element = new HTMLElement("h2", "", "", outerDiv);

// Make h2Element a child of outerDiv
outerDiv.appendChild(h2Element);

// Give the h2 element some text
// TextNode just takes in the text it contains
h2Element.appendChild(new TextNode("Parsing HTML is not so bad"));
```

The main takeaway is that `HTMLElement` has an `appendChild` function that allows us make other `HTMLElement`s and `TextNode`s that element children

If we wanted to include the `id` attribute, we only need a slight modification

```js
const { HTMLElement, TextNode } = require("node-html-parser");

const outerDiv = new HTMLElement("div");
const h2Element = new HTMLElement(
  "h2",
  { id: "parsing-html-is-not-so-bad" },
  "id=parsing-html-is-not-so-bad",
  outerDiv
);
outDiv.appendChild(h2Element);
h2Element.appendChild(new TextNode("Parsing HTML is not so bad"));
```

The above code probably looks odd. The API, as far as I can tell, requires us to pass in the attributes twice, once as an object and once in raw string form. It's not clear to me why the raw form isn't auto-generated.

## Parsing and Recursing the HTML Tree

Parsing the `HTML` is provided out of the box

```js
const { parse } = require("node-html-parser");
const htmlRoot = parse(htmlString);
```

This provides a tree data structure like the one we constructed by hand above. Our first step is write a function that will _touch_ every node in the HTML tree. We will use a standard [depth-first search](https://medium.com/basecs/demystifying-depth-first-search-a7c14cccf056) to accomplish this.

```js
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
  }
}
```

Now that we can touch every node in the tree, we only need to go a small step to execute a function on each node:

```js
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

An astute reader might notice 2 things:

1. We pass in the parent (`root` above) as well as `child` into the user-defined function. Having the parent node of `child` is useful later.
2. We do not appear to invoke `func` on our top-level node. The way we've written the code keeps it clean and works incidentally works perfectly since Fast HTML Parser wraps our root node in an additional node; effectively, all of our nodes are children of this top-level node. This oddity ensures the user-defined function is called even on the outermost node (or, if there are multiple outermost nodes, all are touched).

Let's say that the user wants to print the tag name of each child in the tree (if you run this, you'll notice that the `TextNode`'s print `undefined`. That's to be expected.):

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

We just used a technique called the [Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern), dubbed by the way that we _visited_ and executed a function on every node of the tree. This patterns flexibility should be readily apparent: We can add arbitrary functionality to operate over our HTML tree without needing to modify the underlying class itself.

Let's showcase the raw power of this design pattern by re-addressing the original problem: Let's write a function to add an id to every header tag.

```js
function addHeaderIds(child, parent) {
  // There are 6 types of header tags
  const headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

  // Guard statement to see if this node is a header
  // Ignore the node if it isn't
  if (!headerTags.includes(child.tagName)) {
    return;
  }

  // We are assuming the header has a single TextNode as a child
  // We will use the text of this node's text for the header's id attribute
  const text = child.childNodes[0].text;
  const id = text
    .split(" ")
    .join("-")
    .toLowerCase();

  // Fast HTML Parser doesn't provide us a way to modify a node directly.
  // Instead, we need to create new nodes and swap them out with existing ones

  // Create a new header tag with an id
  const newNode = new HTMLElement(child.tagName, { id }, `id="${id}"`, parent);

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

parseAndVisitNodes(html, addHeaderIds);
```

This outputs HTML that looks like this:

```html
<div>
  <h1 id="my-blog">My Blog</h1>
</div>
```

Now that you have `parseAndVisitNodes`, the hard work is taken care of, and all you need to do is write a input function that modifies the HTML data structure as you see fit. One challenge you might encounter is what happens when you want to modify a node in the middle of a large tree. In `addHeaderIds`, we simply copied the one underlying `TextNode` and appended it to our new header node, but this technique is obviously impractical for large, dynamic HTML trees.
Fortunately, we can reuse existing parts of the tree, effectively making certain children subtrees referenced by multiple HTML data structures.
