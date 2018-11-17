import { escape } from 'querystring';
import styles from './styles.module.scss';

export default function Social({ title, slug }) {
  return (
    <ul className={styles.socialButtons}>
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${escape(slug)}&quote=${escape(title)}`}
          title="Share on Facebook"
          target="_blank"
        >
          <img alt="Share on Facebook" src="/images/social/Facebook.png" />
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=${escape(slug)}&text=${escape(title)}`}
          target="_blank"
          title="Tweet"
        >
          <img alt="Tweet" src="/images/social/Twitter.png" />
        </a>
      </li>
      <li>
        <a
          href={`http://www.linkedin.com/shareArticle?mini=true&url=${escape(slug)}&title=${escape(
            title
          )}`}
          target="_blank"
          title="Share on LinkedIn"
        >
          <img alt="Share on LinkedIn" src="/images/social/LinkedIn.png" />
        </a>
      </li>
      <li>
        <a
          href={`mailto:?subject=${title}&body=Check this out: ${slug}`}
          target="_blank"
          title="Send email"
        >
          <img alt="Send email" src="/images/social/Email.png" />
        </a>
      </li>
      )
    </ul>
  );
}
