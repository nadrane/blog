(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{135:function(e,t,r){"use strict";r.r(t),r.d(t,"pageQuery",function(){return c});var n=r(0),a=r.n(n),o=r(139),l=r(152),c="241494459";t.default=function(e){var t=e.data,r=e.errors,n=t.allMarkdownRemark.edges;return a.a.createElement(o.a,null,a.a.createElement(l.a,{articles:n,errors:r}))}},152:function(e,t,r){"use strict";r(141),r(68);var n=r(0),a=r.n(n),o=r(143);t.a=function(e){var t=e.articles,r=e.errors;if(r&&r.length)return r.forEach(function(e){var t=e.message;console.log("error in articleList",t)}),a.a.createElement("h1",null,"Errors found: Check the console for details");var n=t.sort(function(e,t){var r=new Date(e.node.frontmatter.date),n=new Date(t.node.frontmatter.date);return r>n?-1:r<n?1:0});return a.a.createElement("div",null,n.map(function(e){var t=e.node,r=t.excerpt,n=t.fields.slug,l=t.frontmatter,c=l.title,u=l.date;return a.a.createElement(o.a,{key:c,date:u,title:c,slug:n,content:r})}))}}}]);
//# sourceMappingURL=component---src-pages-index-js-0dae989f55c8cd34be29.js.map