---
title: Immutability in React
categories:
- React
- Immutability
---

React has taken the web development community by a storm, and with it functional programming concepts have embedded themselves in the mainstream. One common statement you will often read is that all state in React should be immutable, and this practice is justified as necessary for performance reasons. This statement is entirely true, but it only tells half the truth. Immutability alone will not yield any performance gains in React.

# The Quick Answer
You can reap the gains from immutable state in React if you inherit from `React.PureComponent` instead of `React.Component`

```js
class MyComponent extends PureComponent {...}
```
_The following assumes the reader understands reference equality vs. value equality, immutability, and has a solid foundation in React fundamentals_

# A Broader Perspective
So why does the above code work? That requires a little bit of knowledge about the render cycle in React.

By default, whenever `setState` is called on a component, that component and all of it's child components begins the re-rendering process.

## Re-rendering
Two things happen in a component's re-rendering process.

1. It's `shouldComponentUpdate` lifecycle method is invoked. It is your choice to implement this method; React will not do so by default. This method should return a boolean indicating whether the component should be re-rendered. React will only proceed to the next step if you return true from this function. By default, in React 15, `shouldComponentUpdate` always returns true.

2. Next React uses your state and the render method of your component to generate the virtual DOM. This data structure is an intermediate representation of the browser's DOM that React can manipulate in a performant way. In essence, it's basically a 1-1 mapping to the browser DOM.

React will compare this new virtual DOM to the previous instance of the virtual DOM and examine them for differences (remember, differences would exist because the render function of your component might return something different because you changed the state of a component). If the virtual DOMs differ, the browser DOM must be updated to reflect the virtual DOM's changes. If the virtual DOMs are the same, the browser DOM ford not need to change. The modification of the browser DOM is relatively expensive compared to the modification of the virtual DOM, so in the case that this former DOM does not need to be modified, there are large performance savings.

## shouldComponentUpdate
We glossed over the importance of `shouldComponentUpdate`, but it's truly the crux of the entire conversation. A proper implementation of `shouldComponentUpdate` allows us to avoid the regeneration of the virtual DOM in scenarios where we are positive it will be identical to the current virtual DOM. That is, if we know that a re-render will not result in browser DOM updates, we have no need to call the render function in the first place. `shouldComponentUpdate` allows us to inform React when a re-render will not be necessary.

### How's it work?
`shouldComponentUpdate` is passed the new props and new state that are the result of the setState that triggered the re-render process. Remember, setState could have been called on this component or any component further up in the render tree (your component has a parent that called setState).


```js
shouldComponentUpdate(nextProps, nextState) {

}
```

## React.pureComponent
`React.pureComponent` is a handy class that we can inherit from when our component renders the same virtual DOM given the same props and state. It will implement a shallow comparison of the old props and new props and the old state and the new state. If there are no *shallow* differences between these objects, then `shouldComponentUpdate` will return false, and the virtual DOM re-rendering process can be skipped entirely, resulting in potentially enormous performance savings.

## Why Does Immutability Matter?
Immutability matters because `React.pureComponent` is going to do shallow comparisons against the props objects and state objects. What this means is out of scope of this blog post, but the long and short of it is that if you use `React.pureComponent` but are not properly respecting immutability, then you are going to run into scenarios where your components fail to re-render when they actually should. This is because failure to respect immutability will cause `shouldComponentUpdate` to return false because the old props and new props (or the old state and new state) reference the same object in memory, despite the fact that it changed.