---
title: "The Hidden Costs of PostgreSQL's JSONB Datatype: Part II"
date: 2018-10-03
categories:
  - [Postgres]
---

I recently wrote an [article](/https://nickdrane.com/hidden-costs-of-postgresql-jsonb/) on some hiccups I ran into while using [JSONB](https://www.postgresql.org/docs/current/static/datatype-json.html). This article is written from the perspective of the application developer and discusses architectural decisions made to overcome issues with JSONB. This article is written from the perspective of the database engineer and will dive into the nitty-gritty performance benchmarking of Postgres and will explain how I identified why JSONB was a problem.

## Background

As I explained previously, at Fraight we have a `message` table that contains a JSONB `meta` column. We discovered that our queries drastically slowed down when this column was included in `SELECT` statements. Performance resumed to normal if it was omitted.

## Specifics

We were making simple queries against the `message` table that looked like this:

```sql
SELECT id, content, subject, meta
FROM message
WHERE channel_id = 123
```

In this case, the `channel_id` relates back to the `channel` table with a one-to-many relationship. The channel_id is indexed. Note that we are not ordering or grouping or doing anything interesting with `meta` at all.

## Query Plan

The query plan is painfully uninteresting. As expected, we are indexing on the channel_id.

```
Bitmap Heap Scan on message  (cost=69.84..6221.86 rows=3296 width=811) (actual time=0.600..2.230 rows=3166 loops=1)
  Recheck Cond: (channel_id = 44789)
  Heap Blocks: exact=1691
  ->  Bitmap Index Scan on message_channel_id  (cost=0.00..69.01 rows=3296 width=0) (actual time=0.343..0.343 rows=3166 loops=1)
        Index Cond: (channel_id = 44789)
Planning time: 0.113 ms
Execution time: 2.517 ms
```

I had already had suspicions that the `meta` column was large and began to investigate further

```sql
SELECT octet_length(m."meta"::text)
FROM message as m
WHERE octet_length(m."meta"::text) IS NOT NULL
ORDER BY octet_length(m."meta"::text) DESC;
```

This query revealed that some `meta` columns were consuming up to 17mb of space, in the most extreme cases.

## TOAST

When a column in a tuple (a single row) in Postgres becomes to large (by default exceeding 2kb), it is stored "out-of-line" in a TOAST table. This effectively means that in order to retrieve the entirety of the contents of a given tuple, it might be necessary to query not only the original table but also a secondary TOAST table. And if the column is large enough, the TOAST table might need to be queried many times.

I suspected that the `meta` column was toasting and with a little help from the [Postgres docs](https://www.postgresql.org/docs/10/static/disk-usage.html), I was able to readily verify by theory.

```sql
SELECT relname, relpages
FROM pg_class,
     (SELECT reltoastrelid
      FROM pg_class
      WHERE relname = 'message') AS ss
WHERE oid = ss.reltoastrelid OR
      oid = (SELECT indexrelid
             FROM pg_index
             WHERE indrelid = ss.reltoastrelid)
ORDER BY relname;
```

```
pg_toast_1432460	17731
pg_toast_1432460_index	209
```

We can see that the message table has 17731 disk pages of information storing the contents of the TOAST table and another 209 pages dedicated to storing the TOAST table's index.

Maybe estimate how long this read would take from disk?

When the migrations are applied, we can see that the TOAST table pages goes to 0.

Show how the execution time of the query plan is affected

Look up how to benchmark postgres properly.

Think about whether it makes sense for the cache to be warm or not. Probably warm.

This a grand total of