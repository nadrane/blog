import React from "react";

import Layout from "../components/layout";
import ArticleList from "../components/articleList";
import { graphql } from "gatsby";

const BlogIndex = ({ data, errors }) => {
  const articles = data.allMarkdownRemark.nodes;
  console.log("drafts", articles);
  return (
    <Layout>
      <ArticleList articles={articles} errors={errors} />
    </Layout>
  );
};

export default BlogIndex;

export const query = graphql`
  {
    allMarkdownRemark(filter: { fields: { contentType: { eq: "draft" } } }) {
      nodes {
        excerpt(format: HTML)
        fileAbsolutePath
        frontmatter {
          title
          date
          url
        }
      }
    }
  }
`;
