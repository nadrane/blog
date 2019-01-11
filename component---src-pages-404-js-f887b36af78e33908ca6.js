(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{134:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(149);t.default=function(){return r.a.createElement(i.a,null,r.a.createElement("h1",null,"NOT FOUND"),r.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))}},137:function(e,t,n){"use strict";n.r(t),n.d(t,"graphql",function(){return p}),n.d(t,"StaticQueryContext",function(){return m}),n.d(t,"StaticQuery",function(){return f});var a=n(0),r=n.n(a),i=n(4),o=n.n(i),s=n(138),l=n.n(s);n.d(t,"Link",function(){return l.a}),n.d(t,"withPrefix",function(){return s.withPrefix}),n.d(t,"navigate",function(){return s.navigate}),n.d(t,"push",function(){return s.push}),n.d(t,"replace",function(){return s.replace}),n.d(t,"navigateTo",function(){return s.navigateTo});var c=n(139),u=n.n(c);n.d(t,"PageRenderer",function(){return u.a});var d=n(29);n.d(t,"parsePath",function(){return d.a});var m=r.a.createContext({}),f=function(e){return r.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function p(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}f.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},139:function(e,t,n){var a;e.exports=(a=n(142))&&a.default||a},141:function(e){e.exports={data:{site:{siteMetadata:{title:"Nick Drane",description:"A blog about programming and modern web development, particularly Node.js and React",keywords:"react, javascript, nodejs"}}}}},142:function(e,t,n){"use strict";n.r(t);n(30);var a=n(0),r=n.n(a),i=n(4),o=n.n(i),s=n(46),l=n(2),c=function(e){var t=e.location,n=l.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(s.a,Object.assign({location:t,pageResources:n},n.json))};c.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=c},143:function(e,t,n){e.exports={headerWrapper:"styles-module--headerWrapper--2tn7j",header:"styles-module--header--3Gxg8",headerLinks:"styles-module--headerLinks--2TTvw"}},144:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{frontmatter:{categories:["React","Immutability"]}}},{node:{frontmatter:{categories:["Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Postgres","Architecture"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Testing"]}}},{node:{frontmatter:{categories:["Shell","Postgres"]}}},{node:{frontmatter:{categories:["Functional Programming"]}}},{node:{frontmatter:{categories:["Javascript","Web Scraping"]}}},{node:{frontmatter:{categories:["Technical Hiring"]}}},{node:{frontmatter:{categories:["Software Ethics"]}}},{node:{frontmatter:{categories:["Javascript"]}}},{node:{frontmatter:{categories:["React","Redux","Build Your Own"]}}},{node:{frontmatter:{categories:["Javascript"]}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}}]}}}},145:function(e,t,n){e.exports={sideBarSection:"styles-module--sideBarSection--kbYhv",sideBarLabel:"styles-module--sideBarLabel--1Yp9y",sideBarEntry:"styles-module--sideBarEntry--yZZc9"}},146:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{fields:{slug:"a-performance-guide-to-gatsbyjs"},frontmatter:{title:"One Simple Performance Tip to Optimize GatsbyJS Static Sites"}}},{node:{fields:{slug:"hexo-vs-gatsbyjs-comparing-nodejs-static-site-generators"},frontmatter:{title:"A Deep Dive into Javascript Static Site Generators: Gatsby vs. Hexo"}}},{node:{fields:{slug:"using-jq-to-effortlessly-ingest-newline-delimited-JSON-into-postgres"},frontmatter:{title:"Using Shell Commands to Effortlessly Ingest Line-Delimited JSON into PostgreSQL"}}},{node:{fields:{slug:"hidden-costs-of-postgresql-jsonb"},frontmatter:{title:"The Hidden Costs of PostgreSQL's JSONB Datatype"}}},{node:{fields:{slug:"ethical-engineering-for-the-average-engineer"},frontmatter:{title:"Ethical Engineering for the Average Engineer"}}}]}}}},147:function(e,t,n){},148:function(e,t,n){e.exports={main:"styles-module--main--1m7Ru",contentWrapper:"styles-module--contentWrapper--iDaC7",content:"styles-module--content--3pIkX",sidebar:"styles-module--sidebar--WpqGz"}},149:function(e,t,n){"use strict";var a=n(141),r=n(0),i=n.n(r),o=n(4),s=n.n(o),l=n(160),c=n.n(l),u=n(137),d=n(143),m=n.n(d),f=function(e){var t=e.siteTitle;return i.a.createElement("div",{className:m.a.headerWrapper},i.a.createElement("div",{className:m.a.header},i.a.createElement("h1",{style:{borderBottom:"none"}},i.a.createElement(u.Link,{to:"/",style:{color:"black",textDecoration:"none"}},t)),i.a.createElement("div",{style:{flexGrow:1}}),i.a.createElement("ul",{className:m.a.headerLinks},i.a.createElement("li",null,i.a.createElement(u.Link,{to:"/projects"},"Projects")),i.a.createElement("li",null,i.a.createElement(u.Link,{to:"/hire-me"},"Hire Me")),i.a.createElement("li",null,i.a.createElement(u.Link,{to:"/about-me"},"About Me")))))},p=(n(69),n(150),n(140),n(161),n(162),n(163),n(68),n(144)),g=(n(164),n(145)),y=n.n(g),h=function(e){var t=e.items,n=(e.link,e.label);return i.a.createElement("div",{className:y.a.sideBarSection},i.a.createElement("h2",{className:y.a.sideBarLabel},n),i.a.createElement("ul",{style:{marginLeft:0}},t.map(function(e,t){return i.a.createElement("li",{className:y.a.sideBarEntry,key:t},i.a.createElement(u.Link,{style:{color:"inherit"},to:e.link},e.name))})))},v=function(){return i.a.createElement(u.StaticQuery,{query:"276048027",render:function(e){var t=e.allMarkdownRemark.edges.map(function(e){return e.node}).filter(function(e){return e.frontmatter.categories}).reduce(function(e,t){var n=function(){if(r){if(i>=a.length)return"break";o=a[i++]}else{if((i=a.next()).done)return"break";o=i.value}var t=o,n=e.findIndex(function(e){return e.name===t});-1!==n?e[n].count++:e.push({name:t,count:1})},a=t.frontmatter.categories,r=Array.isArray(a),i=0;for(a=r?a:a[Symbol.iterator]();;){var o;if("break"===n())break}return e},[]).sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0}).map(function(e){var t=e.name;return{name:t+" ("+e.count+")",link:"categories/"+t.split(" ").join("-")}});return i.a.createElement(h,{items:t,label:"categories"})},data:p})},E=n(146),b=function(){return i.a.createElement(u.StaticQuery,{query:"1570234692",render:function(e){var t=e.allMarkdownRemark.edges.map(function(e){return e.node}).map(function(e){return{name:e.frontmatter.title,link:e.fields.slug}});return i.a.createElement(h,{items:t,label:"Most Recent Posts"})},data:E})},k=function(){return i.a.createElement(h,{items:[{name:"Scraping the Web with Puppeteer: Lessons Learned",link:"scraping-the-web-with-puppeteer-lessons-learned"},{name:"Build Your Own Nested Query String Encoder/Decoder",link:"build-your-own-nested-query-string-encoder"},{name:"Build Your Own Regex in Less Than 40 Lines of Code",link:"build-your-own-regex"},{name:"Write Your Own React-Redux Connect",link:"write-your-own-redux-connect"},{name:"The Hidden Costs of PostgreSQL's JSONB Datatype",link:"hidden-costs-of-postgresql-jsonb"}],label:"Most Popular Posts"})},w=(n(147),n(148)),S=n.n(w),x=function(e){var t=e.children;return i.a.createElement(u.StaticQuery,{query:"1148362149",render:function(e,n){var a=e.site.siteMetadata;return i.a.createElement("div",null,i.a.createElement(c.a,{title:a.title,htmlAttributes:{lang:"en"},meta:[{name:"description",content:a.description},{name:"keywords",content:a.keywords},{name:"viewport",content:"width=device-width, initial-scale=1, maximum-scale=1"}]}),i.a.createElement(f,{siteTitle:e.site.siteMetadata.title}),i.a.createElement("div",{className:S.a.main},i.a.createElement("div",{className:S.a.contentWrapper},i.a.createElement("section",{className:S.a.content},t),i.a.createElement("aside",{className:S.a.sidebar},i.a.createElement(k,null),i.a.createElement(b,null),i.a.createElement(v,null)))))},data:a})};x.propTypes={children:s.a.node.isRequired};t.a=x}}]);
//# sourceMappingURL=component---src-pages-404-js-f887b36af78e33908ca6.js.map