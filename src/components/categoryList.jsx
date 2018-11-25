import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import SideBarList from './sideBarList';

const CategoryList = () => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                categories
              }
            }
          }
        }
      }
    `}
    render={data => {
      const categoriesWithCounts = data.allMarkdownRemark.edges
        .map(edge => edge.node)
        .filter(node => node.frontmatter.categories)
        .reduce((accum, node) => {
          for (const category of node.frontmatter.categories) {
            const found = accum.findIndex(entry => entry.name === category);
            if (found !== -1) {
              accum[found].count++;
            } else {
              accum.push({ name: category, count: 1 });
            }
          }
          return accum;
        }, []);

      const sortedCategories = categoriesWithCounts
        .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
        .map(({ name, count }) => ({
          name: `${name} (${count})`,
          link: `categories/${name.split(' ').join('-')}`
        }));

      return <SideBarList items={sortedCategories} label="categories" />;
    }}
  />
);

export default CategoryList;
