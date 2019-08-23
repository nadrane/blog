import React from "react";
import { StaticQuery, graphql } from "gatsby";
import qs from "qs";
import styles from "./styles.module.scss";
import urlJoin from "url-join";

import facebookImage from "./images/Facebook.png";
import twitterImage from "./images/Twitter.png";
import linkedInImage from "./images/LinkedIn.png";
import emailImage from "./images/Email.png";

export default function Social({ title, url }) {
  return (
    <StaticQuery
      query={graphql`
        query SiteUrlQuery {
          site {
            siteMetadata {
              siteUrl
            }
          }
        }
      `}
      render={(data, errors) => {
        const link = urlJoin(data.site.siteMetadata.siteUrl, url);
        return (
          <ul className={styles.socialButtons}>
            <li>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?${qs.stringify(
                  {
                    u: link,
                    quote: title
                  }
                )}`}
                title="Share on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt="Share on Facebook" src={facebookImage} />
              </a>
            </li>
            <li>
              <a
                href={`https://twitter.com/intent/tweet?${qs.stringify({
                  url: link,
                  text: title
                })}`}
                target="_blank"
                title="Tweet"
                rel="noopener noreferrer"
              >
                <img alt="Tweet" src={twitterImage} />
              </a>
            </li>
            <li>
              <a
                href={`http://www.linkedin.com/shareArticle?mini=true&url=${qs.stringify(
                  {
                    mini: true,
                    url: link,
                    title
                  }
                )}`}
                target="_blank"
                title="Share on LinkedIn"
                rel="noopener noreferrer"
              >
                <img alt="Share on LinkedIn" src={linkedInImage} />
              </a>
            </li>
            <li>
              <a
                href={`mailto:?subject=${title}&body=Check this out: ${link}`}
                target="_blank"
                title="Send email"
                rel="noopener noreferrer"
              >
                <img alt="Send email" src={emailImage} />
              </a>
            </li>
          </ul>
        );
      }}
    />
  );
}
