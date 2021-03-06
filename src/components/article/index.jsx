import React from "react";

import styles from "./styles.module.scss";
import { Link } from "gatsby";
import Social from "../social";
import MailChimpForm from "../mailChimpForm";

export default function Article({
  showSocialTop,
  showSocialBottom,
  date,
  title,
  content,
  url,
  showMailingListForm = false,
  makeTitleClickable = true
}) {
  // addHeaderIds(parsedContent);
  const month = new Date(date).getUTCMonth();
  const day = new Date(date).getUTCDate();
  const year = new Date(date).getUTCFullYear();
  const formattedDate = new Date(year, month, day);
  return (
    <article className={styles.pb2}>
      {showSocialTop && <Social title={title} url={url} />}
      {date && (
        <time className={styles.publishDate}>
          {formattedDate.toDateString()}
        </time>
      )}
      <h1 className={styles.articleTitle}>
        {makeTitleClickable ? (
          <Link style={{ color: "rgb(51, 51, 51)" }} to={url}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {showSocialBottom && <Social title={title} url={url} />}
      {showMailingListForm && <MailChimpForm />}
    </article>
  );
}
