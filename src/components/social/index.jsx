import React from 'react';
import querystring from 'querystring';
import styles from './styles.module.scss';

import facebookImage from './images/Facebook.png';
import twitterImage from './images/Twitter.png';
import linkedInImage from './images/LinkedIn.png';
import emailImage from './images/Email.png';

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
          rel="noopener noreferrer"
        >
          <img alt="Share on Facebook" src={facebookImage} />
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=${querystring.encode(
            slug
          )}&text=${querystring.encode(title)}`}
          target="_blank"
          title="Tweet"
          rel="noopener noreferrer"
        >
          <img alt="Tweet" src={twitterImage} />
        </a>
      </li>
      <li>
        <a
          href={`http://www.linkedin.com/shareArticle?mini=true&url=${querystring.encode(
            slug
          )}&title=${querystring.encode(title)}`}
          target="_blank"
          title="Share on LinkedIn"
          rel="noopener noreferrer"
        >
          <img alt="Share on LinkedIn" src={linkedInImage} />
        </a>
      </li>
      <li>
        <a
          href={`mailto:?subject=${title}&body=Check this out: ${slug}`}
          target="_blank"
          title="Send email"
          rel="noopener noreferrer"
        >
          <img alt="Send email" src={emailImage} />
        </a>
      </li>
    </ul>
  );
}
