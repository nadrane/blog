const path = require('path');

const getFilename = node => path.basename(node.fileAbsolutePath);
const getSlug = node => getFilename(node).replace(/\.md$/, '');

const getContentType = node => {
  const filePath = node.fileAbsolutePath;
  if (filePath.includes('/_posts/')) {
    return 'post';
  } else if (filePath.includes('/_static/')) {
    return 'static';
  } else if (filepath.includes('/_drafts/')) {
    return 'drafts';
  }
  throw new Error('unknown post type');
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type !== `MarkdownRemark`) {
    return;
  }

  createNodeField({
    name: `slug`,
    node,
    value: getSlug(node)
  });

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
};

async function createStaticPages(graphql, createPage) {
  const articleTemplate = path.resolve('./src/templates/static.js');
  const result = await graphql(`
    query RenderPostsQuery {
      pages: allMarkdownRemark {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    throw new Error('Things broke, see console output above');
  }
  const pages = result.data.pages.edges.filter(({ node }) =>
    node.fileAbsolutePath.includes('/_static/')
  );
  pages.forEach(({ node }) => {
    const title = node.frontmatter.title;
    createPage({
      path: `/${title
        .toLowerCase()
        .split(' ')
        .join('-')}/`,
      component: articleTemplate,
      context: {
        title
      }
    });
  });
  return;
}

async function createPostPages(graphql, createPage) {
  const articleTemplate = path.resolve('./src/templates/article.js');
  const result = await graphql(`
    query RenderPostsQuery {
      posts: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { date: { ne: null } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    throw new Error('Things broke, see console output above');
  }

  result.data.posts.edges.forEach(({ node }) => {
    createPage({
      path: `/${node.fields.slug}/`,
      component: articleTemplate,
      context: {
        slug: node.fields.slug
      }
    });
  });
  return;
}

async function createCategoryPages(graphql, createPage) {
  const categoryTemplate = path.resolve('./src/templates/category.js');
  const result = await graphql(`
    query RenderCategoriesQuery {
      posts: allMarkdownRemark(filter: { frontmatter: { date: { ne: null } } }) {
        edges {
          node {
            frontmatter {
              categories
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    throw new Error('Things broke, see console output above');
  }

  const categories = new Set();

  result.data.posts.edges.forEach(({ node }) => {
    for (category of node.frontmatter.categories) {
      categories.add(category);
    }
  });
  categories.forEach(category => {
    createPage({
      path: `/categories/${category.split(' ').join('-')}/`,
      component: categoryTemplate,
      context: {
        category
      }
    });
  });
  return;
}
