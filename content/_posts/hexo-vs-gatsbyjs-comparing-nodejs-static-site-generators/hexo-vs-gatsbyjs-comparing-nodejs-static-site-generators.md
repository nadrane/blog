---
title: GatsbyJS Vs. Hexo Comparing Node.js Static Site Generators
date: 2018-11-18
categories: [Node.js Ecosystem]
---

If you've made your way here, I assume your looking to build yourself a blog or a static website. I also assume that you're a developer and want the flexibility to customize your site, otherwise you might want to consider an out-of-the-box solution like [Medium](https://medium.com/) or, for more customizability, [Wordpress](https://wordpress.com/)

There are two major static site generators in the Javascript ecosystem: the incumbent [Hexo](https://hexo.io) and the up-and-coming [GatsbyJS](https://www.gatsbyjs.org/). In case you're just here for a TL;DR, GatsbyJS is the far better option. This site was originally built with Hexo, but I've recently felt compelled to switch. Let's talk about why.

<!-- more -->

## Different Products

First and foremost, I want to elaborate on what Hexo and Gatsby are designed to do. Both are static site generators, but at their hearts, they are very different products: Hexo is a blog generator; Gatsby sophisticated static content creation platform.

### Hexo

Hexo specializes in creating markdown driven blogs. This specialization comes with tradeoffs. It's very easy to get a blog up and running, but if you want to do anything more sophisticated, it ranges from challenging to impossible. This is fine for most people's use cases, however.

### Gatsby

Gatsby epitomizes customizability and allows for the creation of arbitrary static sites, ranging from simple blogs to fully featured e-commerce websites. It provides [an API](https://www.gatsbyjs.org/docs/node-apis/) for you to build and query a custom GraphQL API composed of data from a variety of sources. You can then dynamically compose your static website based on the results of your queries. Gatsby trades power and flexibility for complexity, requiring it users to learn some new tools to leverage it's capabilities. Let's get into the nitty gritty details.

## Getting Up and Running

Both platforms are fairly easy to get from `yarn install` to writing blog articles, though Hexo definitely excels in thus regard.

### Hexo

With Hexo, I was able to install the application, run a couple [configuration commands](https://hexo.io/docs/setup), pick a [theme from their website](https://hexo.io/themes/index.html), and get writing.

### Gatsby

Gatsby was not exactly hard to setup, but the sheer volume of documentation on their website made the process a tad more challenging. There are two places you can start: their [getting started page](https://www.gatsbyjs.org/docs/) or [their tutorial](https://www.gatsbyjs.org/tutorial/). The former will help you get a server up and running and will link you to the [starter library](https://www.gatsbyjs.org/starters/?v=2) where you can choose from many potential themes. The latter will teach you how to customize your website.

## Developer Tooling

Hexo does not provide any tooling out-of-the-box, and your experience is largely determined by your theme. Gatsby, in contrast, tries to give the developer as many tools as possible to optimize their productivity.

### Hexo

When I began with Hexo, I picked a theme called Concise, and my experience mostly stems from customizing this theme, though in my journey, I delved quite deeply into Hexo source code (which should be telling) and into the plugin ecosystem.

My theme happened to be written using a dated templating language called [EJS](https://ejs.co/). In it's effort to support all of Javascript's features, EJS excels at making code challenging to read and edit. Here is some sample code from the theme I used.

![Code sample from Concise](./concise-code.png)

Apart from the obvious readability problems, the syntax is at odds with application discoverability. It makes trivial exercises like console logging error-prone. Furthermore, the syntax is completely incompatible to the modern formatting tool, [prettier](https://prettier.io/).

Hexo does allow for other templating languages, but it's a shame that a developer's experience is so tightly coupled to the theme they pick.

### Gatsby

Gatsby shines as far as developer tooling goes. All Gatsby applications are built using [React](https://reactjs.org/) and [GraphQL](https://graphql.org/). Both are a pleasure to work with and were immediate productivity boosters for me. They do, however, have a non-trivial learning curve. Fortunately, the Gatsby docs do a decent job assuming you know nothing about how they work. And realistically, you only need minimal understanding to be productive, since ultimately most of your code will be Javascript.

There is also a non-trivial investment required in understanding the aforementioned [Gatsby API](https://www.gatsbyjs.org/docs/node-apis/). It's incredibly powerful but also not immediately obvious how to use. I was able to supplement the documentation with blogs/tutorials such that the learning requirements were manageable.

Gatsby also comes with numerous developer tools preconfigured to optimize your productivity. For example, [GraphiQL](https://github.com/graphql/graphiql) (more on this later) allows you to explore the various data sources, prettier ensures that your code remains consistently formatted, code is hot reloaded, and [ESlint](https://eslint.org/) is to catches your mistakes.

Behind the scenes, Gatsby configures webpack for you, ensuring that some of the most challenging parts of the React ecosystem are abstracted away. It goes to extra mile and make things like service workers, inlining critical CSS, and CSS modules are automatic or a plugin away. Here is a more extensive list of its [features](https://www.gatsbyjs.org/features/).

## Documentation

### Hexo

Hexo does a great job of ensuring you need to read as little text as possible in order to get a blog up and running. Once you want to start customizing your blog, however, the documentation's previously appreciated brevity shows it's warts. It's not uncommon to be looking at the right thing and not know what you're looking at. If you want to customize your theme, chances are this page will be your best friend (https://hexo.io/docs/variables.html). Unfortunately, the page makes absolutely no indication as to its purpose. For the record, it documents the variable names that are injected into your template engine's rendering system.

### Gatsby

Gatsby's documentation is thoughtful, well-organized, and remarkably detailed. It has everything from [tutorials](https://www.gatsbyjs.org/tutorial/) to deep dives [1](https://www.gatsbyjs.org/docs/adding-images-fonts-files/)[2](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/)[3](https://www.gatsbyjs.org/docs/styling/). The last link is a collection of deep dives all about styling! It even has pages explaining and justifying [architecture and implementation details](https://www.gatsbyjs.org/docs/behind-the-scenes/). And to top all this off, it has a [style guide](https://www.gatsbyjs.org/docs/gatsby-style-guide/) to ensure readability. With all this said, there are still placeholder pages ([like this one](https://www.gatsbyjs.org/docs/dropping-images-into-static-folders/)), though I never found myself unable to answer a question about their system.

## API Discoverability

A static site generator needs to make it easy to edit your website. One of the first requirements to editing your site is understanding the data structures the static site generator makes available to you.

### Hexo

Hexo's variables are documented in the link mentioned above. Inside, many key topics are ambiguously referenced but never expounded upon. I remember agonizing over providing support for both pagination and article excerpts.

The variables link above seems to hint that the next and previous blog posts are available from their API, though the fields were always `undefined`. I never figured out why.

The same page also suggests excerpts are available. It wasn't until I discovered this [GitHub issue](https://github.com/hexojs/hexo/issues/1143) where I learned it's required to add the comment `<!-- more -->` to each post to ensure that this excerpt is populated. This feature is otherwise undocumented.

These documentation problems were exacerbated by EJS, which doesn't provide an environment conducive to rapid code changes for environment exploration.

### Gatsby

Gatsby exquisitely solves the problem of discoverability with [GraphiQL](https://github.com/graphql/graphiql). It automatically spins up a GraphiQL server which allows you to interactively browse the GraphQL associated with your data. You can see what fields exist and how they are structured. You can even experiment with queries, and the environment provides feedback included autocomplete and errors messages. Here is a simple example of me querying article excerpts and titles:

![graphiql.png](GraphiQL Example)

You can see the query on the left, the results in the middle, and the schema documentation on the right. The contrast with Hexo's variable page is stark.

## Gatsby

Gatsby absolutely crushes Hexo in this category.

## Community

How easy it to solve issues using tutorials and stack overflow? Are small issues blocking or not? What is the plugin ecosystem like?

## Plugin Ecosystem

### Available Plugins

Hexo has a [plugin page](https://hexo.io/plugins/index.html) detailing links to everything from markdown parsers to image and css optimizers. There are 277 plugins available, and I never ran into a situation where I couldn't find a plugin to do what I needed.

Gatsby has a similar [plugin search system](https://hexo.io/plugins/index.html) with seemingly everything you could want. Gatsby has 550 plugins available to date, though it's not clear to me how much value this for most users over Hexo. I suspect there are plugins for more specific use cases that Hexo might lack; I also know there are quite a few plugins that solve the same problem.

The one thing Gatsby does that really helps the developer identify solid plugins is that they sort their search results based on downloads. This is a primitive but effective metric for evaluating the quality of a given plugin.

### Applying Plugins

Hexo has a fairly opaque system for applying plugins. It simply looks at the name of all installed packages, and if their name begins with (it might be includes) to string `hexo`, then they are treated as a plugin and evaluated specially.

Every Gatsby project comes with a `gatsby-config.js` file where all used plugins documented and their associated arguments are applied. I felt like this system was far far superior to Hexo's implicit application of plugins.

## Misc

One thing I didn't know before I nearly completed my Gatsby blog is that even after building, it is not completely javascript free! This isn't to say the site is not fast; it excels in every performance test I've looked at so far. But your site will nevertheless not run on the machines of users who do not have javascript enabled.

## Conclusion

Hexo are Gatsby are different products. If you're interested in picking a theme, spinning up a blog, and barely touching it, Hexo might be a simpler choice. If, however, you want flexibility and productive developer experience, Gatsby overshadows Hexo in nearly ever way.

Gatsby

Simple things are far more complicated. Adding static pages is simple. Rendering them from markdown is quite a bit of work. Hexo is far more opinionated in this regard and makes such options simple.
