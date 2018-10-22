// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---src-templates-article-js": () => import("/Users/nickdrane/projects/blog/src/templates/article.js" /* webpackChunkName: "component---src-templates-article-js" */),
  "component---src-templates-category-js": () => import("/Users/nickdrane/projects/blog/src/templates/category.js" /* webpackChunkName: "component---src-templates-category-js" */),
  "component---cache-dev-404-page-js": () => import("/Users/nickdrane/projects/blog/.cache/dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-pages-404-js": () => import("/Users/nickdrane/projects/blog/src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---src-pages-index-js": () => import("/Users/nickdrane/projects/blog/src/pages/index.js" /* webpackChunkName: "component---src-pages-index-js" */)
}

exports.data = () => import("/Users/nickdrane/projects/blog/.cache/data.json")

