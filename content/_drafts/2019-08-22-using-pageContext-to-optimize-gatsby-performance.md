---
title: "Optimizing Gatsby Build Times for Large Websites Using pageContext"
date: 2019-08-26
categories: [Gatsby]
url: optimizing-gatsby-build-times-for-large-websites-using-pagecontext
---

TL;DR Check out the [Bulk Requests and pageContext](#fragment1) section below to learn how pageContext works.

[Gatsby](https://www.gatsbyjs.org/) has become the de facto JavaScript static site generator because of its dedication to performance, near-infinite flexibility, and its embrace of React and GraphQL. Like any great tool, however, Gatsby is not without flaws.

If your content is driven by an API, as your site grows, your Gatsby build times will likely increase with every added page. Slow build times hinder developer workflows and make deployments cumbersome. In my [previous article](/a-performance-guide-to-gatsbyjs), I discussed optimizing GraphQL queries in Gatsby to decrease page load times. This article will focus on how GraphQL queries can be optimized to shorten ten minute or even hour-long build times to seconds.

<!-- more -->

## Gatsby Templates

The typical Gatsby configuration instructs you to create a template for each type of page on your site. For example, you might have a page for each product your site sells and a single template to generate these pages.

Each template has two pieces:

1. A React Component

```jsx
function Product({ data }) {
  return (
    <div>
      Name: {data.name}
      Price: {data.price}
      Description: {data.description}
    </div>
  );
}
```

The HTML outputted by this React component determines the contents of each product page on your site.

2. A GraphQL Query

```js
import { graphql } from "gatsby";

export const query = graphql(`
  query Product($productId: String!) {
    GetProduct(id: $productId) {
      name
      price
      description
    }
  }
`);
```

This GraphQL query will run at build time, and the results will be accessible in the `data` prop of the above component.

Together, these two pieces comprise your template file and will likely be located at `src/templates/product.js`

```jsx
// src/templates/product.js
import { graphql } from "gatsby";

function Product({ data }) {
  return (
    <div>
      Name: {data.name}
      Price: {data.price}
      Description: {data.description}
    </div>
  );
}

export const query = graphql(`
  query Product($productId: String!) {
    GetProduct(id: $productId) {
      name
      price
      description
    }
  }
`);
```

You be wondering where the query gets run, where the component is used, and how the `$productId` query parameter is defined. Let's dive into the `gatsby-node.js` file.

## The gatsby-node.js File

Every Gatsby project has a `gatsby-node.js` file at its root. This file gives you access to a wide range of [hooks](https://www.gatsbyjs.org/docs/node-apis/) and [APIs](https://www.gatsbyjs.org/docs/actions/) (called actions) that let you customize the bones of your application. In fact, this is the exact same API that Gatsby plugins use under the hood.

We're interested in a hook called `createPages`. This hook will run during Gatsby's build and will allow us to specify which pages we want to create with the above template. Let's explore this through an example:

```js
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Gatsby gives us access to a GraphQL client that we can
  // use to query any GraphQL API. Make a query to our server
  // to get all the product ids in our database
  const queryResults = await graphql(`
    query AllProducts {
      AllProducts {
        nodes {
          id
        }
      }
    }
  `);

  const productTemplate = path.resolve(`src/templates/product.js`);
  // Create a page for every single product ID
  queryResults.data.allProducts.nodes.forEach(node => {
    createPage({
      path: `/products/${node.id}`, // The URL where this particular page will live
      component: productTemplate, // The template whose component and query define this page's HTML
      context: {
        // Query parameters passed to productTemplate's GraphQL query
        productId: node.id
      }
    });
  });
};
```

The above code will run every time you build your website. It performs a handful of steps:

1. Query your server to find all the product IDs
2. Retrieve the product template defined above
3. Create a page for every product

Note:

- Each page will have a url like `/product/55`, where 55 is the id of the product.
- We pass in the `productId` as `context`. You can think of `context` as the set of GraphQL query parameters associated with this template.

Behind the scenes, `createPage` will execute the template's GraphQL query once per product. If you have a lot of products, this behavior can lead to performance problems.

## Performance Issues

This strategy shows its warts in two scenarios:

1. If your GraphQL query is expensive and you have a lot of pages, you will find yourself waiting on builds as this query is repeated once for every page for potentially thousands of pages.
2. If two different template share any data, you might find yourself querying the same data repeatedly, when ideally you would make this query a single time.

Fortunately, there is a workaround.

<a name="fragment1"></a>

## Bulk Requests and pageContext

The crux of our problem is that we are repeating similar queries many times. One strategy to solve this issue is to request the data in bulk. Suppose we adjusted the `gatsby-node` file's query:

```js
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query for all the data needed by every product page
  // in a single HTTP request.
  const products = await graphql(`
    query AllProducts {
      AllProducts {
        nodes {
          id
          name
          price
          description
        }
      }
    }
  `);
};
```

We are now requesting all of the data we need in a single query (this requires server-side support to fetch many products in a single database query). As long as we can pass this data down to our template's component, there is no need for the template to make a GraphQL query at all.

```js
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const queryResults = await graphql(`
    query AllProducts {
      allProducts {
        nodes {
          id
          name
          price
          description
        }
      }
    }
  `);

  const productTemplate = path.resolve(`src/templates/product.js`);
  queryResults.data.allProducts.nodes.forEach(node => {
    createPage({
      path: `/products/${node.id}`,
      component: productTemplate,
      context: {
        // This time we pass down the entire product as context
        product
      }
    });
  });
};
```

It turns out that `context` serves more than one purpose. While it defines the template's query parameters, this data is also passed **directly** to the template component as a prop called `pageContext`.

Our component can be adjusted to use this prop:

```jsx
// src/templates/product.js
function Product({ pageContext }) {
  return (
    <div>
      Name: {pageContext.name}
      Price: {pageContext.price}
      Description: {pageContext.description}
    </div>
  );
}
```

## Tradeoffs

This alternative approach can drastically improve performance, but it also has downsides. In fact, for the average application, the Gatsby maintainers recommend against this approach.

The moment we start using `pageContext` is the moment we stop colocating our template components along with their associated GraphQL queries. You will notice that our `src/templates/product.js` file doesn't have a GraphQL query anymore (it could, if we wanted to query additional data from a more performant endpoint). This has some downsides:

1. It's not immediately obvious anymore what the props of the `Product` component are. In our simple example, this is less of a problem, but in large production applications, it has a huge effect on readability and maintainability
   - This issue can be somewhat mitigated with [TypeScript interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) or [React PropTypes](https://www.npmjs.com/package/prop-types), but there is still an opportunity for these definitions to drift from the data actually passed in.
2. Components are usually hot reloaded when their associated GraphQL queries change. Now, when we change our query (located in the `gatsby-node` file), our website needs to be rebuilt.

## Conclusion

Only resort to `pageContext` only when absolutely necessary. Do not use this performance optimization prematurely (before you experience a problem) because it only will impair the readability of your code. When your builds get slow, however, this technique can mean the difference between unacceptable build times and a smooth experience.
