---
title: Using Shell Commands to Effortlessly Ingest Line-delimited JSON into PostgreSQL
date: 2018-10-18
categories: [Shell, Postgres]
---

I recently wanted to ingest a [line-delimited](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON) JSON file into [Postgres](https://www.postgresql.org/) for some quick data exploration. I was surprised when I couldn't find a simple CLI solution that parsed the JSON and loaded each field into its own column. Every approach I found instead inserted the entire JSON object in a JSONB field. Here is my solution.

<!-- more -->

## Downloading 250000 Hacker News Comments

Let's say we want to download all of the [Hacker News](https://news.ycombinator.com/) comments from the month of May. A line-delimited JSON file is available from [pushshift](https://files.pushshift.io/hackernews/HNI_2018-05.bz2). Fetching and decompressing the file is simple:

```bash
curl https://files.pushshift.io/hackernews/HNI_2018-05.bz2 | bzip2 -d
```

Here is what the dataset looks like:

```json
{
  "by": "criddell",
  "id": 16966059,
  "kids": [16966312, 16966776, 16969455, 16966323],
  "parent": 16965363,
  "retrieved_on": 1528401399,
  "text": "Yeah - there's always a HATEOAS comment somewhere and...",
  "time": 1525173078,
  "type": "comment"
}
```

## Formatting the Data

You might think that Postgres has a simple utility for loading line-delimited JSON. Like me, you'd be wrong. It's all the more surprising given that it has a [COPY](https://www.postgresql.org/docs/current/static/sql-copy.html) utility that's designed to load data from files. Unfortunately, that utility only supports `markup›text`, `markup›csv`, and `markup›binary` formats.

Transforming our data into a CSV is a breeze with [jq](https://stedolan.github.io/jq/). We can pipe the JSON stream into the following command to extract the `id`, `by`, `parent`, and `text` fields. You can customize the command to extract whatever fields you like.

```bash
jq -r '[.id, .by, .parent, .text] | @csv'
```

The `-r` option indicates that we would like a raw string output, as opposed to JSON formatted with quotes. The `js›[.id, .by, .parent, .text]` part produces an array containing the desired fields and the pipe into `bash>@csv` specifies the format. All that's left is to load the data into Postgres.

## Ingesting the Data

After creating the database

`createdb comment_db`

and applying the schema

```sql
CREATE TABLE comment (
    id INTEGER PRIMARY KEY,
    by VARCHAR,
    parent INTEGER,
    text TEXT
);
```

we can hydrate our comments into `comment_db` using [psql](https://www.postgresql.org/docs/current/static/app-psql.html)

```bash
psql comment_db -c "COPY comment (id, by, parent, text) FROM STDIN WITH (FORMAT CSV)"
```

Note that the fields specified above need to be in the same order as the fields in the CSV stream generated by `jq`.

Here is the final command

```bash
curl https://files.pushshift.io/hackernews/HNI_2018-05.bz2 \
  | bzip2 -d \
  | jq -r '[.id, .by, .parent, .text] | @csv' \
  | psql comment_db -c "COPY comment (id, by, parent, text) FROM STDIN WITH (FORMAT CSV)"
```

## Supporting Referential Integrity

You will notice that despite the fact that the `comment.parent` refers to a comment id, we have omitted a foreign key constraint from our schema. This omission is because our command does not control for the order in which comments are loaded. We would have received constraint errors if we specified the foreign key relationship.

We can overcome this obstacle by sorting our incoming comments by id.

```bash
curl https://files.pushshift.io/hackernews/HNI_2018-05.bz2 \
  | bzip2 -d \
  | jq -s -r 'sort_by(.id) | .[] | [.id, .by, .parent, .text] | @csv' \
  | psql comment_db -c "COPY comment (id, by, parent, text) FROM STDIN WITH (FORMAT CSV)"
```

If you have a primary key that doesn't serially increase - perhaps you're using a [natural key](https://en.wikipedia.org/wiki/Natural_key) or a UUID as your primary key - then you could also sort on a `created_at` timestamp

## Tradeoffs

Everything in software engineering has a tradeoff, and I would be remiss to to not mention them here. That `-s` option we specified above instructs `jq` to download the entire dataset into memory, a requirement for sorting. If you dataset is too large, then the command will fail (`jq` failed for me at 769MB).

The first option does not suffer this limitation and will work for arbitrarily large datasets. This is because it leverages [streams](https://en.wikipedia.org/wiki/Stream_(computing) to only work on small chunks of data at once. If your dataset is large and you want foreign key constraints, you could use this streaming approach and then apply the constraints after data ingestion completes.

_If you have a data ingestion or PostgreSQL related problem, I do [consulting](/hire-me) work out of Chicago area and am currently looking for new clients. Please contact me for more details_