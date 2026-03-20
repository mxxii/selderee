import test, { type ExecutionContext } from 'ava';

import { DecisionTree } from '../src/DecisionTree.ts';
import { treeify } from '../src/TreeifyBuilder.ts';

function snapshotMacro (
  t: ExecutionContext,
  input: [string, string][],
) {
  t.snapshot(
    (new DecisionTree(input)).build(treeify),
    `\`(new DecisionTree(${JSON.stringify(input)})).build(treeify)\``,
  );
}

test('empty input', snapshotMacro, []);

test('universal selector', snapshotMacro, [
  ['*', 'value 1'],
  ['*', 'value 2'],
]);

test('tag name', snapshotMacro, [
  ['foo', 'value 1'],
  ['bar', 'value 2'],
]);

test('attribute presence', snapshotMacro, [
  ['[foo]', 'value 1'],
  ['[bar]', 'value 2'],
]);

test('different attributes value', snapshotMacro, [
  ['#foo', 'value 1'],
  ['.bar', 'value 2'],
  ['[baz^=qux i]', 'value 3'],
]);

test('same attribute, different values', snapshotMacro, [
  ['[foo=a]', 'value 1'],
  ['[foo=b]', 'value 2'],
  ['[foo^=c s]', 'value 3'],
]);

test('combinators', snapshotMacro, [
  ['bar > foo', 'value 1'],
  ['qux + baz', 'value 2'],
]);

test('combinators with universal selector', snapshotMacro, [
  ['* + * > *', 'value 1'],
]);

test('compound selectors of different depth', snapshotMacro, [
  ['.foo', 'value 1'],
  ['.foo.bar', 'value 2'],
  ['.foo.bar.baz', 'value 3'],
]);

test('complex selectors of different depth', snapshotMacro, [
  ['[foo]', 'value 1'],
  ['[bar] + [foo]', 'value 2'],
  ['[baz] > [bar] + [foo]', 'value 3'],
]);

test('pop element to check the least common part', snapshotMacro, [
  ['[bar] + [foo][baz]', 'value 1'],
  ['[bar] + [foo]', 'value 2'],
]);

test('same combinators', snapshotMacro, [
  ['[bar] + [foo]', 'value 1'],
  ['[bar] + [foo]', 'value 2'],
]);

test('repeated simple selectors', snapshotMacro, [
  ['[foo][foo].bar.bar.bar.bar.bar', 'value 1'],
  ['[foo]', 'value 2'],
]);

test('non-ascii and escape sequences', snapshotMacro, [
  ['#\\..♫', 'value 1'],
  ['.👩‍🚀', 'value 2'],
  ['.\\22 .\\2d', 'value 3'],
  ['[\\31="\\31"]', 'value 4'],
]);

test('id selector vs id attribute value', snapshotMacro, [
  ['#foo', 'value 1'],
  ['[id="foo"]', 'value 2'],
  ['#foo.bar', 'value 3'],
  ['[id="foo"].bar', 'value 4'],
]);

test('supported pseudo-class selectors', snapshotMacro, [
  [':empty', 'value 1'],
  [':first-child:last-child', 'value 2'],
  [':only-child', 'value 3'],
]);

test('attribute value normalization', (t) => {
  const input: [string, string][] = [
    ['[type="text"]', 'value 1'],
    ['[TYPE="TEXT"]', 'value 2'],
    ['[Type="Text"]', 'value 3'],
    ['[data-foo="bar"]', 'value 4'],
    ['[data-FOO="BAR"]', 'value 5'],
  ];
  const options = { attributesWithNormalizedValues: ['type'] };
  t.snapshot(
    (new DecisionTree(input, options)).build(treeify),
    `\`(new DecisionTree(${JSON.stringify(input)}, ${JSON.stringify(options)})).build(treeify)\``,
  );
});
