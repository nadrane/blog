---
title: The Hidden Costs of PostgreSQL's JSONB Datatype
date: 2018-09-30
categories:
  - [Postgres]
  - [Architecture]
---

[Postgres](https://www.postgresql.org/) introduced the [JSONB](https://www.postgresql.org/docs/current/static/datatype-json.html) type in version 9.4 with considerable excitement. JSONB promised to marry a favorite relational database with the noSQL world, permitting data to be stored in the database as JSON without the need for re-parsing whenever a field is accessed. Moreover, the binary storage format permits indexing and complex queries against the stored JSON blobs. This data format embodies the flexible schema and was readily adopted at [Fraight](https://fraight.ai/).

<!-- more -->

## Background

At Fraight, we've built a centralized communication platform that collates all inbound/outbound communications between our brokerage company and thousands of trucking partners. One of our main objectives is to build a system that parses and automatically responds to inbound text messages, emails, and faxes. We knew we would eventually need the nitty-gritty details of these messages, so we captured the data by dumping entire http response bodies into a JSONB column named `meta` in our database’s `message` table.

In an ideal world, the third party API responses we collected would have been broken down into discrete chunks and stored in separate columns, but our approach was a pragmatic design decision. We knew it wasn't worth the engineering effort to try to understand the multitude of fields we receive from a half-dozen APIs, particularly when we had no idea at the time how we might use this information. But we did know it was valuable. And since we wanted it to be queryable, we chose JSONB over it's more inert and sometimes more size efficient cousin, the JSON datatype.

## Discovery

Fraight’s CTO approached me the other day and explained that query performance over the `message` table had deteriorated. He elaborated that the queries were only slow when the `meta` column was included in the result set. We had previously experienced slowdown in the `message` table when entire email attachment bodies were getting serialized and stored in the `meta` column, and I suspected that the root cause of our current performance problem was in a similar vein. A quick [query](#footnote1) revealed that our `meta` column was often quite large.

The average size of the `meta` column was 3.7 kb. That might not seem large, but for our 100,000 row table, that meant 400mb of (mostly unused) metadata. At the high end of the spectrum, some messages were up to 17mb in size. The precise details of why this dataset slows down queries are a bit esoteric<sup>[2](#footnote2)</sup>, but it was clear that we were storing too much information. You can read more about how Postgres stores large data values using [TOAST](https://www.postgresql.org/docs/current/static/storage-toast.html).


## Further Complications

The first queries against the `meta` column were for very simple tasks like showing the raw contents of an email to a user, perhaps in the case where message content extraction failed. Over time we began using specific fields to drive business logic, and our application code started to expect that `meta`'s JSON would adhere to a specific shape. Any proposed solution would likely necessitate changes to this application code.

So the problem was twofold:

1. We needed to extract the actual metadata (as opposed to fields that drove business logic) from the `meta` column and place it in a location where it would not affect query performance over the `message` table.

2. We wanted to make the metadata less easily accessible. We recognized that making it accessible through the ORM made it ripe for misuse. We wanted to give it an alternative API that would lessen a developer's likeliness to rely on its structure.

## Solutioning

We looked at several solutions. Below are the three we considered most seriously:

1. Use the ORM to omit the `meta` column from all queries unless specifically included. Since we unnecessarily perform `select *` queries over the `message` table, this strategy, despite its messiness, would increase the performance in most cases (with the occasional slow query when metadata was actually required) and would in theory be simple to implement. It wouldn't, however, resolve our initial design shortcut.

2. Keep the `meta` column as-is but extract specific keys to [S3](https://aws.amazon.com/s3/). In general, greater than 99% of the size of any given column's `meta` field was from a single key. For example, many of the emails we capture include large attachments. Other times message bodies retain long, historical email chains. By extracting these problematic fields and uploading them to S3, the database would only need to store a reference to the S3 content. Then, upon request, the server could generate a [pre-signed URL](https://docs.aws.amazon.com/AmazonS3/latest/dev//ShareObjectPreSignedURL.html), allowing the client to download large files directly from S3.

3. Create a separate `metadata` table in Postgres. It would have a foreign key back to the original table where the metadata belonged. This solution solves the `select *` problem described above and offers an additional advantage: since the `meta` column pattern exists on more than just the `message` table, it offers a unified strategy for storing metadata.

Our instinct was to go with #1 — the most simple and straightforward solution — and omit the `meta` column from most queries. Unfortunately, bugs in our ORM made it impossible to omit columns across joins without the occasional crash. We needed an alternate approach.

This hiccup left the choice between S3 and a separate Postgres table. We agreed that pre-signed S3 URLs offered an ideal long-term alternative but ultimately chose a separate Postgres table for the same reason that we wanted to choose option #1: minimal risk and complexity. Our team is exceptionally experienced with Postgres, and we knew we could hit the ground running. S3, in contrast, had more unknowns, and given how rarely we access most of this metadata today, the value it would add over Postgres was tenuous at best.


In addition to migrating metadata to its own table, we took a couple additional steps:

1. We extracted the handful of regularly used fields from the metadata and migrated them into their own columns in the `message` table. This meant that we didn't need to retrieve large, megabyte sized blobs whenever we wanted a single field<sup>[3](#footnote3)</sup>. As an added advantage, we regained simple access to database [constraints](https://www.postgresql.org/docs/current/static/ddl-constraints.html).

2. When we created the new `metadata` table in Postgres, we made sure not to define a relationship between it and its related tables at the ORM layer, only the database layer. This makes it far more difficult for a developer to hobble performance by absentmindedly joining large metadata into queries. We introduced an API for accessing the metadata instead. The added advantage of this API is that we can now change the underlying implementation to use S3 (or anything else) in the future, without modifying dependent application code.


My name is Nick Drane. I do [consulting](/hire-me) work in the Chicago area and am always looking for new opportunities.

#### Footnotes

<a name="footnote1">1</a>: I used the following query:

```sql
SELECT avg(octet_length(m."meta"::text))
FROM message as m
```

<a name="footnote2">2</a>: I should clarify that performance measurements were done with a local Postgres installation where network congestion/throughput is not a relevant factor.

<a name="footnote3">3</a>: As I write this, I wonder if it wouldn't have been possible to leverage indexes to only retrieve specific pieces of the `meta` field. I wonder if our ORM provides any support for firstclass fields that are subfields of another field.
