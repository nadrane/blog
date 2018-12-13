import React from 'react';
import Layout from '../components/layout';
import Article from '../components/article';
import { graphql } from 'gatsby';

const ArticleTemplate = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }

  const { date, title } = data.markdownRemark.frontmatter;
  const { html } = data.markdownRemark;
  const { slug } = data.markdownRemark.fields;
  return (
    <Layout>
      <Article
        slug={slug}
        makeTitleClickable={false}
        showMailingListForm
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        date
      }
    }
  }
`;
