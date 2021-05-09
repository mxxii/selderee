const htmlparser2 = require('htmlparser2');
const util = require('util');

const { DecisionTree, Treeify } = require('../packages/selderee/lib/selderee.cjs');
const { hp2Builder } = require('../packages/plugin-htmlparser2/lib/hp2-builder.cjs');

const selectorValuePairs = [
  ['p', 'A'],
  ['p.foo[bar]', 'B'],
  ['p[class~=foo]', 'C'],
  ['div.foo', 'D'],
  ['div > p.foo', 'E'],
  ['div > p', 'F'],
  ['#baz', 'G']
];

// Make a tree structure from all given selectors.
const selectorsDecisionTree = new DecisionTree(selectorValuePairs);

// `treeify` builder produces a string output for testing and debug purposes.
// `treeify` expects string values attached to each selector.
const prettyTree = selectorsDecisionTree.build(Treeify.treeify);
console.log(prettyTree);

const html = /*html*/`<html><body>
  <div><p class="foo qux">second</p></div>
</body></html>`;
const dom = htmlparser2.parseDocument(html);
const element = dom.children[0].children[0].children[1].children[0];

// `hp2Builder` produces a picker that can pick values
// from the selectors tree.
const picker = selectorsDecisionTree.build(hp2Builder);

// Get all matches
const allMatches = picker.pickAll(element);
console.log(util.inspect(allMatches, { breakLength: 50, depth: null }));

// or get the value from the most specific match.
const bestMatch = picker.pick1(element);
console.log(`Best matched value: ${bestMatch}`);
