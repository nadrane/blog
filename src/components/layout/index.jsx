import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Header from '../header';
import CategoryList from '../categoryList';
import RecentPosts from '../recentPosts';
import PopularPosts from '../popularPosts';

// import 'normalize.css';
import './global.css';
import styles from './styles.module.scss';

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={(data, errors) => {
      return (
        <div>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: 'Sample' },
              { name: 'keywords', content: 'sample, something' }
            ]}
          >
            <html lang="en" />
          </Helmet>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div className={styles.main}>
            <div className={styles.contentWrapper}>
              <section className={styles.content}>{children}</section>
              <aside className={styles.sidebar}>
                <PopularPosts />
                <RecentPosts />
                <CategoryList />
              </aside>
            </div>
          </div>
        </div>
      );
    }}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
