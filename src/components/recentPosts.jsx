import React from 'react';
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
      const get5MostRecentPosts = data =>
        data.allMarkdownRemark.edges
          .map(edge => edge.node)
          .filter(node => !node.fileAbsolutePath.includes('/_static/'))
          .sort((node1, node2) => {
            const a = new Date(node1.frontmatter.date);
            const b = new Date(node2.frontmatter.date);
            return a > b ? -1 : a < b ? 1 : 0;
          })
          .slice(0, 5)
          .map(node => ({ name: node.frontmatter.title, link: node.slug }));

      return <SideBarList items={get5MostRecentPosts(data)} label="Most Recent Posts" />;
    }}
  />
);

export default RecentPosts;
