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
      <div style={{ flexGrow: 1 }} />
      <ul
        style={{
          borderBottom: 'none',
          listStyleType: 'none',
          display: 'flex',
          justifyContent: 'spaceBetween'
        }}
      >
        <li>
          <Link
            to="/"
            style={{
              color: 'black',
              textDecoration: 'none',
              padding: '5px'
            }}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/"
            style={{
              color: 'black',
              textDecoration: 'none',
              padding: '5px'
            }}
          >
            Hire Me
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Header;
