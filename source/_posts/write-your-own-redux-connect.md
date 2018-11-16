---
title: Write Your Own React-Redux Connect
date: 2017-09-29 13:14:18
categories:
  - [React]
  - [Redux]
  - [Build Your Own]
---

_My inspiration for this blog post came from [this video](https://www.youtube.com/watch?v=VJ38wSFbM3A) where Dan Abramov walks through the source code to react-redux_

As frontend web developers, it's not uncommon that we follow well-specified patterns - often blindly. The frontend landscape is changing rapidly, and sometimes there isn't time to investigate why we use a specific pattern; we just know we should.

One widely used pattern in [react-redux](https://github.com/reactjs/react-redux) applications looks like this

```js
connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

I'll assume you know how to implement this pattern, but why do we use it and how does it work under the hood?

<!-- more -->

# Why Do we Need React-Redux?
React and Redux are two completely independent tools that have nothing to do with each other. React is a tool for creating user interfaces in the browser. Redux is a tool for managing state. Either tool can be used without the other. We often use them together because they both solve separate but very important and closely related problems. The purpose of react-redux is to get these two tools to talk.

But first, what would we do without react-redux? How would React and Redux talk?

# How to Integrate React and Redux Without react-redux
More precisely, how do we ensure that a React component re-renders when the Redux store changes? The answer lies in Redux's [subscribe](http://redux.js.org/docs/api/Store.html#subscribe) API.

```js
import store from './store'
import { Component } from 'react'

class MyComponent extends Component {
  constructor() {
    super();
    // One solution is to make each component
    // store the entirety of the redux state.
    this.state = { storeState: store.getState() };
  }

  componentDidMount() {
    // Callbacks passed to store.subscribe will be
    // invoked every time the store's state changes.
    // Our callback can get the state of the
    // store and add it to the component's local state.
    this.unsubscribe = store.subscribe(() => {
      this.setState({ storeState: store.getState() });
    });
  }

  // We need to make sure that we don't accidentally
  // subscribe to the store multiple times in the case
  // where a component mounts, unmounts, and then mounts a second time.
  // Fortunately, Redux makes this easy by returning
  // an unsubscribe function when store.subscribe is invoked.
  componentWillUnmount() {
    this.unsubscribe();
  }
}
```

If we insert the above boilerplate into every one of our React component's, then every component could have access to the store and would be informed through a subscription the moment the store's state changes. This configuration has three  flaws.

1. The boilerplate of subscribing and unsubscribing to the store is highly error prone and unnecessarily verbose.
2. All of our React component's are dependent upon knowledge of the Redux store. This is a complete failure of [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).
3. Every component is dependent upon the entirety of the store's state tree. This means that whenever an action is dispatched, `setState` is called on every mounted component, causing each one to re-render, regardless of whether its render function depends on the store state that changed. Woah! Let that sink in for a moment.

Let's write a rudimentary implementation of connect that resolves the first problem.

# Understanding The Syntax of Connect
Typically, we invoke `connect` like this:

```js
connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
```

`connect` takes in two functions as arguments and returns a function. Yes, you heard me, `connect` returns a function, not a component. Suppose I invoke `connect` and neglect to pass in a component.

```js
const connectFunc = connect(mapStateToProps, mapDispatchToProps);
const connctedComponent = connectFunc(WrappedComponent);
```

 `connect` will return to me a function. It's that function that takes in my component (`connect` is implemented this way as opposed to simply taking in 3 arguments to support decorator syntax. The Dan Abramov video I linked above explains this.)

Thus, the very first few lines of `connect` must look like this:

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {

  };
}
```

# Higher Order Components

And what does the function we returned above do? This function is implemented as a [higher order component](https://reactjs.org/docs/higher-order-components.html) (HOC). A HOC is a function that takes in a component as a parameter and returns a new component. The new component is generally a modified or augmented version of the original component.

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    // We are returning a brand new component.
    // Note that this new component does
    // not inherit from WrappedComponent.
    return class WrapperComponent extends Component {
      // All we are doing is returning a new component
      // that renders our original component.
      render() {
        // Notice that we need to pass WrappedComponent
        // WrapperComponent's props.
        // If we didn't do this, then WrappedComponent
        // would never have access to any props.
        return <WrappedComponent {...this.props} />;
      }
    };
  };
}
```

If we were to run the above `connect` function on a component, the connected component would behave identically to original component. Furthermore, we could nest `connect` as many times as we want

```js
connect(null, null)(connect(null, null)(App))
```

and still never distort the behavior of the original component. Our current implementation is effectively [idempotent](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation).

# Eliminating Boilerplate

Our next step is to eliminate some of the boilerplate code. We don't want to have to subscribe to the store every time we create a new component, so let's have our new `connect` function do it instead.

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    return class WrapperComponent extends Component {
      constructor() {
        super();
        this.state = { storeState: store.getState() };
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          this.setState({ storeState: store.getState() });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        // Since the whole point of this HOC is to get WrappedComponent
        // access to the store, we need to pass that state down as props.
        const storeState = this.state.storeState;
        return <WrappedComponent {...this.props} {...storeState} />;
      }
    };
  };
}
```

We just made huge progress! Now, whenever we invoke

```js
connect(null, null)(MyComponent)
```

we get a component that is subscribed to state changes on the store, and this state will be passed down to our component as props.

# Implementing Support for mapStateToProps

Our connected components still all depend on the entirety of the store's state tree. Look up above, the entire state is passed down as props to every connected component. To reiterate, this means that if any piece of the store's state is updated, our component will re-render.

This is where `mapStateToProps` comes to the rescue. `mapStateToProps` takes as its argument the store's state, and it allows us to return the particular pieces of the store's state that a component depends on. It then passes that state as props to our component instead.

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    return class WrapperComponent extends Component {
      constructor() {
        super();
        this.state = { storeState: store.getState() };
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          this.setState({ storeState: store.getState() });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        // Now, instead of passing down all of the store state,
        // we only pass down the subset of state return from
        // mapStateToProps
        const storeProps = mapStateToProps(this.state.storeState);
        return <WrappedComponent {...this.props} {...storeProps} />;
      }
    };
  };
}
```

All we did was insert a call to `mapStateToProps`, allowing us to make each connected component dependent upon only the state it cares about, as defined by the return value of `mapStateToProps`. `mapStateToProps` is a wonderful form of explicit documentation, clearly stating the slices of the state tree each component depends on. Unfortunately, our change does not fix the efficiency problems noted above. More on that below.

# mapStateToProps and ownProps

An astute reader might note that `mapStateToProps` actually takes two arguments: the first is a copy of the store's state, and the second are the props that are originally passed down to `WrapperComponent`. `react-redux` does not pass these down to the wrapped component by default as we do in the example immediately above. Let's modify our implementation to mirror `react-redux`.

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    return class WrapperComponent extends Component {
      constructor() {
        super();
        this.state = { storeState: store.getState() };
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          this.setState({ storeState: store.getState() });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        const newProps = mapStateToProps(this.state.storeState, this.props);
        return <WrappedComponent {...newProps} />;
      }
    };
  };
}
```

Now the implementer of `mapStateToProps` can choose which of `WrapperComponent`'s props it would like to keep and which it would like to disregard.

# What's the Point of mapDispatchToProps?

`mapDispatchToProps` is designed to eliminate React's dependency upon Redux. If we were to use the above implementation of `connect`, every component that dispatch's an action must import `store.dispatch`, and the implementation would look like this:

```js
import store from "./store";
import { Component } from "react";
import { updateThing } from "./store/actions";

class ExampleComponent extends Component {
  handleChange(e) {
    store.dispatch(updateThing(e.target));
  }
}
```

The above component 'knows' that it is part of a Redux application because it is explicitly referencing the store to dispatch actions. But we should always try to minimize the interaction of different pieces of architecture, esspecially when they have no need to interact. Ultimately, React components should not been intertwined with Redux code!

## Implementing Support for mapDispatchToProps

`connect` resolves this problem for us by injecting the `store.dispatch` dependency into `mapDispatchToProps`, allowing us to explicitly define functions that dispatch actions without requiring that our [presentation components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) have a dependency on the store. Just as the return value of `mapStateToProps` is passed down to `WrappedComponent`, the return value of `mapDispatchToProps` will be passed down as well.

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    return class WrapperComponent extends Component {
      constructor() {
        super();
        this.state = { storeState: store.getState() };
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          this.setState({ storeState: store.getState() });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        // Now we merge the results from mapStateToProps
        // and mapDispatchToProps and pass everything down
        const newProps = Object.assign(
          {},
          mapStateToProps(this.state.storeState, this.props),
          // If you aren't intimately familiar with the this keyword,
          // it's okay if you don't understand why we use bind here
          mapDispatchToProps(store.dispatch.bind(this))
        );
        return <WrappedComponent {...newProps} />;
      }
    };
  };
}
```


# More Efficiency Issues - Hello shouldComponentUpdate

We never actually fixed any of the performance issues noted above. The crux of the problem is that every time the store updates, `WrapperComponent` re-renders (because of its Redux store subscription that calls `setState`) and that means `WrappedComponent` re-renders. This [re-rendering](/leveraging-immutability-in-react) happens despite the fact that `WrappedComponent`'s props might be unchanged between two invocations of `setState`. In fact, this scenario is highly probable and will occur whenever a piece of state in the store changes that your component does not depend on (aka, a piece of store state not returned from from `mapStateToProps`).

React has a handy lifecycle method called [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) that allows us to return a boolean that indicates whether a component should re-render. In essence, if we implement this method on `WrapperComponent` and it returns `false`, then React will not re-render `WrapperComponent`. And it follows that `WrappedComponent` won't re-render either.

So, in the above scenario, when `WrapperComponent` calls `setState`, React first calls the `shouldComponentUpdate` method to see if a re-render should actually happen. Let's implement it below.

```js
// Just a simple shallow equality function
import shallowEqual from "shallow-equal/objects"

function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {
    return class WrapperComponent extends Component {
      constructor() {
        super();
        this.state = { storeState: store.getState() };
      }

      shouldComponentUpdate() {
        // If the props to WrapperComponent do not change
        // between setState calls, then we don't need to re-render.
        // On the previous re-render, we cached the results of
        // mapStateToProps. That's what this.oldProps is.
        const newProps = mapStateToProps(this.state.storeState, this.props);
        return !shallowEqual(newProps, this.oldProps);
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          this.setState({ storeState: store.getState() });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        // We need to hang onto the previous result of
        // mapStateToProps to use the next time
        // shouldComponentUpdate runs
        this.oldProps = mapStateToProps(this.state.storeState, this.props)
        const newProps = Object.assign(
          {},
          this.oldProps,
          mapDispatchToProps(store.dispatch.bind(this))
        );
        return <WrappedComponent {...newProps} />;
      }
    };
  };
}
```
I've created a demo [here](https://codesandbox.io/s/o43p70k66). Open the console and prove to yourself that `shouldComponentUpdate` is doing its job.

_I should note that this is not exactly what react-redux does because of edge cases, but the concept is still the same._

Now our wrapper and wrapped components will only re-render when the props returned from `mapStateToProps` change! This is a huge performance gain. This implementation of `connect` explains why adherence to [immutability is so important](http://redux.js.org/docs/faq/ReactRedux.html#react-not-rerendering) in redux's reducers. If you fail to respect immutability, the shallow comparison in the `shouldComponentUpdate` in `WrapperComponent` will likely return `false`, causing your connected component to not re-render when it should.

# Wrapping up

React-redux's `connect` method is remarkably simple and only performs a handful of operations.

1. It manages our component's subscription to the store so that our component can update when the store updates.
2. It allows us to explicitly define the slice of state our component is dependent upon using `mapStateToProps`.
3. It gives our component access to `store.dispatch` without requiring a direct dependency on the store.
4. It defines `shouldComponentUpdate`, ensuring that our components only re-render when the store state they depend on changes.

I hope you found this article helpful. Please feel free to email me and reach out if you have questions. I put a [gist](https://gist.github.com/nadrane/5221c64c421efe421bda9fdaab167dc2) online containing the same code as the demo.

_If you use the React/Redux stack and need help, I do [consulting](/hire-me) work and am currently looking for new clients. Please [contact me](mailto:nick@nickdrane.com) for more details._

