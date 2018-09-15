---
title: Ethical Engineering for the Average Engineer
date: 2018-09-15 09:24:16
categories:
  - [ethics]
---

Two months ago I purchased a GPS device from [spot](https://www.findmespot.com/en/). Today, upon trying to cancel the service, the customer service representative informed me that I had accidentally enrolled by myself into a 1 year, $250 contract and that I was unable to cancel. He told me that if I blocked the monthly charges against my credit that they would report the debt to a collections agency. I was initially upset but soon realized it was a great opportunity to talk about ethics in software engineering.

## SPOT's Marketing Materials

The representative told me to look at their website where he claimed it would be very clear that I was signing up for a contract service. Unfortunately, I'm unable to open the registration page where I actually signed up for the service, but here is a page from their marketing materials:

[Spot Marketing Website][spot-marketing-material.png]

If you look at the image above, several very deliberate decisions have been made to disguise the nature of the month-to-month arrangement.

1. The font of the month-to-month price is large, bold, and colorful. It's designed to stand out
2. The 12 month contractual stipulation, on the other hand, is written in unnecessarily small font.
3. The contractual stipulation is visually underwhelming. Notice that the orange contrasts less against a black background, particularly when juxtaposed against the big, bright, and bold "monthly cost" header
4. The terms of the contract are visually separated from the price!

None of this could be chalked up to accident, except perhaps point 3 (I might give them the benefit of the doubt considering how terrible their font choices are). Ultimately, this marketing website's content is designed to mislead the consumer, hurting them for the business's gain.

## Software Ethics and Mainstream Media

The software industry is rife with ethics scandals. One of the the most glaring examplea from the past year is when Volkswagon engineered some of their vehicles to [fool emissions tests](https://en.wikipedia.org/wiki/Volkswagen_emissions_scandal). Other ethics scandals are less cut and dry. Some examples

1. [Dozens of iPhone applications sending user selling user location data](https://techcrunch.com/2018/09/07/a-dozen-popular-iphone-apps-caught-quietly-sending-user-locations-to-monetization-firms/)
2. [Equifax exposing 143 million SSNs to hackers in a data breach](https://www.ftc.gov/equifax-data-breach)
3. [United States surveillance software](<https://en.wikipedia.org/wiki/PRISM_(surveillance_program)>)

Ethics is such an incredibly slippery slope, and often two sides exist to any argument. For example, iPhone application engineers might argue that they aren't hurting consumers by selling their location information. Governments argue that they protect their citizens through surveillance software, even if that's at the cost of their privacy. An engineer of that very software might believe that the code itself is not unethical, only improper use of it. A utilitarian might argue that software that hurts someone is ethical if that hurt is outweighed by net good. Ultimately, I concede that it's often unclear what constitutes unethical. But it does raises a really good question: as software engineers, what code should we for live by?

## Ethics for the Average Engineer

It's easy to get consumed in the minutia, but that's okay. The media tends to focus on ethics scandals that have immense gravity, either in the scope of the number of people they affect or in the magnitude with which they affect their targets. But the majority of software engineers aren't writing software that necessitates answering the above questions. Most of us are writing simple e-commerce applications or iPhone apps -- boring software. The case study with SPOT is interesting precisely because of how boring it is. It's true to life, and it accurately represents the ethical dilemmas the average engineer might face. And fortunately for us, these "ethical dilemmas" are sometimes pretty cut and dry, provided we have the awareness to recognize them and the courage to speak up.

## The Takeaway

Just because you work on boring software does not mean that it's immune from negatively impact the lives of your users. As a firm advocate of transparency, I believe the first step in this direction is increased awareness. As a developer, it's essential to ask how your software will affect your users. If it might hurt them, it's probably appropriate to step back and consider the the greater picture. If it's obvious that your code is designed to manipulate or mislead your users, it's time to speak up.
