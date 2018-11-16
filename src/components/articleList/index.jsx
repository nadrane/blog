import React from 'react';
import Article from '../article';

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
  return (
    <div>
      {sortedArticles.map(({ node }) => {
        const { html, slug } = node;
        console.log('slugs', slug);
        const { title, date } = node.frontmatter;
        const excerpt = html.split('<!-- more -->')[0];
        return <Article key={title} date={date} title={title} slug={slug} content={excerpt} />;
      })}
    </div>
  );
};

export default ArticleList;