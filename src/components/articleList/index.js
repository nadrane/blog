import React from 'react';
import { Link } from 'gatsby';

const ArticleList = ({ articles, errors }) => {
  if (errors && errors.length) {
    errors.forEach(({ message }) => {
      console.log('error in articleList', message);
    });
    return <h1>Errors found: Check the console for details</h1>;
  }

  const sortedArticles = articles.sort(
    (edge1, edge2) => new Date(edge1.node.frontmatter.date) < new Date(edge2.node.frontmatter.date)
  );
  console.log('articles', articles);
  return (
    <div>
      {sortedArticles.map(({ node }) => {
        const { title, date } = node.frontmatter;
        return (
          <article key={title}>
            <span>{new Date(date).toDateString()}</span>
            <Link to={node.slug}>{title}</Link>
            <p>{node.excerpt}</p>
          </article>
        );
      })}
    </div>
  );
};

export default ArticleList;
