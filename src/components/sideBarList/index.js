import React from 'react';
import { Link } from 'gatsby';
import styles from './styles.module.css';

const SideBarList = ({ items, label }) => {
  return (
    <div className={styles.sideBarSection}>
      <h2 className={styles.sideBarLabel}>{label}</h2>
      <ul style={{ marginLeft: 0 }}>
        {items.map((item, idx) => (
          <li className={styles.sideBarEntry} key={idx}>
            <Link style={{ color: 'inherit' }} to={`categories/${item.name.split(' ').join('-')}`}>
              {item.name} ({item.count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarList;
