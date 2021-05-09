import test, {ExecutionContext} from 'ava';
import * as htmlparser2 from 'htmlparser2';
import { DecisionTree } from 'selderee';

import { hp2Builder } from '../src/hp2-builder';

const html = /*html*/`<html><body>
  <div><p id="A" class="foo qux">second</p><div id="B" baz>second</div></div>
</body></html>`;
const dom = htmlparser2.parseDocument(html);

function selectorsMacro(
  t: ExecutionContext,
  elemId: string,
  selectors: string[],
  isMatching: boolean
) {
  const dt = (new DecisionTree(selectors.map(s => ([s, s])))).build(hp2Builder);
  const element = htmlparser2.DomUtils.getElementById(elemId, dom.children, true);
  if (element === null) {
    t.fail('Couldn\'t get the element for test - check the test');
  } else {
    t.is(
      dt.pickAll(element).length,
      (isMatching) ? selectors.length : 0
    );
  }
}

test('universal match', selectorsMacro, 'A', ['*'], true);

test('tag name match 1', selectorsMacro, 'A', ['p'], true);

test('tag name match 2', selectorsMacro, 'B', ['div'], true);

test('tag name non-match 1', selectorsMacro, 'A', ['div'], false);

test('tag name non-match 2', selectorsMacro, 'B', ['p'], false);

test('attribute presence match 1', selectorsMacro, 'A', [
  '[class]',
  '[id]',
  '[class][id]'
], true);

test('attribute presence match 2', selectorsMacro, 'B', ['[baz]'], true);

test('attribute presence non-match 1', selectorsMacro, 'A', [
  '[baz]',
  '[class][baz]'
], false);

test('attribute presence non-match 2', selectorsMacro, 'B', ['[class]'], false);

test('attribute value match', selectorsMacro, 'A', [
  '.foo.qux',
  '[class~=FOO i]',
  '[class^="foO"i]',
  '[class*="o q"]',
  '[id$=A][id|=A]',
  '#A'
], true);

test('attribute value non-match', selectorsMacro, 'B', [
  '.baz',
  '[baz~=FOO i]',
  '[baz^="foO"i]',
  '[class*="o q"]',
  '[id$=A]',
  '[id|=A]',
  '#A'
], false);

test('combinators match', selectorsMacro, 'B', [
  '* > #B',
  '* > #B[baz]',
  'div > *',
  'p + div',
  'div > [class] + div'
], true);

test('combinators non-match', selectorsMacro, 'A', [
  '* > #B',
  'p > *',
  '* + *'
], false);
