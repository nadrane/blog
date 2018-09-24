---
title: The Hidden Costs of PostgreSQL's JSONB datatype
date: 2018-09-16 15:41:16
categories:
  - [Postgres]
---

One of my clients approached me the other day with a performance problem. The CTO explained that queries over the `message` had deteriorated over time and were now slow. He further explained to me that the queries were only slow when a particular [JSONB column](https://www.postgresql.org/docs/9.4/static/datatype-json.html) was included in the result set. I set off to resolve to problem, eager to discover the cause

## Background

At Fraight, we've built a centralized communication platform that collates all inbound/outbound communication between our brokerage company and thousands of trucking partners. Each communicate exchange is stored in the `message` table. This includes text messages, emails, and faxes.

At Fraight, we're trying to automate this communication process between our organization and our partners. We recognize that it's essential to capture the details of our conversation if we ever hope to have machine's extract meaningful inferences from inbound messages. This means that we store EVERYTHING we get from our third party APIs. We have a `JSONB` column named `meta` in the `message` table where we're dumping entire http bodies from services like Twilio, Mailgun, and Phaxio, knowing that this data will prove useful in the future.

This initial schema was a pragmatic design decision. We knew it wasn't worth the engineering effort to try to understand the multitude of fields we receive from various third party APIs, particularly when we had no idea at the time how we might use this information. But we did know it was valuable, and we wanted it to be queryable and accessible, hence why we chose JSONB over it's more inert and sometimes size efficient cousin, the JSON datatype.

## Discovery

Determining the root cause was relatively simple. A couple queries revealed that the JSONB column, which we had named `meta`, revealed that the column was often quite large:

```
SELECT avg(octet_length(t."meta"::text))
FROM message AS t
where octet_length(t."meta"::text) is not NULL;
```

The average size of the meta column is 3.7 kb. That might not seem large, but for our 100,000 row table, it's actually 400mb of metadata. At high end of the spectrum, some message's are up to 17mb in size. The precise details of why this dataset slows down queries are a bit esoteric, but the fact of the matter is that we storing too much information. You can read more about how PostgreSQL stores large data values [here](https://www.postgresql.org/docs/9.5/static/storage-toast.html).

## Further Complications

The first queries that used the `meta` column were for very simple tasks like showing the raw contents of an email to a user, perhaps in the case where message content extraction failed. Overtime we began using select fields from the `meta` column to drive business logic, and application code started to expect that the `meta` data structure would conform to a specific shape.

So the problem was twofold

1. We needed to extract the actual metadata (as opposed to data driving business logic) from the `meta` column and place it in a location where it would not affect query performance over the `message` table.
2. Access patterns touching the `meta` column were tightly coupled with our ORM. Changing the underlying storage mechanism for metadata would break all application logic that dependend on it. This code needed to be migrated, and an abstraction needed to be built so that the metadata storage layer could change in the future without requiring any applicaiton logic changes.

This presented a conundrumn when we began solutioning. migration complicated because code relying on structure of meta data structure. 

Some of the fields stored in the `meta` data structure deserved their own columns in the mesasge table.
no proper constraints

## Solutioning

We looked at several solutions:

1. Use the ORM to omit the `meta` column from all queries unless specifically included. This strategy, despite its messieness, would increase the performance in most cases (with the occasional slow query) and would in theory be simple to implement. It wouldn't, however, resolve the underlying problem.

2. Store the metadata in MongoDB. The data could remain schemaless and queryable. 

3. Keep the `meta` column as is but extract specific keys to S3. In general, greater than 99% of the size of any given column's `meta` field was from a single key. For exmample, sometimes emails include attachments, other times message bodies include long sequences of html, documenting a historical email chain. These fields would be specifically extracted and uploaded to S3. The database would only need to store a reference to the S3 content S3, and upon request, the server could generate a [pre-signed URL](https://docs.aws.amazon.com/AmazonS3/latest/dev//ShareObjectPreSignedURL.html), allowing the client directly download large files from S3.

4. Create a separate table in Postgres where metadata can be stored. It would have a foreign key back to the original table where the metadata belonged. This solution might seem a little odd at first glance, but I should clarify that this `meta` column pattern existed on more than just the `message` table.

Our instinct was to go with #1, the most simple and straightforward solution, and omit the `meta` column from most queries. Unfortunately, bugs in our ORM made it impossible to omit columns across joins without the occassional crash. Obviously we needed to consider alternatives.

We ruled out MongoDB pretty readily because it would introduce additional unmanaged infrastructure into our system. This left the choice between S3 and a separate Postgres table. We agreed that S3 presigned URLs was an ideal longterm alternative but ultimately chose a separate Postgres table for the same reason that we wanted to choose option #1: risk and complexity. Our team is exceptionally experienced with Postgres, and we knew we would hit the ground running. Leveraging S3, in contrast, had more unknowns and would almost certainly take longer, and the value it would add over Postgres at our current scale is tenuous at best. 


This is a very simple bandaid to a relatively opaque performance problem, but it hides a more serious concern.
These fields probably should have been their own atomic fields in our `message` schema, but the conversion wasn't simple anymore. We couldn't simply change our code to save off this field, since numerous other parts of the codebase relied on it's existence in the `meta`JSON data structure. 

We discussed a variety of potential solutions. One included storing the metadata in MongoDB. We could still keep the data unstructured but queryable without having it affect the performance of other queries.

It's unfortunate that we didn't do this migration sooner since development pattersn are contagious. You see, when the first developer started driving business logic based on the `meta` column, other developers started following suit. This data migration didn't need to also include tons of application logic changes. But then again, who knows what the original developers reasoning was when he began accessing values from the `meta` column. Perhaps it was a reasoned decision about deferring technical deby until later.






