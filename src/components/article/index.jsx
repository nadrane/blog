import React from 'react';

import styles from './styles.module.css';
import globalStyles from '../../styles.module.css';
import { Link } from 'gatsby';

export default function Article({ date, title, content, slug }) {
  return (
    <article className={styles.pb2}>
      <time className={globalStyles.publishDate}>{new Date(date).toDateString()}</time>
      <h1 className={globalStyles.articleTitle}>
        {slug ? (
          <Link style={{ color: 'rgb(51, 51, 51)' }} to={slug}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
