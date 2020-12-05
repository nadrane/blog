import React from "react";
import { StaticQuery, graphql } from "gatsby";
import qs from "qs";
import styles from "./styles.module.scss";
import urlJoin from "url-join";
import mailSvg from "../../icons/mail.svg";
import facebookSvg from "../../icons/facebook.svg";
import linkedinSvg from "../../icons/linkedin.svg";
import twitterSvg from "../../icons/twitter.svg";

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
          facebookImage: file(relativePath: { eq: "facebook-circled.png" }) {
            publicURL
            childImageSharp {
              fixed(width: 39, height: 39) {
                ...GatsbyImageSharpFixed
              }
            }
          }
          linkedinImage: file(relativePath: { eq: "linkedin.png" }) {
            publicURL
            childImageSharp {
              fixed(width: 39, height: 39) {
                ...GatsbyImageSharpFixed
              }
            }
          }
          twitterImage: file(relativePath: { eq: "twitter-circled.png" }) {
            publicURL
            childImageSharp {
              fixed(width: 39, height: 39) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      `}
      render={(data, errors) => {
        const link = urlJoin(data.site.siteMetadata.siteUrl, url);
        const { facebookImage, linkedinImage, twitterImage } = data;
        return (
          <ul className={styles.socialButtons}>
            <li>
              <a
                style={{ display: "block", width: "39px" }}
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
                <img
                  style={{ maxWidth: "100%" }}
                  alt="Share on Facebook"
                  src={facebookSvg}
                />
              </a>
            </li>
            <li>
              <a
                style={{ display: "block", width: "39px" }}
                href={`https://twitter.com/intent/tweet?${qs.stringify({
                  url: link,
                  text: title
                })}`}
                target="_blank"
                title="Tweet"
                rel="noopener noreferrer"
              >
                <img
                  style={{ maxWidth: "100%" }}
                  alt="Tweet"
                  src={twitterSvg}
                />
              </a>
            </li>
            <li>
              <a
                style={{ display: "block", width: "39px" }}
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
                <img
                  style={{ maxWidth: "100%" }}
                  alt="Share on LinkedIn"
                  src={linkedinSvg}
                />
              </a>
            </li>
            <li>
              <a
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "37px",
                  height: "39px",
                  marginLeft: "2px"
                }}
                href={`mailto:?subject=${title}&body=Check this out: ${link}`}
                target="_blank"
                title="Send email"
                rel="noopener noreferrer"
              >
                <img
                  style={{ maxWidth: "36px" }}
                  alt="Share via Email"
                  src={mailSvg}
                />
              </a>
            </li>
          </ul>
        );
      }}
    />
  );
}
