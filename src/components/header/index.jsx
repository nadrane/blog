import React from 'react';
import { Link } from 'gatsby';
import styles from './styles.module.scss';

const Header = ({ siteTitle }) => (
  <div className={styles.headerWrapper}>
    <div className={styles.header}>
      <h1 style={{ borderBottom: 'none' }}>
        <Link
          to="/"
          style={{
            color: 'black',
            textDecoration: 'none'
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
);

export default Header;
