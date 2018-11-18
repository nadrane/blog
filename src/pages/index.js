import React from 'react';

import Layout from '../components/layout';
import ArticleList from '../components/articleList';
import { graphql } from 'gatsby';

const BlogIndex = ({ data, errors }) => {
  const articles = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <ArticleList
        articles={articles.filter(article => !article.node.fileAbsolutePath.includes('/_static/'))}
        errors={errors}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          html
          slug
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
