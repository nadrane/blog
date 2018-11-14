// import React from 'react';
// import * as R from 'ramda';
// import { StaticQuery, Link } from 'gatsby';

// const Archives = () => (
//   <StaticQuery
//     query={graphql`
//       {
//         allMarkdownRemark(sort) {
//           edges {
//             node {
//               frontmatter {
//                 categories
//                 title
//                 date
//               }
//             }
//           }
//         }
//       }
//     `}
//     render={data => {
//       const categories = data.allMarkdownRemark.edges.reduce(
//         (accum, { node }) => R.union(accum, node.frontmatter.categories),
//         []
//       );

//       return (
//         <React.Fragment>
//           {categories.map(category => (
//             <Link to={`/categories/${category}`} className="category" key={category}>
//               {category}
//             </Link>
//           ))}
//         </React.Fragment>
//       );
//     }}
//   />
// );

// export default CategoryList;
