module.exports = {
  siteMetadata: {
    title: `Nick Drane`,
    siteUrl: `https://nickdrane.com`,
    description: `A blog about programming and modern web development, particularly Node.js and React`,
    keywords: "react, javascript, nodejs"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    `gatsby-plugin-sass`,
    "gatsby-remark-copy-linked-files",
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://nickdrane.com`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Nick Drane",
        short_name: "Nick Drane",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png"
      }
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: "content/_posts"
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "drafts",
        path: "content/_drafts"
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "static",
        path: "content/_static"
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        excerpt_separator: "<!-- more -->",
        plugins: [
          "gatsby-remark-mermaid",
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 680,
              withWebp: true
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: "›",
              showLineNumbers: false,
              noInlineHighlight: false
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "images",
        path: `src/images`
      }
    },
    `gatsby-transformer-sharp`,
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-107252357-1`
      }
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://www.nickdrane.com",
        sitemap: "https://www.nickdrane.com/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/" }]
      }
    },
    {
      resolve: "gatsby-plugin-mailchimp",
      options: {
        endpoint:
          "https://nickdrane.us19.list-manage.com/subscribe/post?u=929bf07429061f0ef58f67fdd&amp;id=040d79920b"
      }
    },
    // `gatsby-plugin-feed`,
    `gatsby-plugin-sitemap`
  ]
};
