import React from 'react';
import Layout from '../components/layout';
import ArticleList from '../components/articleList';

const Category = ({ data, errors }) => {
  if (errors && errors.length) {
    console.log('errors rendering article', errors);
  }
  const articles = data.allMarkdownRemark.edges;
  return <Layout>{<ArticleList articles={articles} errors={errors} />}</Layout>;
};

export default Category;

export const query = graphql`
  query RenderCategoriesQuery($category: String) {
    allMarkdownRemark(filter: { frontmatter: { categories: { in: [$category] } } }) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`;
