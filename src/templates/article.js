import React from 'react';
import Layout from '../components/layout';
import Article from '../components/article';

const ArticleTemplate = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }

  console.log('data', data);

  const { date, title } = data.markdownRemark.frontmatter;
  const content = data.markdownRemark.html;
  return (
    <Layout>
      <Article date={date} title={title} content={content} />
    </Layout>
  );
};

export default ArticleTemplate;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(slug: { eq: $slug }) {
      html
      frontmatter {
        title
        date
      }
    }
  }
`;
