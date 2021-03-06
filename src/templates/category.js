import React from "react";
import Layout from "../components/layout";
import ArticleList from "../components/articleList";
import { graphql } from "gatsby";

const Category = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log("errors rendering article", errors);
  }
  const articles = data.allMarkdownRemark.nodes;
  return (
    <Layout>
      <ArticleList articles={articles} errors={errors} />
    </Layout>
  );
};

export default Category;

export const query = graphql`
  query RenderCategoriesQuery($category: String) {
    allMarkdownRemark(
      filter: {
        fields: { contentType: { eq: "post" } }
        frontmatter: { categories: { in: [$category] } }
      }
    ) {
      nodes {
        html
        excerpt(format: HTML)
        frontmatter {
          title
          date
          url
        }
      }
    }
  }
`;
