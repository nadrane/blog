import React from 'react';
import querystring from 'querystring';
import styles from './styles.module.scss';
import '@fortawesome/fontawesome-free/css/all.css';

export default function Social({ title, slug }) {
  return (
    <ul className={styles.socialButtons}>
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${querystring.encode(
            slug
          )}&quote=${querystring.encode(title)}`}
          title="Share on Facebook"
          target="_blank"
        >
          <i className="fab fa-facebook-f" />
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=${querystring.encode(
            slug
          )}&text=${querystring.encode(title)}`}
          target="_blank"
          title="Tweet"
        >
          <i class="fab fa-twitter" />
        </a>
      </li>
      <li>
        <a
          href={`http://www.linkedin.com/shareArticle?mini=true&url=${querystring.encode(
            slug
          )}&title=${querystring.encode(title)}`}
          target="_blank"
          title="Share on LinkedIn"
        >
          <i class="fab fa-linkedin-in" />
        </a>
      </li>
      <li>
        <a
          href={`mailto:?subject=${title}&body=Check this out: ${slug}`}
          target="_blank"
          title="Send email"
        >
          <i class="far fa-envelope" />
        </a>
      </li>
    </ul>
  );
}
