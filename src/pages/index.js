import React from 'react';

import Layout from '../components/layout';
import ArticleList from '../components/articleList';
import { graphql } from 'gatsby';

const BlogIndex = ({ data, errors }) => {
  const articles = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <ArticleList articles={articles} errors={errors} />
    </Layout>
  );
};

export const pageQuery = graphql`
  {
    allMarkdownRemark(filter: { fields: { contentType: { eq: "post" } } }) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          excerpt(format: HTML)
          fileAbsolutePath
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`;

export default BlogIndex;
