import React from 'react';

import styles from './styles.module.scss';
import { Link } from 'gatsby';
import Social from '../social';
import MailChimpForm from '../mailChimpForm';

export default function Article({
  showSocialTop,
  showSocialBottom,
  date,
  title,
  content,
  slug,
  showMailingListForm = false,
  makeTitleClickable = true
}) {
  const month = new Date(date).getUTCMonth();
  const day = new Date(date).getUTCDate();
  const year = new Date(date).getUTCFullYear();
  const formattedDate = new Date(year, month, day);
  return (
    <article className={styles.pb2}>
      {showSocialTop && <Social title={title} slug={slug} />}
      {date && <time className={styles.publishDate}>{formattedDate.toDateString()}</time>}
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
      {showMailingListForm && <MailChimpForm />}
      {showSocialBottom && <Social title={title} slug={slug} />}
    </article>
  );
}
