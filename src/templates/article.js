import React from 'react';
import Layout from '../components/layout';
import Article from '../components/article';
import { graphql } from 'gatsby';

const ArticleTemplate = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }

  const { date, title } = data.markdownRemark.frontmatter;
  const { html, slug } = data.markdownRemark;
  return (
    <Layout>
      <Article
        slug={slug}
        makeTitleClickable={false}
        showSocialTop
        showSocialBottom
        date={date}
        title={title}
        content={html}
      />
    </Layout>
  );
};

export default ArticleTemplate;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(slug: { eq: $slug }) {
      html
      slug
      frontmatter {
        title
        date
      }
    }
  }
`;
