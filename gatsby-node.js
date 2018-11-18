const path = require('path');
const { replace, pipe, path: keyPath } = require('ramda');
const { GraphQLString } = require('graphql');

const getFilename = pipe(
  keyPath(['fileAbsolutePath']),
  path.basename
);

// What if two blog posts share a slug though...
const getSlug = pipe(
  getFilename,
  replace(/\.md$/, '') // Strip trailing extension
);

const getCategory = node => {
  console.log('n', node);
};

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== 'MarkdownRemark') {
    return {};
  }

  return Promise.resolve({
    category: {
      type: GraphQLString,
      resolve: getCategory
    },
    slug: {
      type: GraphQLString,
      resolve: getSlug
    },
    filename: {
      type: GraphQLString,
      resolve: getFilename
    }
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
            slug
          }
        }
      }
    }
  `);
  console.log('post', result);
  if (result.errors) {
    console.log(result.errors);
    throw new Error('Things broke, see console output above');
  }

  result.data.posts.edges.forEach(({ node }) => {
    createPage({
      path: `./${node.slug}/`,
      component: articleTemplate,
      context: {
        slug: node.slug
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
  console.log('post', result);
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
