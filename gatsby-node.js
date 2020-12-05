const path = require("path");

const getContentType = node => {
  const filePath = node.fileAbsolutePath;

  if (filePath.includes("/_posts/")) {
    return "post";
  } else if (filePath.includes("/_static/")) {
    return "static";
  } else if (filePath.includes("/_drafts/")) {
    return "draft";
  }
  throw new Error("unknown post type");
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type !== `MarkdownRemark`) {
    return;
  }

  createNodeField({
    name: `contentType`,
    node,
    value: getContentType(node)
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  await createPostPages(graphql, createPage);
  await createCategoryPages(graphql, createPage);
  await createStaticPages(graphql, createPage);
  process.env.NODE_ENV === "development" &&
    (await createDraftPages(graphql, createPage));
};

async function createStaticPages(graphql, createPage) {
  const staticPageTemplate = path.resolve("./src/templates/static.js");
  const result = await graphql(`
    query RenderStaticPages {
      pages: allMarkdownRemark(
        filter: { fields: { contentType: { eq: "static" } } }
      ) {
        nodes {
          frontmatter {
            title
            url
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    throw new Error("Could not query for static pages");
  }
  result.data.pages.nodes.forEach(node => {
    const { title, url } = node.frontmatter;
    createPage({
      path: `/${url
        .toLowerCase()
        .split(" ")
        .join("-")}/`,
      component: staticPageTemplate,
      context: {
        title
      }
    });
  });
  return;
}

async function createDraftPages(graphql, createPage) {
  createPage({
    path: `/drafts/`,
    component: path.resolve("./src/templates/blogIndex.js")
  });
}

async function createPostPages(graphql, createPage) {
  const result = await graphql(`
    query RenderPostsQuery {
      posts: allMarkdownRemark(
        filter: { fields: { contentType: { in: ["draft", "post"] } } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        nodes {
          fields {
            contentType
          }
          frontmatter {
            url
            title
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    throw new Error("Things broke, see console output above");
  }

  if (process.env.NODE_ENV === "production") {
    result.data.posts.nodes = result.data.posts.nodes.filter(
      node => node.fields.contentType === "post"
    );
  }

  result.data.posts.nodes.forEach(node => {
    createPage({
      path: `/${node.frontmatter.url}/`,
      component: path.resolve("./src/templates/article.js"),
      context: {
        title: node.frontmatter.title
      }
    });
  });
  return;
}

async function createCategoryPages(graphql, createPage) {
  const result = await graphql(`
    query RenderCategoriesQuery {
      posts: allMarkdownRemark(
        filter: { fields: { contentType: { eq: "post" } } }
      ) {
        nodes {
          frontmatter {
            categories
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    throw new Error("Things broke, see console output above");
  }

  const categories = new Set();

  result.data.posts.nodes.forEach(node => {
    for (category of node.frontmatter.categories) {
      categories.add(category);
    }
  });
  categories.forEach(category => {
    createPage({
      path: `/categories/${category.split(" ").join("-")}/`,
      component: path.resolve("./src/templates/category.js"),
      context: {
        category
      }
    });
  });
  return;
}
