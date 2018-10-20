---
title: microservices failure
categories:
- [Architecture]
- [Failures]
---

Programming is often about confronting failure: failed designs, faulty problem statements, poor management of time or requirements. Whenever I encounter a significant failure, I like to do a postmortem. Ultimately, I believe it's through this introspection that growth is maximized and that similar failures can be avoided in the future.

6 weeks ago I started working on a client project to build a dialogue management system. The client is a Freight brokerage and wants to be able to coordinate all of its communication with truckers, dispatchers, warehouse operators etc with automated bots. My task is to build a framework that makes it easy to write bots and extract meaningful NLU information that can later be used to train an AI.

The first thing I did was come up with a prototype that would allow us to write bots and engage in conversations with them. This system was essentially a CLI tool, and the goal was to set in stone the API for writing bots before tackling to complexity of integrating the system with the greater application. I completed this task in short order, and one of the company's engineer's and I began to process of integrated this bot framework into the great web app. The problem was complicated by the fact that the web app already used a bot system that it outgrew months earlier.

The first bot system had 2 tables in a relational database that drove the majority of it's functionality. Our first major decision was whether our bot system should live on it's own machine in it's own repository. If we needed any data from the original system, we would simply ask for it. We made the choice to do this, and it turned out to be the wrong decision.
