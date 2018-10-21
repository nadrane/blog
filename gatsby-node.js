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

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== 'MarkdownRemark') {
    return {};
  }

  return Promise.resolve({
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
    console.log('creating page', node.slug);
    createPage({
      path: `/${node.slug}/`,
      component: articleTemplate,
      context: {
        slug: node.slug
      }
    });
  });
  return;
};
