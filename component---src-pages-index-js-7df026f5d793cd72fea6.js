(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{135:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",function(){return l});var n=a(0),r=a.n(n),i=a(149),o=a(168),l="241494459";t.default=function(e){var t=e.data,a=e.errors,n=t.allMarkdownRemark.edges;return r.a.createElement(i.a,null,r.a.createElement(o.a,{articles:n,errors:a}))}},137:function(e,t,a){"use strict";a.r(t),a.d(t,"graphql",function(){return f}),a.d(t,"StaticQueryContext",function(){return m}),a.d(t,"StaticQuery",function(){return g});var n=a(0),r=a.n(n),i=a(4),o=a.n(i),l=a(138),s=a.n(l);a.d(t,"Link",function(){return s.a}),a.d(t,"withPrefix",function(){return l.withPrefix}),a.d(t,"navigate",function(){return l.navigate}),a.d(t,"push",function(){return l.push}),a.d(t,"replace",function(){return l.replace}),a.d(t,"navigateTo",function(){return l.navigateTo});var c=a(139),u=a.n(c);a.d(t,"PageRenderer",function(){return u.a});var d=a(29);a.d(t,"parsePath",function(){return d.a});var m=r.a.createContext({}),g=function(e){return r.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function f(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}g.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},139:function(e,t,a){var n;e.exports=(n=a(142))&&n.default||n},141:function(e){e.exports={data:{site:{siteMetadata:{title:"Nick Drane",description:"A blog about programming and modern web development, particularly Node.js and React",keywords:"react, javascript, nodejs"}}}}},142:function(e,t,a){"use strict";a.r(t);a(30);var n=a(0),r=a.n(n),i=a(4),o=a.n(i),l=a(46),s=a(2),c=function(e){var t=e.location,a=s.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(l.a,Object.assign({location:t,pageResources:a},a.json))};c.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=c},143:function(e,t,a){e.exports={headerWrapper:"styles-module--headerWrapper--2tn7j",header:"styles-module--header--3Gxg8",headerLinks:"styles-module--headerLinks--2TTvw"}},144:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{frontmatter:{categories:["Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Build Your Own"]}}},{node:{frontmatter:{categories:["Postgres","Architecture"]}}},{node:{frontmatter:{categories:["React","Immutability"]}}},{node:{frontmatter:{categories:["Regular Expressions","Javascript","Testing"]}}},{node:{frontmatter:{categories:["Javascript","Web Scraping"]}}},{node:{frontmatter:{categories:["Shell","Postgres"]}}},{node:{frontmatter:{categories:["Functional Programming"]}}},{node:{frontmatter:{categories:["Technical Hiring"]}}},{node:{frontmatter:{categories:["React","Redux","Build Your Own"]}}},{node:{frontmatter:{categories:["Javascript"]}}},{node:{frontmatter:{categories:["Software Ethics"]}}},{node:{frontmatter:{categories:["Javascript"]}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}},{node:{frontmatter:{categories:null}}}]}}}},145:function(e,t,a){e.exports={sideBarSection:"styles-module--sideBarSection--kbYhv",sideBarLabel:"styles-module--sideBarLabel--1Yp9y",sideBarEntry:"styles-module--sideBarEntry--yZZc9"}},146:function(e){e.exports={data:{allMarkdownRemark:{edges:[{node:{fields:{slug:"a-performance-guide-to-gatsbyjs"},frontmatter:{title:"One Simple Performance Tip to Optimize GatsbyJS Static Sites"}}},{node:{fields:{slug:"hexo-vs-gatsbyjs-comparing-nodejs-static-site-generators"},frontmatter:{title:"A Deep Dive into Javascript Static Site Generators: Gatsby vs. Hexo"}}},{node:{fields:{slug:"using-jq-to-effortlessly-ingest-newline-delimited-JSON-into-postgres"},frontmatter:{title:"Using Shell Commands to Effortlessly Ingest Line-Delimited JSON into PostgreSQL"}}},{node:{fields:{slug:"hidden-costs-of-postgresql-jsonb"},frontmatter:{title:"The Hidden Costs of PostgreSQL's JSONB Datatype"}}},{node:{fields:{slug:"ethical-engineering-for-the-average-engineer"},frontmatter:{title:"Ethical Engineering for the Average Engineer"}}}]}}}},147:function(e,t,a){},148:function(e,t,a){e.exports={main:"styles-module--main--1m7Ru",contentWrapper:"styles-module--contentWrapper--iDaC7",content:"styles-module--content--3pIkX",sidebar:"styles-module--sidebar--WpqGz"}},149:function(e,t,a){"use strict";var n=a(141),r=a(0),i=a.n(r),o=a(4),l=a.n(o),s=a(160),c=a.n(s),u=a(137),d=a(143),m=a.n(d),g=function(e){var t=e.siteTitle;return i.a.createElement("div",{className:m.a.headerWrapper},i.a.createElement("div",{className:m.a.header},i.a.createElement("h1",{style:{borderBottom:"none"}},i.a.createElement(u.Link,{to:"/",style:{color:"black",textDecoration:"none"}},t)),i.a.createElement("div",{style:{flexGrow:1}}),i.a.createElement("ul",{className:m.a.headerLinks},i.a.createElement("li",null,i.a.createElement(u.Link,{to:"/projects"},"Projects")),i.a.createElement("li",null,i.a.createElement(u.Link,{to:"/hire-me"},"Hire Me")),i.a.createElement("li",null,i.a.createElement(u.Link,{to:"/about-me"},"About Me")))))},f=(a(69),a(150),a(140),a(161),a(162),a(163),a(68),a(144)),p=(a(164),a(145)),A=a.n(p),h=function(e){var t=e.items,a=(e.link,e.label);return i.a.createElement("div",{className:A.a.sideBarSection},i.a.createElement("h2",{className:A.a.sideBarLabel},a),i.a.createElement("ul",{style:{marginLeft:0}},t.map(function(e,t){return i.a.createElement("li",{className:A.a.sideBarEntry,key:t},i.a.createElement(u.Link,{style:{color:"inherit"},to:e.link},e.name))})))},E=function(){return i.a.createElement(u.StaticQuery,{query:"276048027",render:function(e){var t=e.allMarkdownRemark.edges.map(function(e){return e.node}).filter(function(e){return e.frontmatter.categories}).reduce(function(e,t){var a=function(){if(r){if(i>=n.length)return"break";o=n[i++]}else{if((i=n.next()).done)return"break";o=i.value}var t=o,a=e.findIndex(function(e){return e.name===t});-1!==a?e[a].count++:e.push({name:t,count:1})},n=t.frontmatter.categories,r=Array.isArray(n),i=0;for(n=r?n:n[Symbol.iterator]();;){var o;if("break"===a())break}return e},[]).sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0}).map(function(e){var t=e.name;return{name:t+" ("+e.count+")",link:"categories/"+t.split(" ").join("-")}});return i.a.createElement(h,{items:t,label:"categories"})},data:f})},y=a(146),b=function(){return i.a.createElement(u.StaticQuery,{query:"1570234692",render:function(e){var t=e.allMarkdownRemark.edges.map(function(e){return e.node}).map(function(e){return{name:e.frontmatter.title,link:e.fields.slug}});return i.a.createElement(h,{items:t,label:"Most Recent Posts"})},data:y})},w=function(){return i.a.createElement(h,{items:[{name:"Scraping the Web with Puppeteer: Lessons Learned",link:"scraping-the-web-with-puppeteer-lessons-learned"},{name:"Build Your Own Nested Query String Encoder/Decoder",link:"build-your-own-nested-query-string-encoder"},{name:"Build Your Own Regex in Less Than 40 Lines of Code",link:"build-your-own-regex"},{name:"Write Your Own React-Redux Connect",link:"write-your-own-redux-connect"},{name:"The Hidden Costs of PostgreSQL's JSONB Datatype",link:"hidden-costs-of-postgresql-jsonb"}],label:"Most Popular Posts"})},v=(a(147),a(148)),k=a.n(v),B=function(e){var t=e.children;return i.a.createElement(u.StaticQuery,{query:"1148362149",render:function(e,a){var n=e.site.siteMetadata;return i.a.createElement("div",null,i.a.createElement(c.a,{title:n.title,htmlAttributes:{lang:"en"},meta:[{name:"description",content:n.description},{name:"keywords",content:n.keywords},{name:"viewport",content:"width=device-width, initial-scale=1, maximum-scale=1"}]}),i.a.createElement(g,{siteTitle:e.site.siteMetadata.title}),i.a.createElement("div",{className:k.a.main},i.a.createElement("div",{className:k.a.contentWrapper},i.a.createElement("section",{className:k.a.content},t),i.a.createElement("aside",{className:k.a.sidebar},i.a.createElement(w,null),i.a.createElement(b,null),i.a.createElement(E,null)))))},data:n})};B.propTypes={children:l.a.node.isRequired};t.a=B},151:function(e,t,a){e.exports={pb2:"styles-module--pb2--AfFCT",publishDate:"styles-module--publishDate--ykcEK",articleTitle:"styles-module--articleTitle--PGngd"}},152:function(e){e.exports={data:{site:{siteMetadata:{siteUrl:"https://nickdrane.com"}}}}},153:function(e,t,a){e.exports={socialButtons:"styles-module--socialButtons--1R7Rx"}},154:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABBUlEQVR42u3XvWrCUBiAYYk0ji5JS0NzAx3EDl1sJ5euztKb6NS5jt5HL0CDLZXMvZFCtigigghy+g4ZPqQJxiQnFc4HzxIOnBfyw0lDKVUrE2AC/ryYjAWnJBZyBdiYIMaioBgB7DwBLrZQJdnhMk+AgxXUCdbYYH9wza06YIw7eLjBk86AFxyOpyvgB7bY+ApdDHQFfInNfURQgJ6AqQh4gNId8FlXwDP66IiANvqJ1yoD9rhG1gyrDvCRNW9V34JvhBiJTW8RJiJdD+FcBDzW8RYEIqBnAs4woPiB5EN+Ccs6kNgIsDzCuwi4T1kzQ+uUQ6l7hLYIuEhZ04T5LzAB/zPgF4mwkz3Asji2AAAAAElFTkSuQmCC"},155:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQklEQVR42u3WMUvDQByGcdt0qKA42Dq4hA4WdBAEUXGy4CYu/QIOBdGCjn4HndwcHQRnEerabOrkWEHHIA4WBUEqhfx9hoAQYs67C+hwL/yWTA/h0uuIiPwpF+ACXEDqQ8OVMQMfadMOKGAav1kL9xjiA10so4IdzJsETOERG8haG5JigGd04MPTDViA4BPbSNskXiE/iHCNFoq6ATVEkNglVhIBqxCFI3gwOoQdSEKAAzSwBcnQR9n0EFbRRKh4xZIhxKhpwCze8QYxdGPzGRYRQCwcGwfEq6NnEbBmFRBvHV2IpjuU8ghoQwxsgtkHlHAC0XBqdxekbwnnEIUAY/lcRt/zsYcHSIYLTORxGxbQwBl6UP3gPGE/EW39Bjws4hC3eMEQEQYIcYVdVKGY/RmooI451DAOnbn/hC7ABfzPgC/uMxh1wWVf+wAAAABJRU5ErkJggg=="},156:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABK0lEQVR42u3WvyvEcRzHcSSlbiE/Fjl3MSnFKGUwXx2TY7Gd+AOUf8BCLDJRst2/YJFJhsspC7tNibI4vT2H9/Dt1Q3O3ffjyuddj+X9ru89+9a3rsvM/lQMiAGdGeDTjzL2UUIPWpmmArpxAUvYDRkwgA8JeAgZ0Id7CagEC/CZxSUeUcFYwIDGEzpgCSWsYg1zvs/Ad46d28QZzrGDyVYCbmAJx77Pw8QGqjDxhvXfBlzJww59P4FP6A+ZU3XMtDMgqwHuBdd4honTdgaMQwPukPX7KGpyf0Jvmm9gBcnZkvsrBtMMmJeAgtzfMZJmwMIPAoZT+grCB+RQ/9cBeXyFCLiVh5z4fgomFiVgGSaa/gq2cZRQ9P0QDuSWk4Bpue8hE/8Vx4AY0Mg3lT+VfWEazvQAAAAASUVORK5CYII="},157:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABU0lEQVR42u3WS0sCURyG8WhbS8egzNRuprRoUV+ibfsIt9GHiJaiBrXrIxVRRhimlbeSrqZhtvDfM3AWgwQ6R8UW54Xfep5h4JwZE5GRMgEmwAT8zwA2gX3EkcKRpkPEcYBJNwEW2hB8I4eCS3nUIIrXTYAHHxBUEIW98R7Zm8EVBJ+w3Aa0kMA1ylhEr/PiElWcoKUTIIhhGgUXEVNIo44ItiE6AW3swd4CSihivsubX6COddjb7TtAbQkV3COIzlk4RwMbYAMMUAupiCwCHQ8/RQ1rYMMJCOMJglv44cEZBK+IDCsgihdksKlCvvCOBraQxhtWBx0QRhV5+B2fI4ljxznhQxbPiPQbIIjBhzIeEES3zeEOj5jFjm5AC0lkUEQIvS6ggm+QwA8s3aO4jBWNo3gZJedRrHsZNTUvoxyaEMU7ius45byOzR+RCTABJuAvv4FRbl/e6OHvAAAAAElFTkSuQmCC"},158:function(e,t,a){e.exports={border:"styles-module--border--O42kg",mcHeader:"styles-module--mcHeader--OsuQO",emailLabel:"styles-module--emailLabel--xb2_N",flexForm:"styles-module--flexForm--4P7yQ"}},159:function(e,t,a){"use strict";var n=a(0),r=a.n(n),i=a(151),o=a.n(i),l=a(137),s=a(152),c=a(165),u=a.n(c),d=a(153),m=a.n(d),g=a(166),f=a.n(g),p=a(154),A=a.n(p),h=a(155),E=a.n(h),y=a(156),b=a.n(y),w=a(157),v=a.n(w);function k(e){var t=e.title,a=e.slug;return r.a.createElement(l.StaticQuery,{query:"3230048808",render:function(e,n){var i=f()(e.site.siteMetadata.siteUrl,a);return r.a.createElement("ul",{className:m.a.socialButtons},r.a.createElement("li",null,r.a.createElement("a",{href:"https://www.facebook.com/sharer/sharer.php?"+u.a.stringify({u:i,quote:t}),title:"Share on Facebook",target:"_blank",rel:"noopener noreferrer"},r.a.createElement("img",{alt:"Share on Facebook",src:A.a}))),r.a.createElement("li",null,r.a.createElement("a",{href:"https://twitter.com/intent/tweet?"+u.a.stringify({url:i,text:t}),target:"_blank",title:"Tweet",rel:"noopener noreferrer"},r.a.createElement("img",{alt:"Tweet",src:E.a}))),r.a.createElement("li",null,r.a.createElement("a",{href:"http://www.linkedin.com/shareArticle?mini=true&url="+u.a.stringify({mini:!0,url:i,title:t}),target:"_blank",title:"Share on LinkedIn",rel:"noopener noreferrer"},r.a.createElement("img",{alt:"Share on LinkedIn",src:b.a}))),r.a.createElement("li",null,r.a.createElement("a",{href:"mailto:?subject="+t+"&body=Check this out: "+i,target:"_blank",title:"Send email",rel:"noopener noreferrer"},r.a.createElement("img",{alt:"Send email",src:v.a}))))},data:s})}var B=a(6),S=a.n(B),C=a(167),x=a.n(C),R=a(158),Q=a.n(R),I=function(e){function t(){for(var t,a=arguments.length,n=new Array(a),r=0;r<a;r++)n[r]=arguments[r];return(t=e.call.apply(e,[this].concat(n))||this).state={value:"",submitted:!1},t._handleInput=function(e){var a=e.target.value;t.setState({value:a})},t._handleSubmit=function(e){e.preventDefault(),x()(t.state.value).then(function(e){t.setState({value:"",submitted:!0})}).catch(function(e){console.log("error",e)})},t}return S()(t,e),t.prototype.render=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:Q.a.border}),r.a.createElement("div",null,this.state.submitted?r.a.createElement("span",null,"You signed up!"):r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:Q.a.mcHeader},"Want to be notified when I release a new article? Subscirbe to my mailing list."),r.a.createElement("form",{onSubmit:this._handleSubmit},r.a.createElement("div",{className:Q.a.flexForm},r.a.createElement("label",{className:Q.a.emailLabel,htmlFor:"mc-email"},"Your email address"),r.a.createElement("input",{onChange:this._handleInput,value:this.state.value,type:"email",name:"email",id:"mc-email",placeholder:"Your email address"}),r.a.createElement("button",{type:"submit"},"Subscribe"))))))},t}(r.a.Component);function U(e){var t=e.showSocialTop,a=e.showSocialBottom,n=e.date,i=e.title,s=e.content,c=e.slug,u=e.showMailingListForm,d=void 0!==u&&u,m=e.makeTitleClickable,g=void 0===m||m,f=new Date(n).getUTCMonth(),p=new Date(n).getUTCDate(),A=new Date(n).getUTCFullYear(),h=new Date(A,f,p);return r.a.createElement("article",{className:o.a.pb2},t&&r.a.createElement(k,{title:i,slug:c}),n&&r.a.createElement("time",{className:o.a.publishDate},h.toDateString()),r.a.createElement("h1",{className:o.a.articleTitle},g?r.a.createElement(l.Link,{style:{color:"rgb(51, 51, 51)"},to:c},i):i),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:s}}),d&&r.a.createElement(I,null),a&&r.a.createElement(k,{title:i,slug:c}))}a.d(t,"a",function(){return U})},168:function(e,t,a){"use strict";a(150),a(68);var n=a(0),r=a.n(n),i=a(159);t.a=function(e){var t=e.articles,a=e.errors;if(a&&a.length)return a.forEach(function(e){var t=e.message;console.log("error in articleList",t)}),r.a.createElement("h1",null,"Errors found: Check the console for details");var n=t.sort(function(e,t){var a=new Date(e.node.frontmatter.date),n=new Date(t.node.frontmatter.date);return a>n?-1:a<n?1:0});return r.a.createElement("div",null,n.map(function(e){var t=e.node,a=t.excerpt,n=t.fields.slug,o=t.frontmatter,l=o.title,s=o.date;return r.a.createElement(i.a,{key:l,date:s,title:l,slug:n,content:a})}))}}}]);
//# sourceMappingURL=component---src-pages-index-js-7df026f5d793cd72fea6.js.map