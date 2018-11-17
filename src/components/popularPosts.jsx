import React from 'react';

import SideBarList from './sideBarList';
import titleCase from 'title-case';

const popularPosts = () => {
  const mostPopular = [
    {
      name: 'Scraping the Web with Puppeteer: Lessons Learned',
      link: 'scraping-the-web-with-puppeteer-lessons-learned'
    },
    {
      name: 'Build Your Own Nested Query String Encoder/Decoder',
      link: 'build-your-own-nested-query-string-encoder'
    },
    { name: 'Build Your Own Regex in Less Than 40 Lines of Code', link: 'build-your-own-regex' },
    { name: 'Write Your Own React-Redux Connect', link: 'write-your-own-redux-connect' },
    { name: "The Hidden Costs of PostgreSQL's JSONB Datatype", link: 'hidden-costs-of-postgresql-jsonb' }
  ];

  return <SideBarList items={mostPopular} label="Most Popular Posts" />;
};

export default popularPosts;
