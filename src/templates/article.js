import React from "react";
import Layout from "../components/layout";
import Article from "../components/article";
import { graphql } from "gatsby";

const ArticleTemplate = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log("errors rendering article", errors);
  }

  const { date, title, url } = data.markdownRemark.frontmatter;
  const { html } = data.markdownRemark;
  return (
    <Layout>
      <Article
        url={url}
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
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        title
        date
        url
      }
    }
  }
`;
