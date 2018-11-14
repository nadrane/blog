import React from 'react';
import { Link } from 'gatsby';

const Header = ({ siteTitle }) => (
  <div
    style={{
      backgroundColor: '#fafafa',
      height: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'start',
        width: '100%',
        maxWidth: 910,
        marginLeft: '15px'
      }}
    >
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
