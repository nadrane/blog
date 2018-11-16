---
title: "Optimizing Elasticsearch Score: How to Rank and Differentiate Similar Records"
date: 2017-10-11
categories:
  - [Elasticsearch]
---

At Fraight, we have an [Elasticsearch](https://www.elastic.co/) backed search interface that allows users to type a freetext query and get a list of database records sorted by relevancy. At it's core, this is a simple problem: if the user types in `Joe`, return all people whose name contains the word `Joe`. And indeed, returning all the `Joe's` in the system is trivial; the problem is that we work with hundreds of `Joes`. We needed a way to return the particular `Joe` that the user cares about.

<!-- more -->

## A Poor Solution

When I worked at [Epic](https://www.epic.com/), we had a search interface that allowed us to look up patients by name, and it suffered the exact same problem described above. Epic solved this problem by providing additional fields like birthdate or address and used this additional identifying information to pare down the search results. This solution slows down the user's workflow and can be done better.

## Our Solution

At Fraight, we created a solution that just works. The user enters a name, and the system returns 5-10 results, and more often than not, the first two results contain the record the user is looking for. Here's how we did it

We needed to customize the score that Elasticsearch calculates for each matched record. For the uninitiated, Elasticsearch's score is an indicator of the relevancy of a particular search result. Prior to our scoring customizations, given a query for a name, Elasticsearch would pare down a dataset of ~100,000 to ~100, but each of the 100 search results would have the same score! Here's how we customized our the Elasticsearch scoring system so that we could more accurately sort the 100 results based on relevancy.

## Custom Scoring

We settled on two attributes that should influence the score of a particular partner:

1. How often we interact with a partner
2. How recently we've interacted with a partner

It's important to know that we have worked with most of the partners in our system minimally. We needed to remove this noise from the search results. Phrased differently, if we regularly work with a particular `John Doe`, we want that partner to appear above all the other `John Doe`s in the search results.

Similarly, if we have recently interacted with a particular partner, there's a good chance we will interact with them again soon. It's important, however, to consider the time since our last interaction. If we interacted with someone yesterday or the day before, it's very important to rank them higher than an organization we interacted with 10 days ago.

## Getting the Data

Both of these scoring strategies required us to populate Elasticsearch with information detailing the recency and volume of our interactions with each partner. We were lucky to that we already tracked these data points using a change [data capture system](https://en.wikipedia.org/wiki/Change_data_capture). All we needed to do was write a quick database migration. Lastly, we needed to ensure that any changes to the primary datastore would sync with Elasticsearch.

## Custom Scoring Implementation

Elasticsearch provides [function score queries]https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-field-value-factor), a syntax for simple (and sometimes quite [complex](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-decay)) modification of Elasticsearch's calculated score. The first link multiplies the score by a constant factor times the square root of another field. The second link showcases using the score in a decay function. We need a little more customization and opted to use Elasticsearch's [script score](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-script-score) functionality to write our own scoring function.

We wanted our ultimate score to be a function of three values:

1. The score returned from elasticsearch
2. Our total interactions with a partner
3. The number of days since our last interaction with a partner

### Initial Attempt

In our first iteration, however, we only considered the first data points. Our scoring function looked like this.

`newScore = _score * sqrt(numInteractions + 1)`

Here was our thought process. We wanted partners we worked with a lot of interactions to rise to the top of the search results. The square root tempers the affect of the `numInteractions` on the score, and the `+1` was to ensure that for partner where `numInteractions` is 0 that we didn't make the `newScore` equal to 0.

### Introducing an Upperbound

The above solution resulted in an overwhelming preference towards certain partners. In realty, we do not value more highly a partner with whom we've interacted 1000 times any more than a partner with whom we've interacted 100 times. Taking this feedback into account, our new scoring function looked like this:

`newScore = _score * (numInteractions > 100 ? 2 : 1)`

We effectively created a step function where the original `elasticsearch` score is either doubled or left unchanged. This creates an upperbound of the amount that `numInteractions` can influence the resulting score. Originally, we had discussed more complicated techniques like [logistic functions](https://en.wikipedia.org/wiki/Logistic_function), but this strategy has worked fine.

### Incorporating Time

I mentioned above that when we form a new partnership, there's a good chance we will interact with that partner again soon. The above scoring strategy will push out these newer partners (since we've interacted with them fewer than 100 times), favoring those we've worked with frequently, even if we haven't talked to those partners in months.

Ultimately, we wanted our function to double the original score if we've interacted with a partner in the past 3 days. Afterwards, we wanted the score contribution to decay, such that the original score would be unchanged after 45 days of not interacting with a partner.

Let's take a detour to highschool math to derive this function. We want a function that passes through following points:

`(45, 1)` and `(3, 2)`

Using the point slope formula, we get

`2 - 1`
/
`3 - 45`

(could be some density/decay function that looks at density of interactions over time)

### Other Domains

You can apply these techniques  to many other domains.

For example, I suspect that hospital staff are more likely to look up patients who have upcoming appointments, a same-day appointment, or who have recently finished an appointment. You could write a function like the one we used to factor in the recency of interaction with our partners

Or suppose you run an event website or Ticketmaster Eventbrite. I'm sure there's a correlation between the how soon an event is and how much user's care about it. You could write a scoring function that leverages this knowledge.

_If you have search problems, I do [consulting](/hire-me) work and am currently looking for new clients. Please [contact me](mailto:nick@nickdrane.com) for more details._