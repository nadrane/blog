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
      query SiteMetaDataQuery {
        site {
          siteMetadata {
            title
            description
            keywords
          }
        }
      }
    `}
    render={(data, errors) => {
      const siteMetadata = data.site.siteMetadata;
      return (
        <div>
          <Helmet
            title={siteMetadata.title}
            htmlAttributes={{ lang: 'en' }}
            meta={[
              { name: 'description', content: siteMetadata.description },
              { name: 'keywords', content: siteMetadata.keywords },
              { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
            ]}
          />
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
