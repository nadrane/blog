(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{133:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(138);t.default=function(){return a.a.createElement(o.a,null,a.a.createElement("h1",null,"NOT FOUND"),a.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))}},136:function(e,t,n){"use strict";n.r(t),n.d(t,"graphql",function(){return f}),n.d(t,"StaticQueryContext",function(){return m}),n.d(t,"StaticQuery",function(){return g});var r=n(0),a=n.n(r),o=n(4),i=n.n(o),s=n(137),l=n.n(s);n.d(t,"Link",function(){return l.a}),n.d(t,"withPrefix",function(){return s.withPrefix}),n.d(t,"navigate",function(){return s.navigate}),n.d(t,"push",function(){return s.push}),n.d(t,"replace",function(){return s.replace}),n.d(t,"navigateTo",function(){return s.navigateTo});var c=n(139),d=n.n(c);n.d(t,"PageRenderer",function(){return d.a});var u=n(31);n.d(t,"parsePath",function(){return u.a});var m=a.a.createContext({}),g=function(e){return a.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):a.a.createElement("div",null,"Loading (StaticQuery)")})};function f(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}g.propTypes={data:i.a.object,query:i.a.string.isRequired,render:i.a.func,children:i.a.func}},138:function(e,t,n){"use strict";var r=n(142),a=n(0),o=n.n(a),i=n(4),s=n.n(i),l=n(155),c=n.n(l),d=n(136),u=n(144),m=n.n(u),g=function(e){var t=e.siteTitle;return o.a.createElement("div",{className:m.a.headerWrapper},o.a.createElement("div",{className:m.a.header},o.a.createElement("h1",{style:{borderBottom:"none"}},o.a.createElement(d.Link,{to:"/",style:{color:"black",textDecoration:"none"}},t)),o.a.createElement("div",{style:{flexGrow:1}}),o.a.createElement("ul",{className:m.a.headerLinks},o.a.createElement("li",null,o.a.createElement(d.Link,{to:"/projects"},"Projects")),o.a.createElement("li",null,o.a.createElement(d.Link,{to:"/hire-me"},"Hire Me")),o.a.createElement("li",null,o.a.createElement(d.Link,{to:"/about-me"},"About Me")))))},f=(n(69),n(68),n(46),n(157),n(145)),p=n(140),h=(n(158),n(159),n(146)),b=n.n(h),y=function(e){var t=e.items,n=(e.link,e.label);return o.a.createElement("div",{className:b.a.sideBarSection},o.a.createElement("h2",{className:b.a.sideBarLabel},n),o.a.createElement("ul",{style:{marginLeft:0}},t.map(function(e,t){return o.a.createElement("li",{className:b.a.sideBarEntry,key:t},o.a.createElement(d.Link,{style:{color:"inherit"},to:e.link},e.name))})))},w=function(){return o.a.createElement(d.StaticQuery,{query:"276048027",render:function(e){var t=p.g(p.f(["allMarkdownRemark","edges"]),p.b(function(e){return e.node.frontmatter.categories}),p.e(p.f(["node","frontmatter","categories"])),p.c,p.a(p.d)),n=p.j(p.h("name"),Object.entries(t(e)).map(function(e){var t=e[0];return{name:t+" ("+e[1]+")",link:"categories/"+t.split(" ").join("-")}}));return o.a.createElement(y,{items:n,label:"categories"})},data:f})},k=(n(147),n(148),n(149)),E=function(){return o.a.createElement(d.StaticQuery,{query:"655237510",render:function(e){var t=p.g(p.f(["allMarkdownRemark","edges"]),p.e(p.h("node")),p.b(function(e){return!e.fileAbsolutePath.includes("/_static/")}),p.j(p.f(["frontmatter","date"])),p.i,p.k(5),p.e(function(e){return{name:e.frontmatter.title,link:e.slug}}));return o.a.createElement(y,{items:t(e),label:"Most Recent Posts"})},data:k})},v=function(){return o.a.createElement(y,{items:[{name:"Scraping the Web with Puppeteer: Lessons Learned",link:"scraping-the-web-with-puppeteer-lessons-learned"},{name:"Build Your Own Nested Query String Encoder/Decoder",link:"build-your-own-nested-query-string-encoder"},{name:"Build Your Own Regex in Less Than 40 Lines of Code",link:"build-your-own-regex"},{name:"Write Your Own React-Redux Connect",link:"write-your-own-redux-connect"},{name:"The Hidden Costs of PostgreSQL's JSONB Datatype",link:"hidden-costs-of-postgresql-jsonb"}],label:"Most Popular Posts"})},j=(n(150),n(151)),P=n.n(j),x=function(e){var t=e.children;return o.a.createElement(d.StaticQuery,{query:"1148362149",render:function(e,n){var r=e.site.siteMetadata;return o.a.createElement("div",null,o.a.createElement(c.a,{title:r.title,htmlAttributes:{lang:"en"},meta:[{name:"description",content:r.description},{name:"keywords",content:r.keywords}]}),o.a.createElement(g,{siteTitle:e.site.siteMetadata.title}),o.a.createElement("div",{className:P.a.main},o.a.createElement("div",{className:P.a.contentWrapper},o.a.createElement("section",{className:P.a.content},t),o.a.createElement("aside",{className:P.a.sidebar},o.a.createElement(v,null),o.a.createElement(E,null),o.a.createElement(w,null)))))},data:r})};x.propTypes={children:s.a.node.isRequired};t.a=x},139:function(e,t,n){var r;e.exports=(r=n(143))&&r.default||r},142:function(e){e.exports={data:{site:{siteMetadata:{title:"Nick Drane",description:"A blog about programming and modern web development, particularly Node.js and React",keywords:"react, javascript, nodejs"}}}}},143:function(e,t,n){"use strict";n.r(t);n(29);var r=n(0),a=n.n(r),o=n(4),i=n.n(o),s=n(51),l=n(2),c=function(e){var t=e.location,n=l.default.getResourcesForPathnameSync(t.pathname);return a.a.createElement(s.a,Object.assign({location:t,pageResources:n},n.json))};c.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=c},144:function(e,t,n){e.exports={headerWrapper:"styles-module--headerWrapper--2tn7j",header:"styles-module--header--3Gxg8",headerLinks:"styles-module--headerLinks--2TTvw"}},145:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{frontmatter:{categories:["React","Immutability"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Testing"]}}},{node:{frontmatter:{categories:["Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Postgres","Architecture"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Javascript","Web Scraping"]}}},{node:{frontmatter:{categories:["Shell","Postgres"]}}},{node:{frontmatter:{categories:["Functional Programming"]}}},{node:{frontmatter:{categories:["React","Redux","Build Your Own"]}}},{node:{frontmatter:{categories:["Technical Hiring"]}}},{node:{frontmatter:{categories:["Software Ethics"]}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}}]}}}},146:function(e,t,n){e.exports={sideBarSection:"styles-module--sideBarSection--kbYhv",sideBarLabel:"styles-module--sideBarLabel--1Yp9y",sideBarEntry:"styles-module--sideBarEntry--yZZc9"}},149:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{slug:"leveraging-immutability-in-react",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/leveraging-immutability-in-react.md",frontmatter:{title:"Leveraging Immutability in React",date:"2017-09-27T09:30:27.000Z"}}},{node:{slug:"regex-and-automated-test-fuzzing",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/regex-and-automated-test-fuzzing.md",frontmatter:{title:"Regex And Automated Test Fuzzing",date:"2017-12-06T00:00:00.000Z"}}},{node:{slug:"build-your-own-nested-query-string-encoder",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/build-your-own-nested-query-string-encoder.md",frontmatter:{title:"Build Your Own Nested Query String Encoder/Decoder",date:"2018-04-13T15:17:00.000Z"}}},{node:{slug:"hidden-costs-of-postgresql-jsonb",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/hidden-costs-of-postgresql-jsonb.md",frontmatter:{title:"The Hidden Costs of PostgreSQL's JSONB Datatype",date:"2018-09-30T00:00:00.000Z"}}},{node:{slug:"build-your-own-regex",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/build-your-own-regex.md",frontmatter:{title:"Build a Regex Engine in Less than 40 Lines of Code",date:"2017-11-28T11:36:04.000Z"}}},{node:{slug:"scraping-the-web-with-puppeteer-lessons-learned",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/scraping-the-web-with-puppeteer-lessons-learned.md",frontmatter:{title:"Scraping the Web with Puppeteer: Lessons Learned",date:"2017-12-09T15:35:13.000Z"}}},{node:{slug:"using-jq-to-effortlessly-ingest-newline-delimited-JSON-into-postgres",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/using-jq-to-effortlessly-ingest-newline-delimited-JSON-into-postgres.md",frontmatter:{title:"Using Shell Commands to Effortlessly Ingest Line-Delimited JSON into PostgreSQL",date:"2018-10-18T00:00:00.000Z"}}},{node:{slug:"using-reduce",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/using-reduce.md",frontmatter:{title:"Using Reduce",date:"2017-09-28T10:36:30.000Z"}}},{node:{slug:"write-your-own-redux-connect",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/write-your-own-redux-connect.md",frontmatter:{title:"Write Your Own React-Redux Connect",date:"2017-09-29T13:14:18.000Z"}}},{node:{slug:"you're-hiring-programmers-wrong-a-case-for-interview-standardization",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/you're-hiring-programmers-wrong-a-case-for-interview-standardization.md",frontmatter:{title:"You're Hiring Programmers Wrong: A Case for Interview Standardization",date:"2018-03-20T17:03:01.000Z"}}},{node:{slug:"ethical-engineering-for-the-average-engineer",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_posts/ethical-engineering-for-the-average-engineer/ethical-engineering-for-the-average-engineer.md",frontmatter:{title:"Ethical Engineering for the Average Engineer",date:"2018-09-16T15:41:16.000Z"}}},{node:{slug:"testimonials",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_static/testimonials.md",frontmatter:{title:"Testimonials",date:null}}},{node:{slug:"hire-me",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_static/hire-me.md",frontmatter:{title:"Hire Me",date:null}}},{node:{slug:"about",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_static/about.md",frontmatter:{title:"About Me",date:null}}},{node:{slug:"projects",fileAbsolutePath:"/Users/nickdrane/projects/blog/content/_static/projects.md",frontmatter:{title:"Projects",date:null}}}]}}}},150:function(e,t,n){},151:function(e,t,n){e.exports={main:"styles-module--main--1m7Ru",contentWrapper:"styles-module--contentWrapper--iDaC7",content:"styles-module--content--3pIkX",sidebar:"styles-module--sidebar--WpqGz"}}}]);
//# sourceMappingURL=component---src-pages-404-js-95f2dd136f9a88ffe627.js.map