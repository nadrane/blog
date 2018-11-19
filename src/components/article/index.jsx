import React from 'react';

import styles from './styles.module.scss';
import { Link } from 'gatsby';
import Social from '../social';

export default function Article({
  showSocialTop,
  showSocialBottom,
  date,
  title,
  content,
  slug,
  makeTitleClickable = true
}) {
  return (
    <article className={styles.pb2}>
      {showSocialTop && <Social title={title} slug={slug} />}
      {date && <time className={styles.publishDate}>{new Date(date).toDateString()}</time>}
      <h1 className={styles.articleTitle}>
        {makeTitleClickable ? (
          <Link style={{ color: 'rgb(51, 51, 51)' }} to={slug}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {showSocialBottom && <Social title={title} slug={slug} />}
    </article>
  );
}
