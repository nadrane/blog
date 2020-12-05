import React from "react";
import { StaticQuery, graphql } from "gatsby";
import SideBarList from "./sideBarList";

const RecentPosts = () => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark(
          limit: 5
          filter: { fields: { contentType: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          nodes {
            frontmatter {
              title
              url
            }
          }
        }
      }
    `}
    render={data => {
      const formattedLinks = data.allMarkdownRemark.nodes.map(node => ({
        name: node.frontmatter.title,
        link: node.frontmatter.url
      }));

      return <SideBarList items={formattedLinks} label="Most Recent Posts" />;
    }}
  />
);

export default RecentPosts;
