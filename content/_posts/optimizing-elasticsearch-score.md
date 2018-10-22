---
title: 'Optimizing Elasticsearch Score: How to Rank and Differentiate Similar Records'
date: 2017-10-11
categories: [Elasticsearch]
---

A client approached me with a puzzling problem:

At Fraight, we have an omnisearch interface backed by an Elasticsearch datastore. The interface allows users yo type a freetext query and get a list of database records sorted by relevancy. At it's core, this is a simple problem: if the user types in `Joe`, return all people whose name contains the word `Joe`. And indeed, returning all the `Joe's` in the system is trivial; the problem is that we worked hundreds, possibly even thousands of `Joes`. How do we identify the particular `Joe` that we care about?

<!-- more -->

## A Poor Solution

When I worked at [Epic](https://www.epic.com/), we had a similar problem. We had a search interface that allowed us to look up patients. Unfortunately, our full names are not as unique as we like to believe, and a simple query for `Luke Smith` would surely bring the system to a halt. Epic solved this problem by providing additional fields. That's why (along with HIPPA reasons), when you call the doctor, they might ask for your birthdate or your address; this additional identifying information is used to pare down the search results. This solution is slow, cumbersome and was deemed wholly inadequate for us.

## Fraight's Solution

We settled on two attributes that should influence the score of a particular record:

1. How often we interact with an entity
2. How recently we've interacted with an entity

It's important to know that most of the trucking organizations in our system have been worked with minimally. We needed a remove this noise from the search results. Phrased differently, if we regularly work with a particular `Great America Truckers` more than the other 1000 `Great America Truckers`, we want our partner to appear higher in the search results.

Similarly, if we have recently interacted with an organization, there's a good chance we will need to interact with them in the future. For example, if we've just initiated a conversation with a new business partner, there's a good chance we will continue interacting with them regularly in the near-term. It's important, however, to consider the time since our last interaction. If we interacted with someone yesterday or the day before, it's very important for them to be ranked higher than an organization we interacted with 10 days ago.

## Getting the Data

Both of these solutions require populating our database with information regarding how recently we've interacted with particular entities. Fortunately, all of this can be done during the data ingestion phase when records are loaded in Elasticsearch. The only requirement is making sure to keep the information in Elasticsearch up to date with our PostgreSQL database

The one challenge with this solution is that it requires augmenting our documents with special data regarding total interactions and recency of interactions. The huge advantage, however, is that it works seamlessly. We don't require there to be any special configuration when we begin working with a new partner.

## Function Score Queries

Elasticsearch provides [function score queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html) that allow you to modify Elasticsearch's calculated score. Their documentation provides a really simple example explaining boost the relevancy of a document that has many `likes`:

```JSON
GET /_search
{
    "query": {
        "function_score": {
            "field_value_factor": {
                "field": "likes",
                "factor": 1.2,
                "modifier": "sqrt",
            }
        }
    }
}
```

This code says that every document's score will be `sqrt(1.2 * doc['likes'].value)`

We used a particular kind of Function Score Query known as a [Script Score](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-script-score).

We wanted our ultimate score to be a function of three values: the score returned from elasticsearch, the days since our last interaction, and our total interactions. Initially, our function looked something like this

`newscore` = \_score _ doc['interactions'] _

We found that Elasticsearch's relevancy score was being overwhelmed by parters with a high number of interactions, so much so that given a search term of `nick drane`, we might return `nick smith`, simply because we've worked with nick smith more.

We needed to place an upperbound of the potential contribution of the total interactions. After initially looking at [logistic functions](https://en.wikipedia.org/wiki/Logistic_function) and other overly complicated strategies, we settled on a simple step function. If the number of interactions is greater than 25, then we multiply Elasticsearch's relevancy score by 2, otherwise we multiply it 1.

The frequency contribution's function was similarly simple.

(could be some density/decay function that looks at density of interactions over time)

## challenges

Keeping the extra attributes up to date

We did try to combine two guassian curves but couldn't get it working

Sometimes was built using a `query_string` query against the `_all` field. Sometimes the returned results were good, but most of the time they fell short. Their problem was simple: how do we ensure that the

health care
select based on recent claim
select based on scheduled appointment
select based on upcoming event
specify table to search
