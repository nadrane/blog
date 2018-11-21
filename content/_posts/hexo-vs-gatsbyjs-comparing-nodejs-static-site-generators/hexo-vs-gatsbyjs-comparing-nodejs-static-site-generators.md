---
title: GatsbyJS Vs. Hexo Comparing Node.js Static Site Generators
date: 2018-11-18
categories: [Node.js Ecosystem]
---

If you've made your way here, I assume your looking to build yourself a blog or a static website. I also assume that you're a developer and want the flexibility the customize your site. If you're instead looking for an out-of-the-box solution, I suggest you look at a blogging platform like [Medium](https://medium.com/) or, if you want a little more customizability, perhaps [Wordpress](https://wordpress.com/)

There are two major static site generators in the Javascript ecosystem: the incumbent [Hexo](https://hexo.io) and the up-and-coming [GatsbyJS](https://www.gatsbyjs.org/). In case you're just here for a TL;DR, GatsbyJS is the far better option. This site was originally built with Hexo, but I've recently felt compelled to switch. Let's talk about why.

<!-- more -->

## Different Products

First and foremost, I want to elaborate on what Hexo and Gatsby are designed to do. Both are static site generators, but at their hearts, at their hearts, they are very different products: Hexo is a blog generator; Gatsby sophisticated static content creation platform.

### Hexo

Hexo specializes in creating markdown file driven blogging websites (with maybe a handful of non-blog pages). This specialization comes with tradeoffs. It's very easy to get a blog up and running, but if you want to do anything more sophisticated, it will range from challenging to impossible. This is fine for most people's use cases, however.

### Gatsby

Gatsby epitomizes customizability and allows for the creation of arbitrary static sites, ranging from a simple blog to a fully featured e-commerce websites. It provides [an API](https://www.gatsbyjs.org/docs/node-apis/) for you to build a custom GraphQL API composed of data from a variety of resources, and then it affords you the flexibility to query that API however you like to dynamically compose your static website based on its data. There's obviously tradeoffs here as well. You might be given a lot of power, but that also requires learning some new tools. Let's get into the nitty gritty details.

## Getting Up and Running

Both platforms are fairly easy to get from `yarn install` to writing blog articles, though Hexo definitely wins in this category.

### Hexo

With Hexo, I was able to install the application, run a couple [configuration commands](https://hexo.io/docs/setup, pick a [theme from their website](https://hexo.io/themes/index.html), and get writing.

### Gatsby

Gatsby was not exactly hard to setup, but the sheer volume of documentation on their website made the process a tad more challenging. There are two places you can start: their [getting started page](https://www.gatsbyjs.org/docs/) or [their tutorial](https://www.gatsbyjs.org/tutorial/). The former will help you get a server up and running and will link you to the [starter library](https://www.gatsbyjs.org/starters/?v=2) where you can choose from many potential themes. The latter will teach you how to customize your website; this is where Gatsby really shines.

## Developer Experience

The rest of this article is going to discuss various facets of the developer experience modifying a site built with Hexo/Gatsby.

## Developer Tooling

What does the process of modifying code look like? What tooling is provided out of the box?

### Hexo

When I began with Hexo, I picked a theme called Concise, and my experienced mostly stem from customizing this theme, though in my journey's, I delved quite deeply into Hexo source code (which should be telling) and into the plugin ecosystem.

My theme happened to be written using quite dated technology. My primary complaint is that it’s templating language is [EJS](https://ejs.co/), which was an absolute nightmare to read. Here is some sample code from Concise.

![Code sample from Concise](./concise-code.png)

Apart from being unreadable (and certainly hard to edit), this syntax is at odds with application discoverability. It makes trivial exercises like console logging prone to error. Furthermore, the syntax is completely incompatible to the modern formatting tool, [prettier](https://prettier.io/).

Hexo does allow for other templating languages, but it's lack of standardization (and age) allowed for the use of EJS in the first place.

### Gatsby

Gatsby shines as far as developer tooling goes. All Gatsby applications are built using a modern tool chain including [React](https://reactjs.org/) and [GraphQL](https://graphql.org/). Both are a pleasure to work with and were immediate productivity boosters for me.

Both of these tools do have a non-trivial learning curve, though the Gatsby docs do a decent job assuming you know nothing about how they work. And realistically, you don't need to understand either well to achieve productivity, since ultimately most of your code will be Javascript.

There is also a non-trivial investment required in understanding the aforementioned [Gatsby API](https://www.gatsbyjs.org/docs/node-apis/). It's incredibly powerful but also not immediately obvious how to use. I was able to supplement the documentation with blogs/tutorials such that the learning requiremnts were manageable.

Gatsby also comes with numerous developer tools preconfigured to optimize your productivity. For example, a [GraphiQL](https://github.com/graphql/graphiql) (more on this later) is there to allow you to explore the data models of your various data sources, prettier is automatically configured ensuring that your code remains consistently formatted, code is automatically hot reloaded, and [ESlint](https://eslint.org/) is configured to catch your mistakes.

Behind the scenes, Gatsby configures webpack for you, ensuring that some of the most challenging parts of the React ecosystem are abstracted away. It goes to extra mile and make things like service workers, inlining critical CSS, and CSS modules are automatic or a plugin away. Here is a more extensive list of its [features](https://www.gatsbyjs.org/features/).

Gatsby easily wins this competition.

## Documentation

## Hexo

Hexo does a great job of ensuring you need to read as little text as possible in order to get a blog up and running. Once you want to start customizing your blog, however, the documentation's previously appreciated brevity shows it's warts.

It's not uncommon to be looking at the right thing and not know what you're looking at. If you want to customize your theme, chances are this page will be your best friend (https://hexo.io/docs/variables.html). Unfortunately, the page makes absolutely no indication as to its purpose. For the record, it documents the variable names that are injected into your template engine's rendering system.

Many key topics are ambiguously referenced but never expounded upon. I remember agonizing over providing support for both pagination and article excerpts. The variables link above seems to hint that the next and previous blog posts are available from their API, though the fields were always `undefined`. I never figured out why. The same page also suggests excerpts are available. It wasn't until I discovered this GitHub issue that I learned it's required to add the comment `<!-- more -->` to each post to ensure that this excerpt is populated. There is no sensible default like grabbing the first 150 characters.

## Gatsby

Gatsby's documentation is thoughtful, well-organized, and remarkably detailed. It has everything from [tutorials](https://www.gatsbyjs.org/tutorial/) to deep dives [1](https://www.gatsbyjs.org/docs/adding-images-fonts-files/)[2](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/)[3](https://www.gatsbyjs.org/docs/styling/). The last link is a collection of deep dives all about styling! It even has pages explaining and justifying [architecture and implementation details](https://www.gatsbyjs.org/docs/behind-the-scenes/). And to top all this off, it has a [style guide](https://www.gatsbyjs.org/docs/gatsby-style-guide/) to ensure readability. With all this said, there are still placeholder pages ([like this one](https://www.gatsbyjs.org/docs/dropping-images-into-static-folders/)), though I never found myself unable to answer a question about their system.

Also, I would be remiss if I didn't discuss [GraphiQL](https://github.com/graphql/graphiql) here. Gatsby automatically spins up a GraphiQL server which allows you to interactively browse the GraphQL associated with your data. You can see what fields exist and how they are structured. You can even experiment with queries, and the environment provides feedback included autocomplete and errors messages. The contrast with Hexo's variable page is stark.

Gatsby absolutely crushes Hexo in this category.

## Community

How easy it to solve issues using tutorials and stack overflow? Are small issues blocking or not? What is the plugin ecosystem like?

## Plugin Ecosystem

### Available Plugins

Hexo has a [plugin page](https://hexo.io/plugins/index.html) detailing links to everything from markdown parsers to image and css optimizers. There are 277 plugins available, and I never ran into a situation where I couldn't find a plugin to do what I needed.

Hexo has a fairly opaque system for applying plugins. It simply looks at the name of all installed packages, and if their name begins with (it might be includes) to string `hexo`, then they are treated as a plugin and evaluated specially.

### Gatsby

Gatsby has a similar [plugin search system](https://hexo.io/plugins/index.html) with seemingly everything you could want. Gatsby has 550 plugins available to date, though it's not clear to me how much value this for most users over Hexo. I suspect there are plugins for more specific use cases that Hexo might lack; I also know there are quite a few plugins that solve the same problem.

The one thing Gatsby does that really helps the developer identify solid plugins is that they sort their search results based on downloads. This is a primitive but effective metric for evaluating the quality of a given plugin.

Every Gatsby project comes with a `gatsby-config.js` file where all used plugins documented and their associated arguments are applied. I felt like this system was far far superior to Hexo's implicit application of plugins.

## Misc

One thing I didn't know before I nearly completed my Gatsby blog is that even after building, it is not completely javascript free! This isn't to say the site is not fast; it excels in every performance test I've looked at so far. But your site will nevertheless not run on the machines of users who do not have javascript enabled.

## Conclusion

Hexo are Gatsby are different products. If you're interested in picking a theme, spinning up a blog, and barely touching it, Hexo might be a simpler choice. If, however, you want flexibility and productive developer experience, Gatsby overshadows Hexo in nearly ever way.

Gatsby

Simple things are far more complicated. Adding static pages is simple. Rendering them from markdown is quite a bit of work. Hexo is far more opinionated in this regard and makes such options simple.
