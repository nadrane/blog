(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{134:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(139);t.default=function(){return r.a.createElement(o.a,null,r.a.createElement("h1",null,"NOT FOUND"),r.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))}},137:function(e,t,n){"use strict";n.r(t),n.d(t,"graphql",function(){return p}),n.d(t,"StaticQueryContext",function(){return m}),n.d(t,"StaticQuery",function(){return f});var a=n(0),r=n.n(a),o=n(4),i=n.n(o),s=n(138),l=n.n(s);n.d(t,"Link",function(){return l.a}),n.d(t,"withPrefix",function(){return s.withPrefix}),n.d(t,"navigate",function(){return s.navigate}),n.d(t,"push",function(){return s.push}),n.d(t,"replace",function(){return s.replace}),n.d(t,"navigateTo",function(){return s.navigateTo});var c=n(140),u=n.n(c);n.d(t,"PageRenderer",function(){return u.a});var d=n(34);n.d(t,"parsePath",function(){return d.a});var m=r.a.createContext({}),f=function(e){return r.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function p(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}f.propTypes={data:i.a.object,query:i.a.string.isRequired,render:i.a.func,children:i.a.func}},139:function(e,t,n){"use strict";var a=n(144),r=n(0),o=n.n(r),i=n(4),s=n.n(i),l=n(153),c=n.n(l),u=n(137),d=n(146),m=n.n(d),f=function(e){var t=e.siteTitle;return o.a.createElement("div",{className:m.a.headerWrapper},o.a.createElement("div",{className:m.a.header},o.a.createElement("h1",{style:{borderBottom:"none"}},o.a.createElement(u.Link,{to:"/",style:{color:"black",textDecoration:"none"}},t)),o.a.createElement("div",{style:{flexGrow:1}}),o.a.createElement("ul",{className:m.a.headerLinks},o.a.createElement("li",null,o.a.createElement(u.Link,{to:"/projects"},"Projects")),o.a.createElement("li",null,o.a.createElement(u.Link,{to:"/hire-me"},"Hire Me")),o.a.createElement("li",null,o.a.createElement(u.Link,{to:"/about-me"},"About Me")))))},p=(n(72),n(141),n(142),n(155),n(156),n(159),n(68),n(147)),g=(n(161),n(148)),y=n.n(g),h=function(e){var t=e.items,n=(e.link,e.label);return o.a.createElement("div",{className:y.a.sideBarSection},o.a.createElement("h2",{className:y.a.sideBarLabel},n),o.a.createElement("ul",{style:{marginLeft:0}},t.map(function(e,t){return o.a.createElement("li",{className:y.a.sideBarEntry,key:t},o.a.createElement(u.Link,{style:{color:"inherit"},to:e.link},e.name))})))},v=function(){return o.a.createElement(u.StaticQuery,{query:"276048027",render:function(e){var t=e.allMarkdownRemark.edges.map(function(e){return e.node}).filter(function(e){return e.frontmatter.categories}).reduce(function(e,t){var n=function(){if(r){if(o>=a.length)return"break";i=a[o++]}else{if((o=a.next()).done)return"break";i=o.value}var t=i,n=e.findIndex(function(e){return e.name===t});-1!==n?e[n].count++:e.push({name:t,count:1})},a=t.frontmatter.categories,r=Array.isArray(a),o=0;for(a=r?a:a[Symbol.iterator]();;){var i;if("break"===n())break}return e},[]).sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0}).map(function(e){var t=e.name;return{name:t+" ("+e.count+")",link:"categories/"+t.split(" ").join("-")}});return o.a.createElement(h,{items:t,label:"categories"})},data:p})},E=n(149),b=function(){return o.a.createElement(u.StaticQuery,{query:"2173952562",render:function(e){var t=e.allMarkdownRemark.edges.map(function(e){return e.node}).map(function(e){return{name:e.frontmatter.title,link:e.slug}});return o.a.createElement(h,{items:t,label:"Most Recent Posts"})},data:E})},k=function(){return o.a.createElement(h,{items:[{name:"Scraping the Web with Puppeteer: Lessons Learned",link:"scraping-the-web-with-puppeteer-lessons-learned"},{name:"Build Your Own Nested Query String Encoder/Decoder",link:"build-your-own-nested-query-string-encoder"},{name:"Build Your Own Regex in Less Than 40 Lines of Code",link:"build-your-own-regex"},{name:"Write Your Own React-Redux Connect",link:"write-your-own-redux-connect"},{name:"The Hidden Costs of PostgreSQL's JSONB Datatype",link:"hidden-costs-of-postgresql-jsonb"}],label:"Most Popular Posts"})},w=(n(150),n(151)),x=n.n(w),S=function(e){var t=e.children;return o.a.createElement(u.StaticQuery,{query:"1148362149",render:function(e,n){var a=e.site.siteMetadata;return o.a.createElement("div",null,o.a.createElement(c.a,{title:a.title,htmlAttributes:{lang:"en"},meta:[{name:"description",content:a.description},{name:"keywords",content:a.keywords},{name:"viewport",content:"width=device-width, initial-scale=1, maximum-scale=1"}]}),o.a.createElement(f,{siteTitle:e.site.siteMetadata.title}),o.a.createElement("div",{className:x.a.main},o.a.createElement("div",{className:x.a.contentWrapper},o.a.createElement("section",{className:x.a.content},t),o.a.createElement("aside",{className:x.a.sidebar},o.a.createElement(k,null),o.a.createElement(b,null),o.a.createElement(v,null)))))},data:a})};S.propTypes={children:s.a.node.isRequired};t.a=S},140:function(e,t,n){var a;e.exports=(a=n(145))&&a.default||a},144:function(e){e.exports={data:{site:{siteMetadata:{title:"Nick Drane",description:"A blog about programming and modern web development, particularly Node.js and React",keywords:"react, javascript, nodejs"}}}}},145:function(e,t,n){"use strict";n.r(t);n(32);var a=n(0),r=n.n(a),o=n(4),i=n.n(o),s=n(53),l=n(2),c=function(e){var t=e.location,n=l.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(s.a,Object.assign({location:t,pageResources:n},n.json))};c.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=c},146:function(e,t,n){e.exports={headerWrapper:"styles-module--headerWrapper--2tn7j",header:"styles-module--header--3Gxg8",headerLinks:"styles-module--headerLinks--2TTvw"}},147:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{frontmatter:{categories:["Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Postgres","Architecture"]}}},{node:{frontmatter:{categories:["React","Immutability"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Testing"]}}},{node:{frontmatter:{categories:["Javascript","Web Scraping"]}}},{node:{frontmatter:{categories:["Shell","Postgres"]}}},{node:{frontmatter:{categories:["Functional Programming"]}}},{node:{frontmatter:{categories:["Technical Hiring"]}}},{node:{frontmatter:{categories:["React","Redux","Build Your Own"]}}},{node:{frontmatter:{categories:["Javascript"]}}},{node:{frontmatter:{categories:["Software Ethics"]}}},{node:{frontmatter:{categories:["Javascript"]}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}}]}}}},148:function(e,t,n){e.exports={sideBarSection:"styles-module--sideBarSection--kbYhv",sideBarLabel:"styles-module--sideBarLabel--1Yp9y",sideBarEntry:"styles-module--sideBarEntry--yZZc9"}},149:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{slug:"a-performance-guide-to-gatsbyjs",frontmatter:{title:"A Performance Guide to GatsbyJS"}}},{node:{slug:"hexo-vs-gatsbyjs-comparing-nodejs-static-site-generators",frontmatter:{title:"A Deep Dive into Javascript Static Site Generators: Gatsby vs. Hexo"}}},{node:{slug:"using-jq-to-effortlessly-ingest-newline-delimited-JSON-into-postgres",frontmatter:{title:"Using Shell Commands to Effortlessly Ingest Line-Delimited JSON into PostgreSQL"}}},{node:{slug:"hidden-costs-of-postgresql-jsonb",frontmatter:{title:"The Hidden Costs of PostgreSQL's JSONB Datatype"}}},{node:{slug:"ethical-engineering-for-the-average-engineer",frontmatter:{title:"Ethical Engineering for the Average Engineer"}}}]}}}},150:function(e,t,n){},151:function(e,t,n){e.exports={main:"styles-module--main--1m7Ru",contentWrapper:"styles-module--contentWrapper--iDaC7",content:"styles-module--content--3pIkX",sidebar:"styles-module--sidebar--WpqGz"}}}]);
//# sourceMappingURL=component---src-pages-404-js-f8093921cba2ec81d298.js.map