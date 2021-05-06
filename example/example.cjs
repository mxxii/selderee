const { DecisionTree, Treeify } = require('../packages/selderee/lib/selderee.cjs');

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
