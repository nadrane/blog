import React from 'react';

import Layout from '../components/layout';
import ArticleList from '../components/articleList';

const BlogIndex = ({ data, errors }) => {
  return (
    <Layout>
      <ArticleList data={data} errors={errors} />
    </Layout>
  );
};

export const pageQuery = graphql`
  {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          excerpt
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
