import test, { type Macro } from 'ava';

import { DecisionTree } from '../src/DecisionTree.ts';

type UnsupportedSelectorMacroOptions = {
  title: string;
  selector: string;
  expectedMessage: string;
};

const unsupportedSelectorMacro: Macro<[UnsupportedSelectorMacroOptions]> = {
  exec (t, options: UnsupportedSelectorMacroOptions) {
    const { selector, expectedMessage } = options;
    t.throws(
      () => new DecisionTree([[selector, 'value']]),
      { message: expectedMessage },
    );
  },
  title: (_provided: string | undefined, options: UnsupportedSelectorMacroOptions) =>
    options.title,
};


test(
  unsupportedSelectorMacro,
  {
    title: 'unsupported combinators should fail: descendant',
    selector: 'foo bar',
    expectedMessage: 'Unsupported selector kind: combinator  ',
  },
);

test(
  unsupportedSelectorMacro,
  {
    title: 'unsupported combinators should fail: sibling (~)',
    selector: 'foo ~ bar',
    expectedMessage: 'Unsupported selector kind: combinator ~',
  },
);

test(
  unsupportedSelectorMacro,
  {
    title: 'unsupported combinators should fail: column (||)',
    selector: 'foo || bar',
    expectedMessage: 'Unsupported selector kind: combinator ||',
  },
);


test(
  unsupportedSelectorMacro,
  {
    title: 'unsupported pseudo-class selectors should fail: :root',
    selector: ':root',
    expectedMessage: 'Unsupported pseudo-class: :root',
  },
);

test(
  unsupportedSelectorMacro,
  {
    title: 'unsupported pseudo-class selectors should fail: :only-of-type',
    selector: ':only-of-type',
    expectedMessage: 'Unsupported pseudo-class: :only-of-type',
  },
);


test(
  unsupportedSelectorMacro,
  {
    title: 'functional pseudo-class selectors should fail: :nth-child()',
    selector: ':nth-child(2n+1)',
    expectedMessage: 'The input ":nth-child(2n+1)" was only partially tokenized, stopped at offset 11!\n:nth-child(2n+1)\n           ^',
  },
);

test(
  unsupportedSelectorMacro,
  {
    title: 'functional pseudo-class selectors should fail: :is()',
    selector: ':is(.foo)',
    expectedMessage: 'Unsupported selector kind: fpc:is',
  },
);

