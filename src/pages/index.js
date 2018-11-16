import React from 'react';

import Layout from '../components/layout';
import ArticleList from '../components/articleList';

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
    allMarkdownRemark {
      totalCount
      edges {
        node {
          html
          slug
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
