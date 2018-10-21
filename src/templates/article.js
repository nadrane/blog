import React from 'react';
import Layout from '../components/layout';

const Article = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }

  const article = data.markdownRemark;
  const date = new Date(article.frontmatter.date);
  return (
    <Layout>
      <article>
        <span>{date.toDateString()}</span>
        <h1>{article.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.html }} />
      </article>
    </Layout>
  );
};

export default Article;

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
