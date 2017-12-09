---
title: 'Scraping the Web With Puppeteer: Lessons-learned'
categories:
  - - Javascript
  - - Web Scraping
date: 2017-12-09 15:35:13
---


I'm currently contracted to create a web service using some data from a third party Angular application. I worked off a proof of concept codebase that used Chrome's new [Puppeteer](https://github.com/GoogleChrome/puppeteer) API to scrape this site. I strongly regret not starting from scratch.

## What is Puppeteer?

Puppeteer is a Node API that allows you to control Google's headless Chrome browser. Imagine a version of your browser that can send and receive requests but has no GUI. It works in the background, performing actions as instructed by an API. This makes Puppeteer great for end to end testing a web application. You can truly simulate the user experience, typing where they type and clicking where they click. Another use case for Puppeteer is web scraping a single page web application. Let's explore how this might work.

## A Simple Example

For any Puppeteer project, the first task is to create an instance of the headless browser.

```js
const browser = await puppeteer.launch()

// We will use this page instance and it's API frequently
const page = await this.browser.newPage();
```

After that's done, it's trivial to navigate to and begin interacting with a webpage. Let's suppose I want to fill out a login form and submit an authentication request to a website. In an ideal situation, it looks like this.

```js
// Navigate to the website
await page.goto("https://website/login");

// Provide the selector of an input box and the content to type
await page.type("input#username", CREDENTIALS.username);
await page.type("input#password", CREDENTIALS.password);
await page.click("button#login"); // Click the login button

// Wait until the screen changes and a node matching
// the selector #logged-in-successfully appears,
// at which point we know the login was successful
await page.waitForSelector("#logged-in-successfully");
```

We just successfully filled out a form, submitted an HTTP request containing our form data, and waited for the page to change upon successful login. This is where Puppeteer shines. Let's look at a more complicated example.

## A More Complicated Example

Today's web uses a mix of simple html driven forms as well as more complicated, javascript-driven forms, rich with functionality like autocomplete and dynamic dropdown menus. I'm sure you've used a calendar date picker. These components each need to be treated differently.

Here is a modified version of some code I wrote for my client:

```js

// The form inputs I want to fill out
// and their corresponding selectors
const fields = {
  type: 'input[ng-model="type"]',
  origin: 'input[ng-model="origin"]',
  destination: 'input[ng-model="destination"]',
  date: 'input[ng-model="date"]'
};

function search(searchParams) {
  const page = await this.browser.newPage();
  await page.goto("https://website/search");

  // We need to click a button to make the search form
  // appear, but first make sure that button has rendered
  await page.waitForSelector(".new-search");
  await page.click(".new-search");

  // Fill out the form
  for (const field of Object.keys(fields)) {
    if (searchParams[field]) {
      const selector = fields[field];

      // We want to make sure each DOM node is rendered
      // before we try to do anything to it.
      await page.waitForSelector(selector);

      // Some inputs need to be focused first for page.type to work
      // Might as well focus on all of them
      await page.focus(selector);

      // Some inputs have defaults that need to be
      // erased before typing your own input
      if (field === "date" || field === "type") {
        // This is a helper function I wrote
        await deleteInput(page, selector);
      }

      await page.type(selector, searchParams[field]);

      // This field won't register the typed data
      // until Enter is pressed.
      // This is because the 'type' field is a dropdown
      // where one of a specific set of inputs must be clicked.
      if (field === "type") {
        await page.keyboard.press("Enter");
      }
    }
  }
}
```

The first thing to notice is that the code is messy and full of weird exceptions. To make matters worse, it doesn't always work.

## Brace Yourself for Flaky Behavior

Working with Puppeteer was an exercise in guesswork. Given the same inputs, Puppeteer did not always produce the same outputs<sup>[1](#footnote1)</sup>. This flaky behavior made the project unnecessarily challenging and required me to do additional engineering to increase reliability, which was frustrating considering the alternative.

## Puppeteer Was Completely Unnecessary

Puppeteer has a API that allows you to execute arbitrary code against the DOM. After scraping form results with this API and getting the same flaky behavior described above, I ditched the approach and started grabbing data from the HTTP response objects themselves. Below is a primitive version of some code I wrote to do this.

```js
waitForUrl(page, urlPrefix) {
  return new Promise(resolve => {
    page.on("response", res => {
      if (!res.url.startsWith(urlPrefix)) {
        return;
      }
      resolve(res.json());
    };
  });
}
```

The page passed into this function is the same page object created above by the Puppeteer API. Among other things, it is an event emitter that allows me to listen for any HTTP responses. I've essentially created a promise that resolves to the response body of a particular ajax request. This allowed me interact with the server API directly and removed the DOM from the data retrieval process, greatly reducing the chance for flaky behavior. But that begs the question, why use Puppeteer at all? Why not simply send http requests to the server API manually and ditch the complicated form submission code above That's how I should have started all along.

## When is Puppeteer the Right Solution

I can only think of a single scenario where using Puppeteer for scraping is superior to the alternative: if the information you want is generated using a combination of API data and javascript code. After all, you would have no other way to simulate the javascript code without rewriting it.

If, however, all you need is data from the server, go the simple route and hit the API with an HTTP library like [axios](https://github.com/axios/axios) or [request](https://github.com/request/request). If you are scraping a server side rendered application, you can combine one of the aforementioned tools with [Cheerio](https://github.com/cheeriojs/cheerio), giving you a far more user friendly DOM manipulation API than that offered my Puppeteer.

#### Footnotes
<a name="footnote1">1</a>: You might be curious why Puppeteer exhibited flaky behavior. One issue that I ran into was  animations. I might attempt to click a DOM node, but if the animation had not finished, the click would not register. In essence, it would appear as if the click had worked, but once the animation finished, the DOM would reset itself, undoing my click. I think this is simply how Angular's digest loop reacted to a click at an unexpected time. Unfortunately, Puppeteer provides no functionality to determine when an animation has finished (after all, how would it!). I tried a couple solutions. One entailed a sleep function to wait a couple hundred milliseconds for the animation to finish, but it simply exacerbated the flaky behavior. A second involved executing the click only once the DOM node had a particular class that indicated the animation had finished. At one point, I even tried to disable all animations across the website. All these solutions were half-baked.