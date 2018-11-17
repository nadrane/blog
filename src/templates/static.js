import React from 'react';
import Layout from '../components/layout';

const StaticTemplate = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }

  const content = data.markdownRemark.html;
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

export default StaticTemplate;

export const query = graphql`
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
    }
  }
`;
