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
      <ul className={styles.headerLinks}>
        {/* <li>
          <Link to="/projects">Projects</Link>
        </li> */}
        <li>
          <Link to="/hire-me">Hire Me</Link>
        </li>
        <li>
          <Link to="/about-me">About Me</Link>
        </li>
        {/* <li>
          <Link to="/archives">Archives</Link>
        </li> */}
      </ul>
    </div>
  </div>
);

export default Header;
