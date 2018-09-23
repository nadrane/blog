---
title: The Hidden Costs of PostgreSQL's JSONB datatype
date: 2018-09-16 15:41:16
categories:
  - [Postgres]
---

One of my clients approached me the other day with a performance problem. The CTO explained that queries over the `message` had deteriorated over time and were now slow. He further explained to me that the queries were only slow when a particular JSONB column was included in the result set. I set off to resolve to problem, eager to discover the cause

## Background

At Fraight, we've built a centralized communication platform that collates all inbound/outbound communication between our brokerage company and thousands of trucking partners. Each communicate exchange is stored in the `message` table. This includes text messages, emails, and faxes.

At Fraight, we're trying to automate this communication process between our organization and our partners. We recognize that it's essential to capture the details of our conversation if we ever hope to have machine's extract meaningful inferences from inbound messages. This means that we store EVERYTHING we get from our third party APIs. We have a meta `JSONB` column in the `message` table where we're dumping entire http bodies in their from services like Twilio, Mailgun, and Phaxio, knowing that this data will prove useful in the future.

This initial schema was a pragmatic design decision. We knew it wasn't worth the engineering effort to try to understand the multitude of fields we receive from various third party APIs, particularly when we had no idea at the time how we might use this information. But we did know it was valuable, and we wanted it to be queryable/accessible, hence why we chose JSONB over it's more inert size efficient  cousin, JSON.

## Discovery

Determining the root cause was relatively simple. A couple queries revealed that the JSONB column, which we had named `meta`, revealed that the column was often quite large:

```SELECT avg(octet_length(t."meta"::text))
FROM message AS t
where octet_length(t."meta"::text) is not NULL;```

The average size (I wasn't sure how to grab a median in Postgres) is 3.7 kb. That might not seem large, but it's actually 400mb when you're talking about 100,000 rows. And at high end of the spectrum, some message's are up to 17mb in size. The precise details of why this dataset slows down queries are a bit arcane, but the fact of the matter is that we were misuing the JSONB datatype. [here](https://www.postgresql.org/docs/9.5/static/storage-toast.html) for more information.

## Solutioning

At the beginning, queries that used the `meta` column were for very simple taks like showing the raw contents of an email to a user, perhaps in the case where message content extraction failed. Overtime we had begun using select fields from the `meta` column to drive business logic. Overtime, we began to dsicovery this data, understand it, and begin using it, expecting that it would conform to a specific structure and schema. This presented a conundrum.

The most obvious and straightforward solution was to start omitting the `meta` column from all queries, except those that strictly needed it. 

This is a very simple bandaid to a relatively opaque performance problem, but it hides a more serious concern. 

These fields probably should have been their own atomic fields in our `message` schema, but the conversion wasn't simple anymore. We couldn't simply change our code to save off this field, since numerous other parts of the codebase relied on it's existence in the `meta`JSON data structure. 

We discussed a variety of potential solutions. One included storing the metadata in MongoDB. We could still keep the data unstructured but queryable without having it affect the performance of other queries.







