---
title: Write Your Own React-Redux Connect
date: 2017-09-29 13:14:18
categories: Redux
---

As web developers, it's not uncommon that we are asked to follow specific patterns - and I often see developers follow them somewhat blindly. I hardly blame this on the developers, however. He frontend landscape is changing daily, and it's  I see this a lot sometimes there isn't time to why we a specific patterns in the first place.

One pervasive pattern across any application that uses [react-redux](https://github.com/reactjs/react-redux) looks like this

```js
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

I'll assume you know what to use implement this pattern quite intuitively, but how does it work, and why do we want to use it in the first place?

First we need to ask, how would we integrate React and Redux without using react-redux? Dispatching actions is obvious, but how do we ensure that the React component's state updates every time the Redux store changes? The answer lies in Redux's [`subscribe`](http://redux.js.org/docs/api/Store.html#subscribe) api.

```js
import store from './store'
import { Component } from 'react'

class MyComponent extends Component {
  constructor() {
    // One solution is to make each component store the entirety of the redux state.
    this.state = store.getState()
  }

  componentDidMount() {
    // Callbacks passed to store.subscribe will be all be invoked every time the store's state changes
    // Each callback will be then get the state of the store and throw it on the component's local state
    this.unsubscribe = store.subscribe(()) => this.setState(store.getState()))
  }

  // We need to make sure that we don't accidentally subscribe to the store multiple times in the case
  // where a component mounts, unmounts, and then mounts a second time.
  // Fortunately, Redux makes this easy by returning an unsubscribe function when store.subscribe is invoked.
  componentWillUnmount() {
    this.unsubscribe()
  }
}
```

If we insert the above boilerplate into every one of our React component's, then every component could have access to the store, and every component would be informed through a subscription the moment the store's state changed. This configuration has 2 terrible flaws.

1. The boilerplate of subscribing and unsubscribing to the store is highly error prone and unnecessarily verbose.
2. Every component is dependent upon the entirety of the store's state tree. This means that whenever an action is dispatched, setState is called on every mounted component. Calling setState on every mounted component means that every component re-renders, regardless of whether the state its render function depends on actually changed. Woah!

So let's write a rudimentary implementation of connect to resolve these problems.

# Understanding The Syntax of Connect
Typically, we invoke connect like this:

```js
connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

`Connect` takes in two functions as arguments and returns a function. Yes, you heard me. `Connect` returns a function, not a Component.

Suppose I invoke connect like this,

```js
connect(mapStateToProps, mapDispatchToProps)`,
```

neglecting to pass in a component. `Connect` will return to me a function. It's that function that takes in my component.

Thus, very first few lines of `connect` must look like this:

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(MyComponent) {

  }
}
```

# Higher Order Components

And what does the function we returned above do? This function is what's called a [higher order component](https://reactjs.org/docs/higher-order-components.html) (HOC). A HOC is a function that takes in a component as a parameter and returns a new component. The new component is generally modified or augmented version of the original component.

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(MyComponent) {
    return class WrapperComponent extends Component() {
      // Here, all we are doing is returning a component that renders our component.
      render() {
        // Notice that we need to pass MyComponent the props that WrapperComponent received when it was rendered
        // If we didn't do this, then MyComponent would never have access to any props
        <MyComponent {...this.props} />
      }
    }
  }
}
```

Our next step is to eliminate some of the boilerplate code that you see above. We don't want to have to subscribe to the store every time we create a new component, so let's have our new `connect` function do it instead.

```js
function connect(mapStateToProps, mapDispatchToProps)(MyComponent) {
  return class WrapperComponent extends Component() {

    constructor() {
      this.state = store.getState()
    }

    componentDidMount() {
      this.unsubscribe = store.subscribe(()) => this.setState(store.getState()))
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      <MyComponent {...this.props} />
    }
  }
}
```

We just made huge progress! Now, whenever we pass a component