import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import SideBarList from './sideBarList';

const RecentPosts = () => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark(
          limit: 5
          filter: { fields: { contentType: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `}
    render={data => {
      const formattedLinks = data.allMarkdownRemark.edges
        .map(edge => edge.node)
        .map(node => ({ name: node.frontmatter.title, link: node.fields.slug }));

      return <SideBarList items={formattedLinks} label="Most Recent Posts" />;
    }}
  />
);

export default RecentPosts;
