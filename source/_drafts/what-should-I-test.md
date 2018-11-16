Tests should be on API boundaries.

One of the biggest issues I see with tests is that they assess implementation vs behavior. generally, the behavior manifests itself at an API boundary, something with well-defined inputs and outputs. This might be a 2 line function; it might be a RESTful API.

So how do I know what qualifies as an API boundary? A good rule of thumb is that if a function or class is only called or instantiated once, then chances are it's the wrong thing to test. You would be better served by testing upwards one layer of abstraction until you reach a function or class that is used (or at least intended to be used) in multiple places (obviously this isn't always the case). The nice thing about placing a test at an API boundary is that it allows you to rewrite the implementation of that API without breaking the test.

If your tests break when you rewrite your code, you can be pretty sure that you tested the wrong thing. More often than not, if refactoring breaks tests, one of two things went wrong.

1. You tested the implementation of the API rather than it's behavior
2. You tested at very granular level

In the first scenario, perhaps you tested to ensure that a specific function was called. This test ensures that your implementation is working as expected. In this sense it provides value, but wouldn't it be great if it ensured that any implementation worked as expected?

In the second scenario, perhaps you tested a two helper functions and then refactored the code such that the behavior of both functions was combined into a single function. These tests now need to be rewritten to accommodate that new function. It would have been much better if a higher level API could have been invoked that validated the behavior tested by both the two smaller functions and the one larger function.

## How is What Your Describing Different from Integration Testing

One huge misconception that I see is that a unit test needs to be at the most granular level. This is completely false. A unit test merely needs to test a unit of code, where a unit might be a single function or a function that delegates to several hundred lines of code. A much more accurate marker of a unit test is not the lines of code it tests or the number of functions it ultimately invokes but rather whether it does no IO.
