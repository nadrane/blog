---
title: Leveraging Immutability in React
categories:
- React
- Immutability
---

React has taken the web development community by a storm, and with it functional programming concepts have embedded themselves in the mainstream. One common statement you will often read is that all state in React should be immutable, and this practice is justified as necessary for performance reasons. This statement is entirely true, but it only tells half the truth. Immutability alone will not yield any performance gains in React (it'll actually make things slower).

# The Quick Answer
You can reap the gains from immutable state in React if you inherit from `React.PureComponent` instead of `React.Component`

```js
class MyComponent extends PureComponent {...}
```

# A Broader Perspective
So why does the above code work? That requires a little bit of knowledge about the rendering process.

## Virtual DOM
A component's `render` function returns a tree of React elements, also known as the virtual DOM. This data structure is a representation of the browser's DOM that React can manipulate in a performant way. In essence, it's a 1-1 mapping to the browser DOM.

Whenever state or props change, instead of updating the browser DOM directly, React will call the `render` function of the updated component, getting its new virtual DOM, and it will compare that virtual DOM to the previous render tree (aka the old virtual DOM). This comparison process (known as reconciliation) allows it to identify the minimum set of changes that need to be made to the browser DOM, allowing for for massive performance gains. If the two trees are identical, then no changes need to be made to the UI.

## Should a Component Re-render
When `setState` is called on a component, it and all of it's child components need to go through a two step process for React determine if the UI should update.

First, it runs the component `shouldComponentUpdate` lifecycle method

### shouldComponentUpdate

It is your choice to implement this method. It takes as parameters the new state and props and should return a boolean indicating whether the component should be re-rendered. React will only proceed to the next step if you return true from this function. By default, `shouldComponentUpdate` always returns true.

Let's look at a simple example

```js
class Counter extends React.Component() {
  constructor() {
    this.state = {
      counter: 0
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We are comparing the current state to the what the
    // state will be now that setState has been called
    return this.state.counter !== nextState.counter
  }

  render() {
    return <span>{this.state.counter}</span>
  }
}
```

The above code says that the `Counter` component will only re-render if `state.counter` has changed. Suppose that we had omitted the `shouldComponentUpdate`, when might we have called the `Counter`'s render function despite it's state not having changed (after all, it never changes in the above code)? It would be invoked if one of `Counter`'s parents re-rendered! It does not matter that `Counter`'s render function does not depend on props! The render function is still called and the virtual DOM created.

If `shouldComponentUpdate` returns true, then React begins the second part of the re-render process, the part where it invokes the render function of that component, generating it's virtual DOM. It will then compare that render tree to the old virtual DOM. In the scenario above, these two trees will always be identical (after all, the component doesn't even have a way to change state), and the entire operation will a be waste CPU cycles. Effectively, `shouldComponentUpdate` allows us to inform React when a re-render will not be necessary, sparing it an unnecessary to call a component's render function.

# React.pureComponent
Writing `shouldComponentUpdate` is sometimes a tedious task, and React supplies a helper to handle a very common `shouldComponentUpdate` scenario. I mentioned `React.pureComponent` above.

```js
class MyComponent extends PureComponent {...}
```

`React.pureComponent` is a handy class that we can inherit from that implements `shouldComponentUpdate` as a shallow comparison across the old props and new props (or the old state and new state). If there are no *shallow* differences between these objects, then `shouldComponentUpdate` will return false, and the virtual DOM's re-rendering process can be skipped entirely, resulting in potentially enormous performance savings.

# Why Does Immutability Matter?
Immutability matters because `React.pureComponent` is going to do shallow comparisons against the prop and state objects. And, as you hopefully know, a shallow comparison's referential equality checks will only yield the expected results if immutability is respected.

If you are not properly respecting immutability, then you are going to run into scenarios where your components fail to re-render when they actually should. A failure to respect immutability will cause a shallow comparison to return false (meaning `shouldComponentUpdate` returns false) because the old props and new props (or the old state and new state) reference the same object in memory, despite the fact that props/state changed.

When used carefully however, `React.pureComponent` can yield enormous performance improvements at almost no cost. All you need to do is inherit your components from `React.pureComponent` instead of `React.Component` and respect immutability when changing state.

I hope you found this article helpful. Please feel free to email me to reach out if you have questions. I also welcome comments below.