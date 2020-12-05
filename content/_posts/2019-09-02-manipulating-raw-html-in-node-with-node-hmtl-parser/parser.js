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

const html = `
  <div>
    <h1>My Blog</h1>
  </div>
`;

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
console.log(parseAndVisitNodes(html, addHeaderIds));
