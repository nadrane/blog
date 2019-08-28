function parseAndVisitNodes(html, func) {
  const root = parse(html);
  visit(root, func);
  return root;
}

function visit(root, func) {
  if (root.childNodes.length === 0) {
    return;
  }
  // Execute a function of the user's choice
  // The child is an input to that function.
  // The user can do anything they want!
  root.childNodes.forEach(child => {
    func(child, root);
    visit(child, func);
  });
}

const { parse, HTMLElement, TextNode } = require("node-html-parser");

function addHeaderIds(child, parent) {
  const headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  // Guard statememt to see if this node is a header
  // Ignore it if it isn't
  if (!headerTags.includes(child.tagName)) {
    return;
  }

  // We are assuming the header has a single TextNode as a child
  // We will use the text of this node for the header's id attribute
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

const html = `
  <div>
    <h1>My Blog</h1>
  </div>
`;

console.dir(parseAndVisitNodes(html, addHeaderIds), { depth: 5, colors: true });
