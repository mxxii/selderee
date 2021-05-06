# selderee

![lint status badge](https://github.com/mxxii/selderee/workflows/lint/badge.svg)
![test status badge](https://github.com/mxxii/selderee/workflows/test/badge.svg)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/mxxii/selderee/blob/main/LICENSE)

**Sel**ectors **de**cision t**ree** - pick matching selectors, fast.

----


## What is it for

The problem statement: there are multiple CSS selectors with attached handlers, and a HTML DOM to process. For each HTML Element a matching handler has to be found and applied.

The naive approach is to walk through the DOM and test each and every selector against each Element. This means `n * m` complexity.

It is pretty clear though that if we have selectors that have something in common then we can reduce the number of checks.

The main `selderee` package offers the tree structure. Working decision functions for specific DOM implementations are built via plugins.


## Limitations

- Pseudo-classes and pseudo-elements are not supported by the underlying library [parseley](https://github.com/mxxii/parseley) (yet?);
- General siblings (`~`), descendants (` `) and same column combinators (`||`) are also not supported.


## `selderee` vs `css-select`

[css-select](https://github.com/fb55/css-select) - a CSS selector compiler & engine.

| Feature                               | `selderee` | `css-select` |
| ------------------------------------- | :--------: | :----------: |
| Support for `htmlparser2` DOM AST     | plugin     | +            |
| "Compiles" into a function            | +          | +            |
| Pick selector(s) for a given Element  | +          |              |
| Query Element(s) for a given selector |            | +            |


## Packages

| Package   | Version   | Folder    | Changelog |
| --------- | --------- | --------- | --------- |
| [selderee](https://www.npmjs.com/package/selderee) | [![npm](https://img.shields.io/npm/v/selderee?logo=npm)](https://www.npmjs.com/package/selderee) | [/packages/selderee](https://github.com/mxxii/selderee/tree/main/packages/selderee/) | [changelog](https://github.com/mxxii/selderee/blob/main/packages/selderee/CHANGELOG.md) |


## Install

```shell
> npm i selderee
```


## Documentation

- [API](https://github.com/mxxii/selderee/blob/main/docs/index.md)


## Usage example

```js
const { DecisionTree, Treeify } = require('selderee');

// Object can also be used if there are no repeating selectors.
const selectorValuePairs = [
  ['div', 'A'],
  ['div.foo[bar]', 'B'],
  ['p > div', 'C'],
  ['p.foo', 'D'],
  ['p > div.foo', 'E'],
  ['div[class~=foo]', 'F'],
  ['#baz', 'G']
];

// Make a tree structure from all given selectors.
const selectorsDecisionTree = new DecisionTree(selectorValuePairs);

// `treeify` builder produces a string output for testing and debug purposes.
// `treeify` expects string values attached to each selector.
const prettyTree = selectorsDecisionTree.build(Treeify.treeify);

console.log(prettyTree);
```

<details><summary>Example output</summary>

```text
▽
├─◻ Tag name
│ ╟─◇ = div
│ ║ ┠─▣ Attr value: class
│ ║ ┃ ╙─◈ ~= "foo"
│ ║ ┃   ┠─◨ Attr presence: bar
│ ║ ┃   ┃ ┖─◁ #1 [0,2,1] B
│ ║ ┃   ┠─◁ #5 [0,1,1] F
│ ║ ┃   ┖─◉ Push element: >
│ ║ ┃     └─◻ Tag name
│ ║ ┃       ╙─◇ = p
│ ║ ┃         ┖─◁ #4 [0,1,2] E
│ ║ ┠─◁ #0 [0,0,1] A
│ ║ ┖─◉ Push element: >
│ ║   └─◻ Tag name
│ ║     ╙─◇ = p
│ ║       ┖─◁ #2 [0,0,2] C
│ ╙─◇ = p
│   ┖─▣ Attr value: class
│     ╙─◈ ~= "foo"
│       ┖─◁ #3 [0,1,1] D
└─▣ Attr value: id
  ╙─◈ = "baz"
    ┖─◁ #6 [1,0,0] G
```

*Some gotcha: you may notice the check for `#baz` has to be performed every time the decision tree is called. If it happens to be `p#baz` or `div#baz` or even `.foo#baz` - it would be much better to write it like this. Deeper, narrower tree means less checks on average. (in case of `.foo#baz` the class check might finally outweight the tag name check and rebalance the tree.)*

</details>
