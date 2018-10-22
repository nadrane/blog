import React from 'react';
import * as R from 'ramda';
import { StaticQuery, Link } from 'gatsby';

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
      const allCategories = data.allMarkdownRemark.edges.reduce((accum, { node }) => {
        return accum.concat(node.frontmatter.categories);
      }, []);
      const categories = R.uniq(allCategories);
      const categoryCounts = R.countBy(R.identity, allCategories);

      return (
        <React.Fragment>
          {categories.map((category, idx) => (
            <div className="categoryBlock" key={idx}>
              <Link to={`/categories/${category}`} className="categoryName">
                {category}
              </Link>
              <span className="categoryCount">{categoryCounts[category]}</span>
            </div>
          ))}
        </React.Fragment>
      );
    }}
  />
);

export default CategoryList;
