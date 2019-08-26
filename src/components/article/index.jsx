import React from "react";

import styles from "./styles.module.scss";
import { Link } from "gatsby";
import Social from "../social";
import MailChimpForm from "../mailChimpForm";
import { parse, TextNode, HTMLElement } from "node-html-parser";

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
  const parsedContent = parse(content);
  addHeaderIds(parsedContent);
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
      <div dangerouslySetInnerHTML={{ __html: parsedContent.toString() }} />
      {showMailingListForm && <MailChimpForm />}
      {showSocialBottom && <Social title={title} url={url} />}
    </article>
  );
}

const headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
function addHeaderIds(root) {
  if (root.childNodes.length === 0) {
    return;
  }
  root.childNodes.forEach(child => {
    if (headerTags.includes(child.tagName)) {
      const text = child.childNodes[0].text;
      const id = text
        .split(" ")
        .join("-")
        .toLowerCase();
      const newNode = new HTMLElement(
        child.tagName,
        { id },
        `id="${id}"`,
        root
      );
      newNode.appendChild(new TextNode(text));
      root.exchangeChild(child, newNode);
    } else {
      addHeaderIds(child);
    }
  });
}
