import React from 'react';
import Layout from '../components/layout';
import Article from '../components/article';
import { graphql } from 'gatsby';

const StaticTemplate = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }

  const content = data.markdownRemark.html;
  const title = data.markdownRemark.frontmatter.title;
  return (
    <Layout>
      <Article title={title} content={content} />
    </Layout>
  );
};

export default StaticTemplate;

export const query = graphql`
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
