import React from 'react';
import * as R from 'ramda';
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
      const categoriesWithCounts = R.pipe(
        R.path(['allMarkdownRemark', 'edges']),
        R.map(R.path(['node', 'frontmatter', 'categories'])),
        R.flatten,
        R.countBy(R.identity)
      );

      const sortedCategories = R.sortBy(
        R.prop('name'),
        Object.entries(categoriesWithCounts(data)).map(([name, count]) => ({
          name: `${name} (${count})`,
          link: `categories/${name.split(' ').join('-')}`
        }))
      );

      return <SideBarList items={sortedCategories} label="categories" />;
    }}
  />
);

export default CategoryList;
