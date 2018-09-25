---
title: The Hidden Costs of PostgreSQL's JSONB datatype
date: 2018-09-16 15:41:16
categories:
  - [Postgres]
---


Postgres introduced the [JSONB](https://www.postgresql.org/docs/9.4/static/datatype-json.html) type in version 9.4 with considerable excitement. JSONB promised to marry a favorite relational database with the noSQL world, permitting data to be stored in the database as JSON but without requiring re-parsing whenever accessing a field. Moreover, the binary storage format allows for the indexing and complex queries against the stored JSON blobs. This data format embodies the flexible schema - perhaps when the schema is unknown - and was adopted readily at Fraight.

## Background

At Fraight, we've built a centralized communication platform that collates all inbound/outbound communication between our brokerage company and thousands of trucking partners. One of our main objectives is to automate this communication process, having our system parse and automatically react to inbound text messages, emails, and faxes. The first step was to capture the details of our conversations. This meant dumping entire http response bodies into a `JSONB` column named `meta` in the `message` table, knowing that this data will prove useful in the future.

In an ideal world, the third party API responses would have initially been broken down into discrete chunks, each stored in a separate column, but this initial JSONB schema was a pragmatic design decision. We knew it wasn't worth the engineering effort to try to understand the multitude of fields we receive from a half-dozen APIs, particularly when we had no idea at the time how we might use this information. But we did know it was valuable. Since we wanted it to be queryable, we chose JSONB over it's more inert and sometimes more size efficient cousin, the JSON datatype.

## Discovery

The CTO approached me the other day and explained that query performance over the `message` table had deteriorated. He further explained to me that the queries were only slow when the `meta` column was included in the result set. We had previously experienced slowdown in the `message` table when entire email attachment bodies were getting serialized and stored in the `meta` column, and I suspected that the root cause of our current performance problem was of a similar vein. A quick query revealed that our `meta` column was often quite large<sup>[1](#footnote1)</sup>,

The average size of the `meta` column was 3.7 kb. That might not seem large, but for our 100,000 row table, we're talking 400mb of mostly unused metadata. At high end of the spectrum, some messages were up to 17mb in size. The precise details of why this dataset slows down queries are a bit esoteric<sup>[2](#footnote2)</sup>, but the fact of the matter is that we storing too much information. You can read more about how PostgreSQL stores large data values [here](https://www.postgresql.org/docs/9.5/static/storage-toast.html).

## Further Complications

The first queries that used the `meta` column were for very simple tasks like showing the raw contents of an email to a user, perhaps in the case where message content extraction failed. Over time, however, we began using specific fields to drive business logic, and application code started to expect that `meta`'s JSON would to a specific shape. Any solution would likely necessitate changes to this application code.

So the problem was twofold

1. We needed to extract the actual metadata (as opposed to data driving business logic) from the `meta` column and place it in a location where it would not affect query performance over the `message` table.
2. We wanted to make the metadata less easily accessible. We recognized that making it accessible through the ORM made it ripe for misuse. We wanted to give it an alternative API that would lessen a developer's likeliness to rely on its structure.

## Solutioning

We looked at several solutions. Below are the three we considered most strongly:

1. Use the ORM to omit the `meta` column from all queries unless specifically included. Since we unnecessarily perform `select *` queries over the `message` table, this strategy, despite its messiness - and obvious maintainability issues - would increase the performance in most cases (with the occasional slow query) and would in theory be simple to implement. It wouldn't, however, resolve the underlying problem.

2. Keep the `meta` column as-is but extract specific keys to S3. In general, greater than 99% of the size of any given column's `meta` field was from a single key. For example, I explained how emails include attachments, other times message bodies document long, historical email chains. These fields would be specifically extracted and uploaded to S3. The database would only need to store a reference to the S3 content, and upon request, the server could generate a [pre-signed URL](https://docs.aws.amazon.com/AmazonS3/latest/dev//ShareObjectPreSignedURL.html), allowing the client directly download large files directly from S3.

3. Create a separate table in Postgres where metadata can be stored. It would have a foreign key back to the original table where the metadata belonged. This solution might seem a little odd at first glance, but I should clarify that this `meta` column pattern existed on more than just the `message` table.

Our instinct was to go with #1, the most simple and straightforward solution, and omit the `meta` column from most queries. Unfortunately, bugs in our ORM made it impossible to omit columns across joins without the occasional crash. Obviously we needed to consider alternatives.

This hiccup left the choice between S3 and a separate Postgres table. We agreed that S3 pre-signed URLs was an ideal longterm alternative but ultimately chose a separate Postgres table for the same reason that we wanted to choose option #1: minimal risk and complexity. Our team is exceptionally experienced with Postgres, and we knew we would hit the ground running. Leveraging S3, in contrast, had more unknowns and would almost certainly take longer, and given how rarely we intend to access this metadata, the value it would add over Postgres is tenuous at best.

You might be scratching your head right now. How does migrating the data to a new Postgres table solve either of the problems listed above? We did a couple additional things.

1. We needed to extract the handful of regularly used fields from the metadata and migrate them into their own columns in the `message` table. This meant that we didn't need to retrieve large, megabyte sized blobs whenever wanted just a single field<sup>[3](#footnote3)</sup>, and as an added advantage, we regained simple access to database [constraints](https://www.postgresql.org/docs/9.4/static/ddl-constraints.html)

2. When we created the new `metadata` table in Postgres, we made sure not to define a relationship between it and its related tables at the ORM layer, only the database layer. This makes it impossible for a developer to absentmindedly join large metadata into queries, accidentally creating slow queries. We introduced an API for accessing the metadata instead. The added advantage of this API is that we can now change the underlying implementation to use S3 - or anything else - if we need to in the future, without modifying dependent application code.

## Closing Thoughts

It's fortunate that we decided to do this migration early. As stands, the metadata was only used for business logic in a handful of places. In the future, we hope that making the metadata less easily accessible for force developer's to ex

#### Footnotes

<a name="footnote1">1</a>: I used the following query:

```sql
SELECT avg(octet_length(t."meta"::text))
FROM message AS t
```

<a name="footnote2">2</a>: I should clarify that performance measurements were done with a local Postgres installation where network congestion/throughput is not a relevant factor.

<a name="footnote3">3</a>: As I write this, I wonder if it wouldn't have been possible to leverage indexes to only retrieve specific pieces of the `meta` field. I wonder if our ORM provides any support for firstclass fields that are subfields of another field.
