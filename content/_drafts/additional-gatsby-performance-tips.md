- Be careful what dependencies you include and how large they are
  Does code splitting on a per page basis help mitigate this issue?
  Is there any dead code elimination?
  Prefer built in javascript methods to libraries, but remember even your code has a footprint
  If you import something like lodash, import the specific helpers you need instead of the entire library

- Maybe talk about a tool that helps people see the size contribution of various dependencies to their overall bundle?

- gatsby-offline

- gatsby-image

- audit with Google Lighthouse
