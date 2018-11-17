import React from 'react';
import * as R from 'ramda';
import { StaticQuery, graphql } from 'gatsby';
import SideBarList from './sideBarList';

const RecentPosts = () => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark {
          edges {
            node {
              slug
              fileAbsolutePath
              frontmatter {
                title
                date
              }
            }
          }
        }
      }
    `}
    render={data => {
      const get5MostRecentPosts = R.pipe(
        R.path(['allMarkdownRemark', 'edges']),
        R.map(R.prop('node')),
        R.filter(node => !node.fileAbsolutePath.includes('/_static/')),
        R.sortBy(R.path(['frontmatter', 'date'])),
        R.reverse,
        R.take(5),
        R.map(node => ({ name: node.frontmatter.title, link: node.slug }))
      );

      return <SideBarList items={get5MostRecentPosts(data)} label="Most Recent Posts" />;
    }}
  />
);

export default RecentPosts;
